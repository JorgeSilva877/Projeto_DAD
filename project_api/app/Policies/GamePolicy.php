<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Game;
use App\Models\MultiplayerGamePlayed;

class GamePolicy
{
    public function before(User $user, string $ability): bool|null
    {
        if ($user->type == 'A') {
            return true;
        }
        return null;
    }


    public function getPlayerGames(User $user, User $userGames): bool
    {
        return true;
        return $userGames->id == $user->id;
    }

    public function getPlayersFromMultiplayerGame(User $user, Game $game): bool
    {
        return MultiplayerGamePlayed::where('game_id', $game->id)
            ->where('user_id', $user->id)
            ->exists();
    }

    public function getPersonalScoreboard(User $user, User $userScoreboard): bool
    {
        return $userScoreboard->id == $user->id;
    }
}
