<template>
    <v-card class="mt-4">
      <v-card-title class="d-flex justify-space-between">
        <span>Lista de Usuarios</span>
        <v-progress-circular
          v-if="loading"
          indeterminate
          size="24"
          color="primary"
        ></v-progress-circular>
      </v-card-title>
  
      <v-divider></v-divider>
  
      <v-card-text>
        <v-list v-if="users.length > 0">
          <v-list-item
            v-for="user in users"
            :key="user.id"
            class="mb-2"
          >
            <template #prepend>
              <v-avatar color="primary">
                <span class="white--text">{{ user.name.charAt(0) }}</span>
              </v-avatar>
            </template>
  
            <v-list-item-title>{{ user.name }}</v-list-item-title>
            <v-list-item-subtitle>
              <v-icon small class="mr-1">mdi-email</v-icon>
              {{ user.email }}
              <v-icon small class="ml-4 mr-1">mdi-identifier</v-icon>
              ID: {{ user.id }}
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>
  
        <v-alert
          v-else
          type="info"
          variant="tonal"
          class="my-4"
        >
          No hay usuarios registrados
        </v-alert>
  
        <v-form @submit.prevent="submitForm" class="mt-6">
          <v-text-field
            v-model="newUser.name"
            label="Nombre completo"
            required
            :rules="[requiredRule]"
            outlined
            class="mb-4"
          ></v-text-field>
  
          <v-text-field
            v-model="newUser.email"
            label="Correo electrónico"
            type="email"
            required
            :rules="[requiredRule, emailRule]"
            outlined
          ></v-text-field>
  
          <v-btn
            type="submit"
            color="primary"
            block
            class="mt-4"
            :disabled="!formValid"
            :loading="loading"
          >
            <v-icon left>mdi-plus</v-icon>
            Agregar Usuario
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  
  interface User {
    id: number
    name: string
    email: string
  }
  
  const props = defineProps<{
    users: User[]
    loading: boolean
  }>()
  
  const emit = defineEmits<{
    (e: 'add-user', payload: { name: string; email: string }): void
  }>()
  
  const newUser = ref({
    name: '',
    email: ''
  })
  
  const requiredRule = (value: string) => !!value || 'Campo requerido'
  const emailRule = (value: string) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(value) || 'Correo electrónico inválido'
  }
  
  const formValid = computed(() => {
    return newUser.value.name && 
           newUser.value.email && 
           emailRule(newUser.value.email) === true
  })
  
  const submitForm = () => {
    if (formValid.value) {
      emit('add-user', {
        name: newUser.value.name,
        email: newUser.value.email
      })
      newUser.value = { name: '', email: '' }
    }
  }
  </script>
  
  <style scoped>
  .v-list-item {
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    transition: all 0.3s ease;
  }
  
  .v-list-item:hover {
    background-color: #f5f5f5;
    transform: translateY(-2px);
  }
  </style>