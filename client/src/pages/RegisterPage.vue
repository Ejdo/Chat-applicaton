<template>
  <h1 class="text-center">Register</h1>
  <div class="column justify-center q-gutter-xs q-my-xl">
    <q-input
      outlined
      v-model="credentials.email"
      class="col-12"
      label="Email"
      type="email"
      :rules="emailRules"
    />
    <q-input
      outlined
      v-model="credentials.username"
      class="col-12"
      label="Username"
      :rules="[val => val.length >= 4 || 'Minimal length is 4', val => /([A-Za-z0-9-_]+$)/.test(val) || 'Special characters not allowed']"
    />
    <div class="row justify-between content-between">
      <q-input
        outlined
        v-model="credentials.firstName"
        class="col-sm col-grow q-mr-sm-md"
        label="First name"
        :rules="[val => val.length >= 4 || 'Minimal length is 4', val => /([A-Za-z]+$)/.test(val) || 'Special characters or numbers not allowed']"
      />
      <q-input
        outlined
        v-model="credentials.lastName"
        class="col-sm col-grow"
        label="Last name"
        :rules="[val => val.length >= 4 || 'Minimal length is 4', val => /([A-Za-z]+$)/.test(val) || 'Special characters or numbers not allowed']"
      />
    </div>
    <q-input
      outlined
      v-model="credentials.password"
      class="col-12"
      :type="isPwd ? 'password' : 'text'"
      label="Password"
      :error="!passwordsMatch"
      :rules="passwordRules"
    >
      <template v-slot:append>
        <q-icon
          :name="isPwd ? 'visibility_off' : 'visibility'"
          class="cursor-pointer"
          @click="isPwd = !isPwd"
        />
      </template>
      <template v-slot:error>
        Passwords dont match
      </template>
    </q-input>
    <q-input
      outlined
      v-model="credentials.passwordConfirmation"
      class="col-12"
      :type="isPwd ? 'password' : 'text'"
      label="Repeat password"
      :error="!passwordsMatch"
      :rules="passwordRules"
    >
      <template v-slot:append>
        <q-icon
          :name="isPwd ? 'visibility_off' : 'visibility'"
          class="cursor-pointer"
          @click="isPwd = !isPwd"
        />
      </template>
      <template v-slot:error>
        Passwords dont match
      </template>
    </q-input>
  </div>
  <div class="column wrap content-center" style="margin:15px 35px">
    <q-btn
      class="shadow-4 q-px-xl"
      color="primary"
      text-color="white"
      no-caps
      label="Register"
      @click="onSubmit"
      style="font-size:20px;"
    />
    <q-btn
      :to="{ name: 'login' }"
      flat
      no-caps
      :ripple="false"
      color="light-blue-10"
      label="Back"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { RouteLocationRaw } from 'vue-router'

export default defineComponent({
  name: 'RegisterPage',
  data () {
    return {
      credentials: { email: '', password: '', passwordConfirmation: '', username: '', firstName: '', lastName: '' },
      isPwd: true,
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
      return { name: 'login' }
    },
    passwordsMatch (): boolean {
      return this.credentials.password === this.credentials.passwordConfirmation
    },
    loading (): boolean {
      return this.$store.state.auth.status === 'pending'
    }
  },
  methods: {
    onSubmit () {
      this.$store.dispatch('auth/register', this.credentials).then(() => this.$router.push(this.redirectTo))
    }
  }
})
</script>
