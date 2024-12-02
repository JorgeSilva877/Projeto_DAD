<script setup>
    import { ref, inject } from 'vue'
    import { useRouter } from 'vue-router'
    import { Button } from '@/components/ui/button'
    import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    } from '@/components/ui/card'
    import { Input } from '@/components/ui/input'
    import { Label } from '@/components/ui/label'
    import { useErrorStore } from '@/stores/error'
    import { useAuthStore } from '@/stores/auth'


    const storeAuth = useAuthStore()
    const storeError = useErrorStore()
    const router = useRouter()

    const credentials = ref({
        email: '',
        name: '',
        nickname: '',
        password: '',
        photo_filename: ''
    })

    const register = () => {
        storeAuth.register(credentials.value)
    }

    const cancel = () => {
        router.back()
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
      credentials.value.photo_filename = base64String;
    }

    storeError.resetMessages()

</script>

<template>
    <Card class="w-[450px] mx-auto my-8 p-4 px-8">
    <CardHeader>
      <CardTitle>Register</CardTitle>
      <CardDescription>Enter your data to create a account.</CardDescription>
    </CardHeader>
    <CardContent>
        <form class="space-y-3">
          <div>
            <Label for="email" class="block text-sm font-medium text-gray-700">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Your Email"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              v-model="credentials.email"
              v-on:keydown.enter="register"
            />
            <ErrorMessage :errorMessage="storeError.fieldMessage('email')"></ErrorMessage>
          </div>
          <div>
            <Label for="name" class="block text-sm font-medium text-gray-700">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Your Full Name"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              v-model="credentials.name"
              v-on:keydown.enter="register"
            />
            <ErrorMessage :errorMessage="storeError.fieldMessage('name')"></ErrorMessage>
          </div>
          <div>
            <Label for="nickname" class="block text-sm font-medium text-gray-700">Nickname</Label>
            <Input
              id="nickname"
              type="text"
              placeholder="Your Nickname"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              v-model="credentials.nickname"
              v-on:keydown.enter="register"
            />
            <ErrorMessage :errorMessage="storeError.fieldMessage('nickname')"></ErrorMessage>
          </div>
          <div>
            <Label for="password" class="block text-sm font-medium text-gray-700">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Your Password"
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              v-model="credentials.password"
              v-on:keydown.enter="register"
            />
            <ErrorMessage :errorMessage="storeError.fieldMessage('password')"></ErrorMessage>
          </div>
          <div>
            <Label for="photo_filename" class="block text-sm font-medium text-gray-700">Profile Photo (Optional)</Label>
            <Input
              id="photo_filename"
              type="file"
              accept="image/*"
              class="mt-1 block w-full text-gray-500"
              @change="convertPhotoFileToBase64"
            />
          </div>
      </form>
    </CardContent>
    <CardFooter class="flex justify-between px-6 pb-6">
        <Button variant="outline" @click="cancel">
            Cancel
        </Button>
        <Button class="bg-yellow-500 hover:bg-yellow-400 text-white font-semibold py-2 px-4 rounded-lg" @click="register">
            Register
        </Button>
    </CardFooter>
  </Card>
  </template>
  