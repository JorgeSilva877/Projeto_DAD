<?php

namespace App\Http\Controllers\api;

use Carbon\Carbon;
use Laravel\Sanctum\PersonalAccessToken;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use App\Http\Resources\UserResource;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Requests\UpdateUserPasswordRequest;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    /*public function index(){
        return User::get();
    }*/

    public function index(){
        //paginate4
        return UserResource::collection(User::paginate(4));
    }

    public function updateBrainCoins(Request $request)
    {
        //atualiza o saldo de brain coins do usuário
        $user = $request->user();
        $user->brain_coins_balance = $request->brain_coins_balance;
        $user->save();
        return new UserResource($user);
    }

    public function updateBlocked(Request $request, User $user)
    {
        //atualiza o status de bloqueio do usuário
        $user->blocked = $request->blocked;
        $user->save();
        return new UserResource($user);
    }

    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(null, 204);
    }

    public function getTotalUsers(){
        return User::where('type', 'P')->get()->count();
    }

	public function showMe(Request $request)
	{
		return new UserResource($request->user());
	}

	public function update(UpdateUserRequest $request, User $user)
    {
        if ($request->photo_filename == '') {
            $user->fill($request->except(['photo_filename']));
        }else{
            $user->fill($request->validated());
        }

		//Se a imagem foi enviada, converter de base64 string em file
        if (!empty($request->photo_filename)) {
            // Extrair o tipo do arquivo e os dados da string Base64
            preg_match('/^data:image\/(\w+);base64,/', $user['photo_filename'], $matches);

            // Tipo de imagem
            $fileExtension = $matches[1] ?? 'png';
            // Gerar um nome único para a imagem
            $fileName = uniqid() . '.' . $fileExtension;
            // Decodificar a Base64 para binário
            $imageData = base64_decode(preg_replace('/^data:image\/\w+;base64,/', '', $user['photo_filename']));
            if ($imageData === false) {
                return response()->json(['error' => 'Invalid image data'], 400);
            }

            // Salvar a imagem no disco (storage/app/public)
            $imagePath = $fileName;
            Storage::disk('public')->put('photos/' .$imagePath, $imageData);

            // Atualizar o campo photoFileName
            $user->photo_filename = $imagePath;
        }

        $user->save();

        return new UserResource($user);
    }

    public function updatePassword(UpdateUserPasswordRequest $request, User $user)
    {
       
        $user->fill($request->validated());

        //Verificar se a current_password está correta 
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['error' => 'The current password is incorrect.'], 400);
        }
    
        //Atualiza a password
        $user->password = Hash::make($request->new_password);
        $user->save();
    
        return response()->json(['message' => 'Password updated successfully.']);
    }

    public function removeUser(User $user)
    {
        $user->brain_coins_balance = 0;
        $user->save();

        $user->delete();
    
        return response()->json(['message' => 'User deleted successfully.']);
    }


    //Admin Statistics

    public function getAdminPlayersStatistics()
    {
        $loggedInPlayers = PersonalAccessToken::where('expires_at', '>', Carbon::now())
                                            ->whereHas('tokenable', function ($query) {
                                                $query->where('type', 'P');
                                            })
                                            ->distinct('tokenable_id')
                                            ->count('tokenable_id');

        $totalPlayers = User::where('type', 'P')->get()->count();


        $startOfMonth = (new \DateTime('first day of this month'))->format('Y-m-d H:i:s');
        $endOfMonth = (new \DateTime('last day of this month 23:59:59'))->format('Y-m-d H:i:s');

        $playersRegistedThisMonth = User::where('type', 'P')->whereBetween('created_at', [$startOfMonth, $endOfMonth])->get()->count();

        return response()->json(['loggedPlayers' => $loggedInPlayers, 
                                'allPlayers' => $totalPlayers,
                                'registedPlayersThisMonth' => $playersRegistedThisMonth]);
    }
}
