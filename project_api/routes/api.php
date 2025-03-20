<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\api\AuthController;
use App\Http\Controllers\api\UserController;
use App\Http\Controllers\api\TransactionController;
use App\Http\Controllers\api\GameController;
use App\Http\Controllers\api\BoardController;
use App\Http\Controllers\api\MultiplayerGamePlayedController;
use App\Models\Transaction;


//rotas do login, logout e refresh do token
Route::middleware(['auth:sanctum'])->group(function () {
    //auth                  
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::post('/auth/refreshtoken', [AuthController::class, 'refreshToken']);
    
    //user
    Route::get('/users/me', [UserController::class , 'showMe']);
    Route::put('/user/{user}', [UserController::class, 'update'])->can('update', 'user');
    Route::put('/user/password/{user}', [UserController::class, 'updatePassword'])->can('updatePassword', 'user');
    Route::delete('/users/{user}', [UserController::class, 'removeUser'])->can('delete', 'user'); //remove user

    Route::put('/users/me/brain_coins_balance', [UserController::class , 'updateBrainCoins']);
    Route::put('/users/{user}/blocked', [UserController::class , 'updateBlocked'])->can('block', 'user');
    //Route::delete('/users/{user}', [UserController::class , 'destroy'])->can('delete', 'user');
    Route::get('/users', [UserController::class, 'index']);

    //Transactions
    Route::get('/transactions', [TransactionController::class, 'index'])
        ->can('viewAny', Transaction::class);
    Route::post('/transactions', [TransactionController::class, 'storePayment'])
        ->can('create', Transaction::class);

    //games
    Route::get('/game/allGames_{user}', [GameController::class , 'getAllPlayerGames']);
    Route::get('/game/usersDetailFrom_{game}', [GameController::class, 'getMultiplayerUsers']);
    Route::get('/game/scoreboardByTime_{user}', [GameController::class, 'getPersonalScoreboardByTime']);
    Route::get('/game/scoreboardByMoves_{user}', [GameController::class, 'getPersonalScoreboardByMoves']);
    Route::get('/game/allGames', [GameController::class , 'getGames']);

    //admin dashboard
    Route::get('/admin/playersStatistics', [UserController::class, 'getAdminPlayersStatistics']);
    Route::get('/admin/gamesStatistics', [GameController::class, 'getAdminGamesStatistics']);
    Route::get('/admin/transactionsStatistics', [TransactionController::class, 'getAdminTransactionsStatistics']);


});

Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);

//Scoreboard
    //Multiplayer total wins
Route::get('/topMultiplayerMostWins', [GameController::class, 'getMultiplayerMostWinsPlayerList']);
    //Singleplayer best time per board
Route::get('/topSingleplayerBestTimeThreeFourBoard', [GameController::class, 'getSingleplayerBestTimePlayerList_3x4Board']);
Route::get('/topSingleplayerBestTimeFourFourBoard', [GameController::class, 'getSingleplayerBestTimePlayerList_4x4Board']);
Route::get('/topSingleplayerBestTimeSixSixBoard', [GameController::class, 'getSingleplayerBestTimePlayerList_6x6Board']);
    //Singleplayer less turns per board
Route::get('/topSingleplayerLessTurnsThreeFourBoard', [GameController::class, 'getSingleplayerLessTurnsPlayerList_3x4Board']);
Route::get('/topSingleplayerLessTurnsFourFourBoard', [GameController::class, 'getSingleplayerLessTurnsPlayerList_4x4Board']);
Route::get('/topSingleplayerLessTurnsSixSixBoard', [GameController::class, 'getSingleplayerLessTurnsPlayerList_6x6Board']);

//Statistics
    //TotalUsers
Route::get('/totalUsers', [UserController::class, 'getTotalUsers']);
    //TotalGamesPlayed
Route::get('/totalGamesPlayed', [GameController::class, 'getTotalGamesPlayed']);
    //TotalGamesPlayedThisMonth
Route::get('/totalGamesPlayedThisMonth', [GameController::class, 'getTotalGamesPlayedThisMonth']);

//JOGAR
Route::post('/games', [GameController::class, 'startGame']);
Route::put('/games/{gameId}', [GameController::class, 'endGame']);

//DEBUG
Route::get('/users', [UserController::class, 'index']); 
Route::get('/games', [GameController::class, 'index']);
Route::get('/boards', [BoardController::class, 'index']);
Route::get('/multiplayerGamesPlayed', [MultiplayerGamePlayedController::class, 'index']);