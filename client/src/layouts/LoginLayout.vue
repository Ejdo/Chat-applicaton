<template>
  <q-layout>
    <q-page-container>
      <q-page class="window-height window-width">
        <q-card class="row fixed-center justify-center items-center q-pa-sm-md responsive-card">
          <q-card-section class="q-px-sm-xl">
            <router-view></router-view>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LoginLayout'
})
</script>
