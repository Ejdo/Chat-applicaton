<template>
  <h1 class="text-center">Log in</h1>
  <div class="column justify-center q-gutter-xs q-my-xl">
    <q-input
      ref="nameRef"
      outlined
      autofocus
      id="email"
      v-model="credentials.email"
      class="col-12"
      label="Email"
      :error="userNotFound"
      :rules="emailRules"
    >
    <template v-slot:error>
        User not found
    </template>
    </q-input>
    <q-input
      ref="passwordRef"
      outlined
      id="email"
      v-model="credentials.password"
      class="col-12"
      :type="isPwd ? 'password' : 'text'"
      label="Password"
      :rules="passwordRules"
    >
      <template v-slot:append>
        <q-icon
          :name="isPwd ? 'visibility_off' : 'visibility'"
          class="cursor-pointer"
          @click="isPwd = !isPwd"
        />
      </template>
    </q-input>
    <q-checkbox
      id="rememberMe"
      v-model="credentials.remember"
      label="Remember me"
    />
  </div>
  <div class="column wrap content-center" style="margin:15px 35px">
    <q-btn
      class="shadow-4 q-px-xl"
      color="primary"
      text-color="white"
      no-caps
      label="Log in"
      :loading="loading"
      @click="login"
      style="font-size:20px;"
    />
    <q-btn
      :to="{ name: 'register' }"
      flat
      no-caps
      :ripple="true"
      color="light-blue-10"
      label="Register"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { RouteLocationRaw } from 'vue-router'

export default defineComponent({
  name: 'LoginPage',
  data () {
    return {
      credentials: {
        email: '',
        password: '',
        remember: false
      },
      nameRef: ref(null),
      passwordRef: ref(null),
      isPwd: true,
      userNotFound: false,
      emailRules: [
      // eslint-disable-next-line
        (v: string) => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'Email is invalid'
      ],
      passwordRules: [
        (v: string) => v.length >= 8 || 'Password too short'
      ]
    }
  },
  computed: {
    redirectTo (): RouteLocationRaw {
      return (this.$route.query.redirect as string) || { name: 'chat' }
    },
    loading (): boolean {
      return this.$store.state.auth.status === 'pending'
    }
  },
  methods: {
    login () {
      this.$store.dispatch('auth/login', this.credentials).then(() => {
        this.$router.push(this.redirectTo)
      }).catch((e) => {
        if (e.message === 'Request failed with status code 400') {
          this.userNotFound = true
        }
      })
    },

    onRedirect () {
      this.$router.push({ name: 'chat' })
    }
  }
})
</script>
