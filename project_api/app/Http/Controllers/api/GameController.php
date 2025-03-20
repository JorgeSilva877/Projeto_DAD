<?php

namespace App\Http\Controllers\api;

use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Game;
use App\Models\User;
use App\Models\MultiplayerGamePlayed;
use App\Http\Resources\GameListResource;
use App\Http\Resources\GameResource;
use App\Http\Requests\StoreGameRequest;

class GameController extends Controller
{
    public function index(){
        return Game::get();
    }


    //JOGAR

    public function startGame(StoreGameRequest $request)
    {
        // Os dados são automaticamente validados e sanitizados pela StoreGameRequest
        
        $validatedData = $request->validated();


            // Recuperar o usuário criador do jogo (ID é necessário no request)
        $user = User::findOrFail($validatedData['created_user_id']);

        // Definir o custo de moedas para iniciar o jogo
        //$gameCost = 1; 

        // Verificar se o usuário tem moedas suficientes
        
        if ($user->brain_coins_balance < 1) {
            return response()->json([
                'message' => 'Você não tem moedas suficientes para iniciar um jogo.'
            ], 403); // Retorna uma resposta de erro
        }
        
        // Cria um novo jogo com os dados validados
        //$game = Game::create($validatedData);
        $game = new Game();
        $game->fill($validatedData);
        $game->save();
        
        return new GameResource($game);

    
    }

    // Atualizar o jogo - método PUT
    public function endGame($gameId, Request $request)
    {
        $game = Game::findOrFail($gameId);

        // Atualiza o jogo com o status de encerramento e qualquer outro dado
        $game->status = 'E';
        $game->ended_at = now();
        $game->began_at = $request->input('began_at'); // Recebe a data de início
        $game->total_time = $request->input('total_time'); // Tempo total do jogo
        $game->total_turns_winner = $request->input('total_turns_winner');

        $game->save();

        return response()->json([
            'message' => 'Jogo encerrado com sucesso!',
            'game' => $game
        ]);
    }


    //SCOREBOARDS
    
    public function getMultiplayerMostWinsPlayerList(){
        return Game::selectRaw('count(winner_user_id) as total_wins, users.nickname as name, MAX(games.ended_at) as last_win')
                        ->join('users', 'games.winner_user_id', '=', 'users.id') 
                        ->where('games.type', 'M')
                        ->groupBy('winner_user_id') 
                        ->orderBy('total_wins', 'DESC')
                        ->orderBy('last_win', 'ASC')
                        ->limit(5)
                        ->get();
    }

    public function getSingleplayerBestTimePlayerList_3x4Board(){
        return Game::selectRaw('total_time as time, users.nickname as name, games.ended_at')
                        ->join('users', 'games.created_user_id', '=', 'users.id')
                        ->join('boards', 'games.board_id', '=', 'boards.id') 
                        ->where('games.type', 'S')
                        ->where('games.status', 'E')
                        ->where('boards.board_cols', 3)
                        ->where('boards.board_rows', 4) 
                        ->where('total_time', '<>', 'null')
                        ->orderBy('time', 'ASC')
                        ->orderBy('games.ended_at')
                        ->limit(5)
                        ->get();
    }

    public function getSingleplayerBestTimePlayerList_4x4Board(){
        return Game::selectRaw('total_time as time, users.nickname as name, games.ended_at')
                        ->join('users', 'games.created_user_id', '=', 'users.id')
                        ->join('boards', 'games.board_id', '=', 'boards.id') 
                        ->where('games.type', 'S')
                        ->where('games.status', 'E')
                        ->where('boards.board_cols', 4)
                        ->where('boards.board_rows', 4) 
                        ->where('total_time', '<>', 'null')
                        ->orderBy('time', 'ASC')
                        ->orderBy('games.ended_at')
                        ->limit(5)
                        ->get();
    }

    public function getSingleplayerBestTimePlayerList_6x6Board(){
        return Game::selectRaw('total_time as time, users.nickname as name, games.ended_at')
                        ->join('users', 'games.created_user_id', '=', 'users.id')
                        ->join('boards', 'games.board_id', '=', 'boards.id') 
                        ->where('games.type', 'S')
                        ->where('games.status', 'E')
                        ->where('boards.board_cols', 6)
                        ->where('boards.board_rows', 6) 
                        ->where('total_time', '<>', 'null')
                        ->orderBy('time', 'ASC')
                        ->orderBy('games.ended_at')
                        ->limit(5)
                        ->get();
    }

    public function getSingleplayerLessTurnsPlayerList_3x4Board(){
        return Game::selectRaw('games.total_turns_winner as turns, users.nickname as name, games.ended_at')
                        ->join('users', 'games.created_user_id', '=', 'users.id')
                        ->join('boards', 'games.board_id', '=', 'boards.id') 
                        ->where('games.type', 'S')
                        ->where('games.status', 'E')
                        ->where('boards.board_cols', 3)
                        ->where('boards.board_rows', 4) 
                        ->where('games.total_turns_winner', '<>', 'null')
                        ->orderBy('turns', 'ASC')
                        ->orderBy('games.ended_at')
                        ->limit(5)
                        ->get();
    }

    public function getSingleplayerLessTurnsPlayerList_4x4Board(){
        return Game::selectRaw('games.total_turns_winner as turns, users.nickname as name, games.ended_at')
                        ->join('users', 'games.created_user_id', '=', 'users.id')
                        ->join('boards', 'games.board_id', '=', 'boards.id') 
                        ->where('games.type', 'S')
                        ->where('games.status', 'E')
                        ->where('boards.board_cols', 4)
                        ->where('boards.board_rows', 4) 
                        ->where('games.total_turns_winner', '<>', 'null')
                        ->orderBy('turns', 'ASC')
                        ->orderBy('games.ended_at')
                        ->limit(5)
                        ->get();
    }

    public function getSingleplayerLessTurnsPlayerList_6x6Board(){
        return Game::selectRaw('games.total_turns_winner as turns, users.nickname as name, games.ended_at')
                        ->join('users', 'games.created_user_id', '=', 'users.id')
                        ->join('boards', 'games.board_id', '=', 'boards.id') 
                        ->where('games.type', 'S')
                        ->where('games.status', 'E')
                        ->where('boards.board_cols', 6)
                        ->where('boards.board_rows', 6)
                        ->where('games.total_turns_winner', '<>', 'null') 
                        ->orderBy('turns', 'ASC')
                        ->orderBy('games.ended_at')
                        ->limit(5)
                        ->get();
    }


    //Statistics

    public function getTotalGamesPlayed(){
        return Game::where('status', 'E')->get()->count();
    }

    public function getTotalGamesPlayedThisMonth(){
        
        $startOfMonth = (new \DateTime('first day of this month'))->format('Y-m-d H:i:s');
        $endOfMonth = (new \DateTime('last day of this month 23:59:59'))->format('Y-m-d H:i:s');

        return Game::where('status', 'E')->whereBetween('ended_at', [$startOfMonth, $endOfMonth])->get()->count();
    }

    //Admin statistics 

    public function getAdminGamesStatistics()
    {
        $gamesPlayed = Game::where('status', 'E')->get()->count();

        $startOfMonth = (new \DateTime('first day of this month'))->format('Y-m-d H:i:s');
        $endOfMonth = (new \DateTime('last day of this month 23:59:59'))->format('Y-m-d H:i:s');
        $gamesPlayedThisMonth = Game::where('status', 'E')->whereBetween('ended_at', [$startOfMonth, $endOfMonth])->get()->count();

        $SingleplayerGamesPlayed = Game::where('status', 'E')->where('type', 'S')->get()->count();

        $MultiplayerGamesPlayed = Game::where('status', 'E')->where('type', 'M')->get()->count();
        

        return response()->json(['gamesPlayed' => $gamesPlayed, 
                                'gamesPlayedThisMonth' => $gamesPlayedThisMonth,
                                'SingleplayerGamesPlayed' => $SingleplayerGamesPlayed,
                                'MultiplayerGamesPlayed' => $MultiplayerGamesPlayed]);
    }


    //History
    public function getAllPlayerGames(User $user){
        return Game::leftJoin('multiplayer_games_played', 'games.id', '=', 'multiplayer_games_played.game_id')
                        ->leftJoin('boards', 'games.board_id', '=', 'boards.id') 
                        ->leftJoin('users as winner_users', 'games.winner_user_id', '=', 'winner_users.id')
                        ->leftJoin('users as creator_users', 'games.created_user_id', '=', 'creator_users.id') 
                        ->where('games.created_user_id', $user->id) 
                        ->orWhere('multiplayer_games_played.user_id', $user->id) 
                        ->select(
                            'games.id', 
                            'games.type', 
                            'games.began_at', 
                            'games.status', 
                            DB::raw('CONCAT(boards.board_cols, "x", boards.board_rows) as board'), 
                            DB::raw('CONCAT(LPAD(FLOOR(TIMESTAMPDIFF(SECOND, games.began_at, games.ended_at) / 60), 2, "0"), ":", LPAD(TIMESTAMPDIFF(SECOND, games.began_at, games.ended_at) % 60, 2, "0")) as gameTime'),
                            DB::raw('COALESCE(winner_users.nickname) as winner'), 
                            DB::raw('COALESCE(creator_users.nickname) as creator'), 
                            'games.total_turns_winner as total_turns',
                            'multiplayer_games_played.pairs_discovered as total_pairs_discovered'
                        )
                        ->orderby('games.began_at', 'desc')
                        ->distinct()
                        ->get();
    
    
    }

    public function getMultiplayerUsers(Game $game){
        return MultiplayerGamePlayed::leftJoin('users as user', 'multiplayer_games_played.user_id', '=', 'user.id')
                                        ->where('multiplayer_games_played.game_id', $game->id)
                                        ->select(
                                            'user.nickname',
                                            'multiplayer_games_played.pairs_discovered'
                                        )
                                        ->get();
    }

    public function getPersonalScoreboardByTime(User $user){

        return Game::selectRaw("
                            boards.board_cols, 
                            boards.board_rows, 
                            total_time as time, 
                            games.ended_at
                        ")
                        ->join('users', 'games.created_user_id', '=', 'users.id')
                        ->join('boards', 'games.board_id', '=', 'boards.id') 
                        ->where('games.type', 'S')
                        ->where('games.status', 'E')
                        ->where('games.created_user_id', '=', $user->id)
                        ->whereNotNull('total_time')
                        ->whereIn(DB::raw("CONCAT(boards.board_cols, 'x', boards.board_rows)"), ['3x4', '4x4', '6x6'])
                        ->orderBy('time', 'ASC')
                        ->orderBy('games.ended_at')
                        ->get()
                        ->groupBy(function($game) {
                            return "{$game->board_cols}x{$game->board_rows}";
                        })
                        ->map(function ($group) {
                            return $group->take(3); 
                        });
    }


    public function getPersonalScoreboardByMoves(User $user){

        return Game::selectRaw("
                            boards.board_cols, 
                            boards.board_rows, 
                            total_turns_winner as turns, 
                            games.ended_at
                        ")
                        ->join('users', 'games.created_user_id', '=', 'users.id')
                        ->join('boards', 'games.board_id', '=', 'boards.id') 
                        ->where('games.type', 'S')
                        ->where('games.status', 'E')
                        ->where('games.created_user_id', '=', $user->id)
                        ->whereNotNull('total_turns_winner')
                        ->whereIn(DB::raw("CONCAT(boards.board_cols, 'x', boards.board_rows)"), ['3x4', '4x4', '6x6'])
                        ->orderBy('turns', 'ASC')
                        ->orderBy('games.ended_at')
                        ->get()
                        ->groupBy(function($game) {
                            return "{$game->board_cols}x{$game->board_rows}";
                        })
                        ->map(function ($group) {
                            return $group->take(3); 
                        });
    }


    public function getGames(Request $request){
        /*
        return Game::leftJoin('multiplayer_games_played', 'games.id', '=', 'multiplayer_games_played.game_id')
                        ->leftJoin('boards', 'games.board_id', '=', 'boards.id') 
                        ->leftJoin('users as winner_users', 'games.winner_user_id', '=', 'winner_users.id')
                        ->leftJoin('users as creator_users', 'games.created_user_id', '=', 'creator_users.id')
                        ->whereYear('games.began_at', date('Y'))  
                        ->whereMonth('games.began_at', date('m')) 
                        ->select(
                            'games.id', 
                            'games.type', 
                            'games.began_at', 
                            'games.status', 
                            DB::raw('CONCAT(boards.board_cols, "x", boards.board_rows) as board'), 
                            DB::raw('CONCAT(LPAD(FLOOR(TIMESTAMPDIFF(SECOND, games.began_at, games.ended_at) / 60), 2, "0"), ":", LPAD(TIMESTAMPDIFF(SECOND, games.began_at, games.ended_at) % 60, 2, "0")) as gameTime'),
                            DB::raw('COALESCE(winner_users.nickname) as winner'), 
                            DB::raw('COALESCE(creator_users.nickname) as creator'), 
                            'games.total_turns_winner as total_turns',
                            'multiplayer_games_played.pairs_discovered as total_pairs_discovered'
                        )
                        ->orderby('games.began_at', 'desc')
                        ->distinct()
                        ->get();
    }*/
    $query = Game::query()->with(['createdBy', 'winner']);

        if ($request->has('type') && in_array($request->type, ['S', 'M'])) {
            $query->where('type', $request->type);
        }

        if ($request->has('status') && in_array($request->status, ['PE', 'PL', 'E', 'I'])) {
            $query->where('status', $request->status);
        }

        // Sorting
        $sortField = $request->input('sort_by', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');

        $allowedSortFields = [
            'created_at',
            'began_at',
            'ended_at',
            'total_time',
            'type',
            'status'
        ];

        if (in_array($sortField, $allowedSortFields)) {
            $query->orderBy($sortField, $sortDirection === 'asc' ? 'asc' : 'desc');
        }

        // Pagination
        $perPage = $request->input('per_page', 15);
        $games = $query->paginate($perPage);

        return response()->json([
            'data' => $games->items(),
            'meta' => [
                'current_page' => $games->currentPage(),
                'last_page' => $games->lastPage(),
                'per_page' => $games->perPage(),
                'total' => $games->total()
            ]
        ]);
    }
}