<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
//import { useErrorStore } from '@/stores/error';
import { useAuthStore } from '@/stores/auth';
import { useTransactionStore } from '@/stores/transactionStore';
import { useErrorStore } from '@/stores/error';
import { format } from 'date-fns';


const authStore = useAuthStore();
//const errorStore = useErrorStore();
const transactionStore = useTransactionStore();
const router = useRouter();
const errorStore = useErrorStore();

const userId = ref(authStore.user.id);


// Props para os valores de coins e euros
const props = defineProps({
  coins: {
    type: Number,
    required: true,
  },
  euros: {
    type: Number,
    required: true,
  },
});

const transaction = ref({
  type: 'P', // P = Purchase
  transaction_datetime: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
  user_id: authStore.user.id,
  game_id: null, 
  euros: props.euros,
  payment_type: '',
  payment_reference: '',
  brain_coins: props.coins,
  custom: JSON.stringify({}),
});

// Variáveis para guardar os valores dos métodos de pagamento
const mbwayPhoneNumber = ref('');
const mbReference = ref('');
const visaCardNumber = ref('');
const ibanNumber = ref('');
const paypalEmail = ref('');

const generateMBReference = () => {
  const entityNumber = Math.floor(Math.random() * 100000); // Gera um número aleatório de 5 dígitos
  const referenceNumber = Math.floor(Math.random() * 1000000000); // Gera um número aleatório de 9 dígitos
  return `${entityNumber}-${referenceNumber.toString().padStart(9, '0')}`; // Formato "XXXXX-XXXXXXXXX"
}



const createTransaction = async () => {
  // Transformar 'custom' de string para objeto
  // Preencher os detalhes da transação com base no método de pagamento selecionado
  if (transaction.value.payment_type === 'MBWAY') {
    transaction.value.payment_reference = mbwayPhoneNumber.value;
  } else if (transaction.value.payment_type === 'MB') {
    transaction.value.payment_reference = mbReference.value;
  } else if (transaction.value.payment_type === 'VISA') {
    transaction.value.payment_reference = visaCardNumber.value;
  } else if (transaction.value.payment_type === 'IBAN') {
    transaction.value.payment_reference = ibanNumber.value;
  }
  else if (transaction.value.payment_type === 'PAYPAL') {
    transaction.value.payment_reference = paypalEmail.value;
  }
  // Tentar inserir a transação
  if (await transactionStore.insertTransaction(transaction.value)) {
    router.push({ name: 'dashboard' });
  }
};


const selectMethod = (paymentType) => {
  transaction.value.payment_type = paymentType;

  if (paymentType === 'MB') {
    mbReference.value = generateMBReference(); // Gera a referência aleatória
  }
};

</script>

<template>
  <h1 class="text-4xl mb-2 text-center text-yellow-500 font-semibold">
    {{ coins }} Brain Coins
  </h1>
  <p class="text-xl text-gray-400 text-center mb-2">
    Choose your payment method
  </p>
  <div class="flex flex-col items-center justify-start min-h-screen pt-4 pb-16">
    <div class="w-full max-w-[70%] lg:max-w-[80%] mx-auto">
      <div class="flex flex-wrap justify-center gap-4">
        <!-- MBWAY -->
        <div
          :class="[transaction.payment_type === 'MBWAY' ? 'bg-yellow-500' : 'bg-yellow-200', 'sm:w-18 sm:h-24 md:w-26 md:h-30 lg:w-48 lg:h-32 text-lg font-semibold text-white rounded-lg transition-transform transform hover:scale-105 flex flex-col items-center justify-center']"
          @click="selectMethod('MBWAY')">
          <div>MBWAY</div>
        </div>

        <!-- MB -->
        <div
          :class="[transaction.payment_type === 'MB' ? 'bg-yellow-500' : 'bg-yellow-200', 'sm:w-18 sm:h-24 md:w-26 md:h-30 lg:w-48 lg:h-32 text-lg font-semibold text-white rounded-lg transition-transform transform hover:scale-105 flex flex-col items-center justify-center']"
          @click="selectMethod('MB')">
          <div>MB</div>
        </div>

        <!-- VISA -->
        <div
          :class="[transaction.payment_type === 'VISA' ? 'bg-yellow-500' : 'bg-yellow-200', 'sm:w-18 sm:h-24 md:w-26 md:h-30 lg:w-48 lg:h-32 text-lg font-semibold text-white rounded-lg transition-transform transform hover:scale-105 flex flex-col items-center justify-center']"
          @click="selectMethod('VISA')">
          <div>VISA</div>
        </div>

        <!-- IBAN -->
        <div
          :class="[transaction.payment_type === 'IBAN' ? 'bg-yellow-500' : 'bg-yellow-200', 'sm:w-18 sm:h-24 md:w-26 md:h-30 lg:w-48 lg:h-32 text-lg font-semibold text-white rounded-lg transition-transform transform hover:scale-105 flex flex-col items-center justify-center']"
          @click="selectMethod('IBAN')">
          <div>IBAN</div>
        </div>
        <!-- PAYPAL -->
        <div
          :class="[transaction.payment_type === 'PAYPAL' ? 'bg-yellow-500' : 'bg-yellow-200', 'sm:w-18 sm:h-24 md:w-26 md:h-30 lg:w-48 lg:h-32 text-lg font-semibold text-white rounded-lg transition-transform transform hover:scale-105 flex flex-col items-center justify-center']"
          @click="selectMethod('PAYPAL')">
          <div>PAYPAL</div>
        </div>
      </div>

    </div>

    <div v-if="transaction.payment_type === 'MBWAY'"
      class="mt-4 p-4 bg-gray-100 rounded-lg shadow-md w-full max-w-md mx-auto border-2 border-yellow-300">
      <h2 class="text-2xl mb-2 text-gray-600">MBWAY Payment</h2>
      <label class="block mb-2 text-gray-600">Phone Number:</label>
      <input v-model="mbwayPhoneNumber" type="text" class="w-full p-2 border rounded"
        placeholder="Enter your phone number">
    </div>

    <div v-if="transaction.payment_type === 'MB'"
      class="mt-4 p-4 bg-gray-100 rounded-lg shadow-md w-full max-w-md mx-auto border-2 border-yellow-300">
      <h2 class="text-2xl mb-2 text-gray-600">MB Payment</h2>
      <label class="block mb-2 text-gray-600">Entity-Reference:</label>
      <p class="w-full p-2 border rounded bg-gray-200">{{ mbReference }}</p>
    </div>

    <div v-if="transaction.payment_type === 'VISA'"
      class="mt-4 p-4 bg-gray-100 rounded-lg shadow-md w-full max-w-md mx-auto border-2 border-yellow-300">
      <h2 class="text-2xl mb-2 text-gray-600">VISA Payment</h2>
      <label class="block mb-2 text-gray-600">Card Number:</label>
      <input v-model="visaCardNumber" type="text" class="w-full p-2 border rounded"
        placeholder="Enter your card number">
    </div>

    <div v-if="transaction.payment_type === 'IBAN'"
      class="mt-4 p-4 bg-gray-100 rounded-lg shadow-md w-full max-w-md mx-auto border-2 border-yellow-300">
      <h2 class="text-2xl mb-2 text-gray-600">IBAN Payment</h2>
      <label class="block mb-2 text-gray-600">IBAN:</label>
      <input v-model="ibanNumber" type="text" class="w-full p-2 border rounded" placeholder="Enter your IBAN">
    </div>
    <div v-if="transaction.payment_type === 'PAYPAL'"
      class="mt-4 p-4 bg-gray-100 rounded-lg shadow-md w-full max-w-md mx-auto border-2 border-yellow-300">
      <h2 class="text-2xl mb-2 text-gray-600">PAYPAL Payment</h2>
      <label class="block mb-2 text-gray-600">Email:</label>
      <input v-model="paypalEmail" type="text" class="w-full p-2 border rounded" placeholder="Enter your paypal email">

    </div>

    <button @click="createTransaction"
      class="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-200">Save Transaction
    </button>
  </div>
</template>