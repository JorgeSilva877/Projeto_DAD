<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth';

const props = defineProps({
    User: Object
})

const storeAuth = useAuthStore();
const isEditing = ref(false)


//Botões
const editUser = () => {
  isEditing.value = !isEditing.value;
};

const changePassword = () => {
  alert('Change Password clicked!');
};

const removeAccount = () => {
  console.log(props.value)
  alert('To Delete!');
};
</script>

<template>
  <div class="flex items-start justify-center min-h-screen pt-16">
    <div class="w-full max-w-4xl min-h-[500px] bg-white shadow-lg rounded-lg flex overflow-hidden border border-yellow-200">  
      <div class="w-1/3 bg-yellow-100 flex justify-center items-center">
        <img
          :src="storeAuth.userPhotoUrl"
          alt="User Photo"
          class="w-40 h-40 rounded-full border-4 border-yellow-500"
        />
      </div>


      <div class="w-2/3 p-8 flex flex-col gap-4">
        <h1 class="text-3xl font-bold text-yellow-600">{{ storeAuth.userName }}</h1>
        <!--<h1 class="text-2xl font-semibold text-yellow-600">
          <span v-if="!isEditing">{{ userName }}</span>
          <input v-else v-model="userName" class="text-2xl font-semibold text-yellow-600" />
        </h1>-->

        <p class="text-lg text-gray-500"><strong>Nickname:</strong> {{ storeAuth.userNickname }}</p>
        <p class="text-base text-gray-700"><strong>Email:</strong> {{ storeAuth.userEmail }}</p>
        <span class="inline-block mt-4 px-4 py-2 text-sm font-medium text-yellow-800 bg-yellow-200 rounded-lg border border-yellow-400 shadow-sm">
          {{ storeAuth.userType == 'A' ? 'Administrator' : 'Player' }}
        </span>



        <div class="mt-auto flex gap-4">
          <button class="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-md font-semibold" @click="editUser">
            Edit
          </button>
          <button class="bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-md font-semibold" @click="changePassword">
            Change Password
          </button>
          <button v-if="storeAuth.userType == 'P'" class="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-md font-semibold shadow-md" @click="removeAccount">
            Remove Account
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
