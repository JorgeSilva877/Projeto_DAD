<script setup>
import { ref, useTemplateRef, provide } from 'vue'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/stores/auth';
import { useErrorStore } from '@/stores/error'
import GlobalAlertDialog from '@/components/common/GlobalAlertDialog.vue'

const props = defineProps({
    User: Object
})

const storeAuth = useAuthStore();
const storeError = useErrorStore();

const isEditing = ref(false)
const isChangingPassword = ref(false)

const userData = ref({
  name: storeAuth.userName,
  nickname: storeAuth.userNickname,
  email: storeAuth.userEmail,
  photo_filename: ''
})

const newPassword = ref({
  current_password: '',
  new_password: ''
})


//Botões
const editUser = () => {
  isEditing.value = !isEditing.value;
};

const changePassword = () => {
  isChangingPassword.value = !isChangingPassword.value;
};

const submitChanges = async () => {
  if(isEditing.value){
    if (await storeAuth.updateProfile(userData.value)) {        
      isEditing.value = !isEditing.value;
    }
  }else{
    if (await storeAuth.updatePassword(newPassword.value)) {        
      isChangingPassword.value = !isChangingPassword.value
      newPassword.value.current_password = ''
      newPassword.value.new_password = ''
    }
  }
}


const alertDialog = useTemplateRef('alert-dialog')
provide('alertDialog', alertDialog)

const removeAccount = () => {
  alertDialog.value.open(logoutConfirmed,
    'Delete Account?', 'Cancel', `Yes, I want to delete this account`,
    `Are you sure you want to delete your account? This action cannot be undone.`)
};

const logoutConfirmed = () => {
  storeAuth.deleteLoggedUser()
}


const cancel = () => {
    storeError.resetMessages()
    if(isEditing.value){
      isEditing.value = !isEditing.value;
    }else{
      isChangingPassword.value = !isChangingPassword.value
    }
}

const convertPhotoFileToBase64 = async (event) => {
      //acede ao file
      const file = event.target.files[0];

      //Caso não tinha sido selecionado um file
      if (!file){
        return;
      }  

      // Converter o file para Base64
      const base64String = await new Promise((resolve, reject) => {
          const reader = new FileReader();

          //Converter para base64
          reader.onload = () => {
              resolve(reader.result.replace("data:", "").replace(/^.+,/, ""));
          };

          //Rejeita caso ocorra erros
          reader.onerror = (error) => {
              reject(error);
          };

          reader.readAsDataURL(file);
      });

      // Atribui a string Base64 ao photo_filename
      userData.value.photo_filename = base64String;
    }


</script>

<template>
  <GlobalAlertDialog ref="alert-dialog"></GlobalAlertDialog>
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
        
        <h1 class="text-2xl font-semibold text-yellow-600">
          <span v-if="!isEditing">{{ userData.name }}</span>
          <input v-else v-model="userData.name" v-on:keydown.enter="submitChanges" type="text"
                    :class="['w-full p-2 border rounded-md focus:outline-none',
                      isEditing ? 'bg-yellow-50 border-yellow-500' : 'bg-gray-100 text-gray-600 cursor-not-allowed',
                      isEditing && 'focus:ring-2 focus:ring-yellow-400' ]" />
          <ErrorMessage :errorMessage="storeError.fieldMessage('name')"></ErrorMessage>
        </h1>

        <p class="text-gray-500">
          <strong>Nickname:  </strong>
          <span v-if="!isEditing">{{ userData.nickname }}</span>
          <input v-else v-model="userData.nickname" v-on:keydown.enter="submitChanges"  type="text"
                      :class="['w-full p-2 border rounded-md focus:outline-none',
                        isEditing ? 'bg-yellow-50 border-yellow-500' : 'bg-gray-100 text-gray-600 cursor-not-allowed',
                        isEditing && 'focus:ring-2 focus:ring-yellow-400']" />
          <ErrorMessage :errorMessage="storeError.fieldMessage('nickname')"></ErrorMessage>
        </p>


        <p class="text-gray-700 mt-2">
          <strong>Email:  </strong>
          <span v-if="!isEditing">{{ userData.email }}</span>
          <input v-else v-model="userData.email" v-on:keydown.enter="submitChanges" type="email"
                    :class="['w-full p-2 border rounded-md focus:outline-none',
                      isEditing ? 'bg-yellow-50 border-yellow-500' : 'bg-gray-100 text-gray-600 cursor-not-allowed',
                      isEditing && 'focus:ring-2 focus:ring-yellow-400']" />
          <ErrorMessage :errorMessage="storeError.fieldMessage('email')"></ErrorMessage>
        </p>
        
        
        <span v-show="!isEditing" class="inline-block mt-4 px-4 py-2 text-sm font-medium text-yellow-800 bg-yellow-200 rounded-lg border border-yellow-400 shadow-sm">
          {{ storeAuth.userType == 'A' ? 'Administrator' : 'Player' }}
        </span>


        <!--Input para a imagem-->
        <div v-show="isEditing" class="mt-4">
          <label for="photo_filename" class="block text-sm font-medium text-gray-700">Change Profile Picture</label>
          <input
            type="file"
            accept="image/*"
            class="mt-1 block w-full text-gray-500"
            @change="convertPhotoFileToBase64"
          />
        </div>

        <!--Input para as passwords-->
        <div v-show="isChangingPassword" class="mt-4">
          <label class="block text-sm font-medium text-gray-700">Insert your current password</label>
          <Input
              type="password"
              placeholder="Your Password"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              v-model="newPassword.current_password"
              v-on:keydown.enter="submitChanges"
            />
          <label class="block text-sm font-medium text-gray-700">Insert your new password</label>
          <Input
              type="password"
              placeholder="Your Password"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              v-model="newPassword.new_password"
              v-on:keydown.enter="submitChanges"
            />
            <ErrorMessage :errorMessage="storeError.fieldMessage('new_password')"></ErrorMessage>
        </div>

        <div class="mt-auto flex gap-4">
          <button v-show="!isEditing && !isChangingPassword" class="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-md font-semibold" @click="editUser">
            Edit
          </button>
          <button v-show="isEditing || isChangingPassword" class="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-md font-semibold" @click="submitChanges">
            Submit
          </button>
          <button v-show="isEditing || isChangingPassword" class="bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-md font-semibold" @click="cancel">
            Back
          </button>
          <button v-show="!isEditing && !isChangingPassword" class="bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-md font-semibold" @click="changePassword">
            Change Password
          </button>
          <button v-show = "!isEditing && !isChangingPassword" v-if="storeAuth.userType == 'P'" class="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-md font-semibold shadow-md" @click="removeAccount">
            Remove Account
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
