<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class AuthController extends Controller
{
    private function purgeExpiredTokens() //funcao para apagar tokens expirados a 2 ou + horas, para evitar dados desnecessarios na db
    {
        // Only deletes if token expired 2 hours ago 
        $dateTimetoPurge = now()->subHours(2);
        DB::table('personal_access_tokens')->where('expires_at', '<', $dateTimetoPurge)->delete();
    }

    private function revokeCurrentToken(User $user)
    {
        $currentTokenId = $user->currentAccessToken()->id;
        $user->tokens()->where('id', $currentTokenId)->delete();
    }

    public function login(LoginRequest $request)
    {
        $this->purgeExpiredTokens();
        $credentials = $request->validated();
        if (!Auth::attempt($credentials)) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $token = $request->user()->createToken('authToken', ['*'], now()->addHours(2))->plainTextToken;
        return response()->json(['token' => $token]);
    }

    public function logout(Request $request)
    {
        $this->purgeExpiredTokens();
        $this->revokeCurrentToken($request->user());
        return response()->json(null, 204);
    }

    public function refreshToken(Request $request)
    {
        // Revokes current token and creates a new token
        $this->purgeExpiredTokens();
        $this->revokeCurrentToken($request->user());
        $token = $request->user()->createToken('authToken', ['*'], now()->addHours(2))->plainTextToken;
        return response()->json(['token' => $token]);
    }


    public function register(RegisterRequest $request)
    {
        $this->purgeExpiredTokens();
        $credentials = $request->validated();

        //Se a imagem foi enviada, converter de base64 string em file
        $imagePath = null;
        if (!empty($credentials['photo_filename'])) {
            // Extrair o tipo do arquivo e os dados da string Base64
            preg_match('/^data:image\/(\w+);base64,/', $credentials['photo_filename'], $matches);

            // Tipo de imagem
            $fileExtension = $matches[1] ?? 'png';
            // Gerar um nome único para a imagem
            $fileName = uniqid() . '.' . $fileExtension;
            // Decodificar a Base64 para binário
            $imageData = base64_decode(preg_replace('/^data:image\/\w+;base64,/', '', $credentials['photo_filename']));
            if ($imageData === false) {
                return response()->json(['error' => 'Invalid image data'], 400);
            }

            // Salvar a imagem no disco (storage/app/public)
            $imagePath = $fileName;
            Storage::disk('public')->put('photos/' .$imagePath, $imageData);
        }
        
        //cria o novo utilizador
        $newUser = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password,
            'nickname' => $request->nickname,
            'type' => 'P',
            'brain_coins_balance' => 10,
            'photo_filename' => $imagePath,
        ]);

        //Devolve o token do novo utilizador
        $token = $newUser->createToken('authToken', ['*'], now()->addHours(2))->plainTextToken;
        return response()->json(['token' => $token]);
    }
}
