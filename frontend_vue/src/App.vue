<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon>
        <v-icon>mdi-account-multiple</v-icon>
      </v-app-bar-nav-icon>
      <v-toolbar-title>Sistema de Usuarios</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container class="py-6">
        <v-tabs v-model="tab" grow>
          <v-tab value="rest">
            <v-icon left>mdi-api</v-icon>
            REST
          </v-tab>
          <v-tab value="soap">
            <v-icon left>mdi-xml</v-icon>
            SOAP
          </v-tab>
        </v-tabs>

        <v-window v-model="tab">
          <v-window-item value="rest">
            <UserManagement
              :users="users"
              :loading="loading"
              @add-user="addUserRest"
            />
          </v-window-item>

          <v-window-item value="soap">
            <UserManagement
              :users="users"
              :loading="loading"
              @add-user="addUserSoap"
            />
          </v-window-item>
        </v-window>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import axios from 'axios'
import UserManagement from '@/components/UserManagement.vue'

interface User {
  id: number
  name: string
  email: string
}

const tab = ref('rest')
const users = ref<User[]>([])
const loading = ref(false)

// Fetch inicial de usuarios
const fetchUsers = async () => {
  try {
    loading.value = true
    const response = await axios.get('http://localhost:3000/api/users')
    users.value = response.data
  } catch (error) {
    console.error('Error fetching users:', error)
  } finally {
    loading.value = false
  }
}

// Agregar usuario via REST
const addUserRest = async (userData: { name: string; email: string }) => {
  try {
    loading.value = true
    const response = await axios.post('http://localhost:3000/api/users', userData)
    users.value = [...users.value, response.data]
  } catch (error) {
    console.error('Error adding user:', error)
  } finally {
    loading.value = false
  }
}

// Agregar usuario via SOAP
const addUserSoap = async (userData: { name: string; email: string }) => {
  try {
    loading.value = true
    const response = await axios.post(
      'http://localhost:3000/soap',
      `<?xml version="1.0" encoding="UTF-8"?>
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                        xmlns:user="http://example.com/user-service">
        <soapenv:Header/>
        <soapenv:Body>
          <user:createUserRequest>
            <user:name>${userData.name}</user:name>
            <user:email>${userData.email}</user:email>
          </user:createUserRequest>
        </soapenv:Body>
      </soapenv:Envelope>`,
      {
        headers: {
          'Content-Type': 'text/xml'
        }
      }
    )
    
    // Parsear respuesta SOAP y actualizar lista
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(response.data, "text/xml")
    const newUser = {
      id: parseInt(xmlDoc.getElementsByTagName("id")[0].textContent || '0'),
      name: xmlDoc.getElementsByTagName("name")[0].textContent || '',
      email: xmlDoc.getElementsByTagName("email")[0].textContent || ''
    }
    users.value = [...users.value, newUser]
  } catch (error) {
    console.error('Error adding user via SOAP:', error)
  } finally {
    loading.value = false
  }
}

// Cargar usuarios cuando cambia la pestaña
watch(tab, (newTab) => {
  if (newTab === 'rest') {
    fetchUsers()
  } else {
    fetchUsers()
  }
}, { immediate: true })
</script>

<style scoped>
.v-tab {
  font-weight: 500;
}
</style>