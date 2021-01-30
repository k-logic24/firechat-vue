<template>
  <div class="min-h-screen bg-red-400 flex justify-center items-center">
    <form
      class="bg-white rounded-lg p-8 max-w-md w-11/12"
      v-if="isStepLogin"
      @submit.prevent="login"
    >
      <h1 class="text-xl font-bold">Login to FireChat</h1>
      <div class="mt-4">
        <label for="username" class="text-sm text-gray-500">USER NAME</label>
        <input
          type="text" id="username"
          class="w-full border rounded px-4 py-2 focus:outline-none"
          placeholder="Please enter your username..."
          v-model="inputUserName"
        >
        <p v-if="isValidateUserName" class="pt-2 text-red-600 text-sm">please enter username.</p>
      </div>
      <button
        type="submit"
        class="mt-8 rounded w-full bg-red-400 text-white text-center p-4 hover:bg-red-500 transition-all duration-300"
      >
        Login
      </button>
    </form>
    <div class="max-w-screen-md w-full" v-else>
      <header class="px-2 sm:px-0 mb-4">
        <p class="text-right text-white">
          <button @click="logout">LogOut</button>
        </p>
        <h1 class="mt-2 text-xl font-bold text-white">Welcome, {{ state.username }}</h1>
      </header>

      <section class="bg-white px-4 py-6 rounded-tl-lg rounded-tr-lg max-h-96 overflow-y-scroll">
        <div
          v-for="msg in state.messages"
          :key="msg.id"
          class="message"
        >
          <div :class="(msg.username === state.username && 'current-user text-right')">
            <p class="text-gray-400 text-sm mb-1">{{ msg.username }}</p>
            <span class="content">{{ msg.content }}</span>
          </div>
        </div>
      </section>

      <footer class="p-4 shadow-up bg-white shadow rounded-bl-lg rounded-br-lg">
        <form @submit.prevent="sendMessage">
          <div class="flex">
            <input
              type="text"
              class="flex-1 bg-gray-100 rounded-tl rounded-bl py-2 px-4"
              placeholder="Write a Message..."
              v-model="inputMessage"
            />
            <button
              type="submit"
              class="rounded-tr rounded-br bg-red-400 text-white text-center py-2 px-4 hover:bg-red-500 transition-all duration-300"
            >
              Send
            </button>
          </div>
        </form>
      </footer>
    </div>
  </div>
</template>

<script lang="ts">
import { reactive, onMounted, ref, computed } from 'vue'
import db from '@/db'

type StateProps = {
  messages: MessageProps[];
  username: string;
}

type MessageProps = {
  id: string;
  username: string;
  content: string;
}

export default {
  setup () {
    const inputUserName = ref<string>('')
    const inputMessage = ref<string>('')
    const isValidateUserName = ref<boolean>(false)
    const state = reactive<StateProps>({
      messages: [],
      username: ''
    })

    const isStepLogin = computed(() => state.username === '')

    const login = () => {
      if (inputUserName.value !== '') {
        state.username = inputUserName.value
        inputUserName.value = ''
        isValidateUserName.value = false
        return
      }
      isValidateUserName.value = true
    }

    const logout = () => {
      state.username = ''
    }

    const sendMessage = () => {
      const messagesRef = db.database().ref('messages')
      if (inputMessage.value === '') return
      const message = {
        username: state.username,
        content: inputMessage.value
      }
      messagesRef.push(message)
      inputMessage.value = ''
    }

    onMounted(() => {
      const messagesRef = db.database().ref('messages')
      messagesRef.on('value', snapshot => {
        const data = snapshot.val()
        const messages: MessageProps[] = []

        Object.keys(data).forEach(key => {
          messages.push({
            id: key,
            username: data[key].username,
            content: data[key].content
          })
        })

        state.messages = messages
      })
    })

    return {
      inputUserName,
      inputMessage,
      isValidateUserName,
      isStepLogin,
      state,
      login,
      logout,
      sendMessage
    }
  }
}
</script>

<style>
.shadow-up {
  box-shadow: 0 -2px 5px #ddd;
}
.message + .message {
  margin-top: 1rem;
}
.content {
  @apply text-white rounded-full py-1 px-3 bg-gray-400;
}
.current-user .content {
  @apply bg-red-400;
}
</style>
