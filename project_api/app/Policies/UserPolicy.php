<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{

    public function before(User $user, string $ability): bool|null
    {
        if ($user->type == 'A') {
            return true;
        }
        return null;
    }


    public function update(User $user, User $userToUpdate): bool
    {
        return $userToUpdate->id == $user->id;
    }

    public function updatePassword(User $user, User $userToUpdate): bool
    {
        return $userToUpdate->id == $user->id;
    }

    public function removeUser(User $user, User $userToDelete): bool
    {
        return $userToDelete->id == $user->id;
    }

    public function block (User $currentUser, User $user): bool
    {
        return $currentUser->type === 'A' && $currentUser->id !== $user->id && $user->type === 'P';
    }

    public function delete (User $currentUser, User $user): bool
    {
        return ($currentUser->type === 'A' && $currentUser->id !== $user->id) || ($currentUser->type === 'P' && $currentUser->id === $user->id);
    }
}
