<template>
  <div class="absolute-center q-pa-sm-lg column no-wrap justify-around items-center q-gutter-md">
    <q-avatar size="100px" font-size="52px" color="primary" text-color="white" icon="person"/>
    <q-input
      outlined
      v-model="username"
      placeholder="Enter your new username..."
      hint="Username"
    />
    <q-input
      outlined
      v-model="firstName"
      placeholder="Enter your new first name..."
      hint="First name"
    />
    <q-input
      outlined
      v-model="lastName"
      placeholder="Enter your new last name..."
      hint="Last name"
    />
    <q-btn
      push
      color="primary"
      label="Save"
      no-caps
      icon="save"
      padding="sm xl"
      :loading="isSaving"
      @click="simulateProgress"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Notify } from 'quasar'

export default defineComponent({
  name: 'ProfilePage',
  data () {
    return {
      username: 'john-doe',
      firstName: 'John',
      lastName: 'Doe',
      isSaving: false
    }
  },
  methods: {
    simulateProgress () {
      this.isSaving = true

      setTimeout(() => {
        this.isSaving = false
        Notify.create('Your new data was saved! (actually, no)')
      }, 1000)
    }
  }
})
</script>

<style scoped>

</style>
