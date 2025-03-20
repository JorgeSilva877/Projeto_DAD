<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTransactionRequest extends FormRequest
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
    public function rules()
    {
        return [
            // Regras de transação
            'type' => 'required|string|in:B,P,I',
            'transaction_datetime' => 'required|date',
            'user_id' => 'required|integer|exists:users,id',
            'game_id' => 'nullable|integer|required_if:type,I',
            'euros' => [
                'nullable',
                'numeric',
                'min:0',
                'required_if:type,P',
                function ($attribute, $value, $fail) {
                    // Definindo os limites por tipo de pagamento
                    $paymentType = $this->input('payment_type');
                    $limits = [
                        'MBWAY' => 5,
                        'PAYPAL' => 10,
                        'IBAN' => 50,
                        'MB' => 20,
                        'VISA' => 30,
                    ];

                    if (isset($limits[$paymentType]) && $value > $limits[$paymentType]) {
                        $fail("The $attribute exceeds the limit for $paymentType (max: €" . $limits[$paymentType] . ").");
                    }
                },
            ],
            'payment_type' => 'nullable|string|in:MBWAY,IBAN,MB,VISA,PAYPAL|required_if:type,P',
            'payment_reference' => [
                'nullable',
                'string',
                'required_if:type,P',
                function ($attribute, $value, $fail) {
                    $paymentType = $this->input('payment_type');

                    switch ($paymentType) {
                        case 'MBWAY':
                            if (!preg_match('/^9\d{8}$/', $value)) {
                                $fail('The ' . $attribute . ' must be 9 digits starting with 9.');
                            }
                            break;
                        case 'PAYPAL':
                            if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
                                $fail('The ' . $attribute . ' must be a valid email address.');
                            }
                            break;
                        case 'IBAN':
                            if (!preg_match('/^[A-Z]{2}\d{23}$/', $value)) {
                                $fail('The ' . $attribute . ' must be 2 letters followed by 23 digits.');
                            }
                            break;
                        case 'MB':
                            if (!preg_match('/^\d{5}-\d{9}$/', $value)) {
                                $fail('The ' . $attribute . ' must be 5 digits, a hyphen, and 9 digits.');
                            }
                            break;
                        case 'VISA':
                            if (!preg_match('/^4\d{15}$/', $value)) {
                                $fail('The ' . $attribute . ' must be 16 digits starting with 4.');
                            }
                            break;
                        default:
                            $fail('Invalid payment type.');
                    }
                },
            ],
            'brain_coins' => 'required|integer',
            'custom' => 'nullable|string',
        ];
    }
}