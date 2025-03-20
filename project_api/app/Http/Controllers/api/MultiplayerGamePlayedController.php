<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\MultiplayerGamePlayed;

class MultiplayerGamePlayedController extends Controller
{
    public function index(){
        return MultiplayerGamePlayed::get();
    }
}
