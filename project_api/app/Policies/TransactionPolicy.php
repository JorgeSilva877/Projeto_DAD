<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Transaction;

class TransactionPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Transaction $transaction): bool
    {
        return $user->type == 'A' || $user->id == $transaction->user_id;
        //return true;
    }

    public function create(User $user): bool
    {
        if($user->type == 'P'){
            return true;
        }
        return false;
    }
}