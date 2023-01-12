<template>
  <div class="absolute-center q-pa-sm-lg column no-wrap justify-around items-center q-gutter-md">
    <q-avatar size="100px" font-size="52px" color="primary" text-color="white" icon="settings"/>
    <q-toggle v-model="darkMode" label="Turn on dark mode (WIP)" disable color="primary"/>
    <q-select v-model="status" :options="options" outlined label="Status" class="self-stretch"/>
    <q-btn
      push
      color="primary"
      label="Ping me (for testing only)"
      no-caps
      icon="send"
      padding="sm xl"
      @click="ping"
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
  name: 'SettingsPage',
  data () {
    return {
      darkMode: false,
      status: 'Online',
      options: [
        'Online',
        'Invisible',
        'Do not disturb',
        'Inactive'
      ],
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
    },
    ping () {
      Notify.create({
        message: 'John Doe in Second Channel pinged you',
        color: 'primary'
      })
    }
  }
})
</script>

<style scoped>

</style>
