<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreGameRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'created_user_id' => 'nullable|integer',
            'winner_user_id' => 'nullable|integer',  // Pode ser nulo, pois o jogo ainda pode não ter vencedor
            'type' => 'required|string',
            'status' => 'required|string',
            'began_at' => 'nullable|date_format:Y-m-d H:i:s',
            'ended_at' => 'nullable|date_format:Y-m-d H:i:s', // O jogo pode não ter terminado ainda
            'total_time' => 'nullable|string',
            'board_id' => 'required|integer',
            'custom' => 'nullable|string',
            'created_at' => 'nullable|date_format:Y-m-d H:i:s',
            'updated_at' => 'nullable|date_format:Y-m-d H:i:s',
            'total_turns_winner' => 'nullable|integer',
        ];
    }
}