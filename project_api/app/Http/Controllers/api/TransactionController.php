<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Transaction;
use App\Http\Resources\TransactionResource;
//use App\Http\Resources\TransactionCollection;
use App\Http\Requests\StoreTransactionRequest;
use Illuminate\Support\Facades\Http;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Se o user for do tipo 'A', retorna todas as transações
        if ($user->type == 'A') {
            $transactions = Transaction::orderBy('transaction_datetime', 'desc')->paginate(4);
        }
        else
        {
            $transactions = Transaction::where('user_id', $user->id)->orderBy('transaction_datetime', 'desc')->paginate(5);
        }
        return TransactionResource::collection($transactions);
    }

    public function show(Transaction $transaction)
    {
        return new TransactionResource($transaction);
    }

    public function store(StoreTransactionRequest $request)
    {
        /*
        if ($request->user()->type != 'P') {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        else
        {
        $transaction = Transaction::create($request->validated());
        return new TransactionResource($transaction);
        }
        */
        $transaction = new Transaction();
        $transaction->fill($request->validated());
        $transaction->user_id = $request->user() ? $request->user()->id : null; 
        $transaction->save();
        return new TransactionResource($transaction);
    }

    //funçao para o pagamento
       
    public function storePayment(StoreTransactionRequest $request)
    {
        // Valida os dados da transação usando o StoreTransactionRequest
        $validatedTransactionData = $request->validated();

        if($validatedTransactionData['type'] != 'P')
        {
            $transaction = new Transaction();
            $transaction->fill($request->validated());
            $transaction->user_id = $request->user() ? $request->user()->id : null; 
            $transaction->save();
            return new TransactionResource($transaction);
        }
        
        try {
            // Cria os dados do pagamento no backend com base na transação
            $paymentData = [
                'type' => $validatedTransactionData['payment_type'],
                'reference' => $validatedTransactionData['payment_reference'],
                'value' => $validatedTransactionData['euros'],
            ];

            // Envia os dados validados à API externa
            $response = Http::post('https://dad-202425-payments-api.vercel.app/api/debit', $paymentData);
    
            if ($response->status() == 201) {
                // Pagamento bem-sucedido, cria a transação no banco de dados
                $transaction = new Transaction();
                $transaction->fill($validatedTransactionData);
                $transaction->user_id = $request->user() ? $request->user()->id : null;
                $transaction->save();
                return new TransactionResource($transaction);
            } else {
                // Lida com falhas de pagamento com base no código de status
                return response()->json(['error' => 'Payment failed with status code ' . $response->status()], $response->status());
            }
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Lida com erros de validação de pagamento
            return response()->json(['error' => $e->errors()], 422);
        }

    }

    public function getAdminTransactionsStatistics()
    {
        $totalPurchases = Transaction::where('type', 'P')->get()->count();

        $startOfMonth = (new \DateTime('first day of this month'))->format('Y-m-d H:i:s');
        $endOfMonth = (new \DateTime('last day of this month 23:59:59'))->format('Y-m-d H:i:s');
        $purchasesPlayedThisMonth = Transaction::where('type', 'P')->whereBetween('transaction_datetime', [$startOfMonth, $endOfMonth])->get()->count();

        $playersWithMostMoneyDeposited =  Transaction::join('users', 'transactions.user_id', '=', 'users.id')
                                                    ->select('users.nickname', \DB::raw('SUM(transactions.euros) as total_spent'))
                                                    ->where('transactions.type', 'P')
                                                    ->groupBy('users.id', 'users.nickname')
                                                    ->orderByDesc('total_spent')
                                                    ->limit(6)
                                                    ->get();

        $moneyEarned = Transaction::where('type', 'P')->sum('euros');
        

        return response()->json(['totalPurchases' => $totalPurchases, 
                                'purchasesThisMonth' => $purchasesPlayedThisMonth,
                                'moneyEarned' => $moneyEarned,
                                'playersWithMostMoneyDeposited' => $playersWithMostMoneyDeposited]);
    }
        
}