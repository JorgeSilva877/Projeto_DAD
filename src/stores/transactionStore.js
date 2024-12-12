import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';
import { useErrorStore } from '@/stores/error';
import { useToast } from '@/components/ui/toast';
import { useAuthStore } from './auth';

export const useTransactionStore = defineStore('transaction', () => {
    const storeError = useErrorStore();
    const authStore = useAuthStore();
    const { toast } = useToast();

    const transactions = ref([]);
    const lastPage = ref([]);

    // funcao para dar return a todas as transacoes
    const fetchTransactions = async (page) => {
        storeError.resetMessages();
        const response = await axios.get(`transactions?page=${page}`);
        transactions.value = response.data.data;
        lastPage.value = response.data.meta.last_page;
        return response.data.data;
    }
    
    /*

    const fetchTransaction = async (transactionId) => {
        storeError.resetMessages();
        const response = await axios.get(`transactions/${transactionId}`);
        const index = getIndexOfTransaction(transactionId);
        if(index > -1){
            transactions.value[index] = response.data.data;
        }
        return response.data.data;
    }
    */
    
    //funcao para ir buscar o indice da transacao
    const getIndexOfTransaction = (transactionId) => {
        return transactions.value.findIndex(transaction => transaction.id === transactionId);
    }
    
    const insertTransaction = async (transaction) => {
        storeError.resetMessages();
        try {
            const response = await axios.post('transactions', transaction);
            authStore.updateBalance(transaction.brain_coins);
            transactions.value.push(response.data.data);
            toast({ description: 'Transaction created successfully!' });
            return response.data.data;
        } catch (error) {
            //console.log(error.response.data.message)
            //storeError.setErrorMessages('Failed to create transaction:'+error.response.data.message);
            console.log(error.response);
            storeError.setErrorMessages(error.response.data.message, error.response.data.errors,
                error.response.status, 'Failed to create transaction')
            return null;
        }
    }

    return {
        transactions,
        lastPage,
        fetchTransactions,
        getIndexOfTransaction,
        insertTransaction
    }
});