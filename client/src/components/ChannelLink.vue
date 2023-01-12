<template>
  <q-item
    clickable
    v-ripple
  >
    <q-item-section avatar>
      <q-avatar color="secondary" icon="group"/>
    </q-item-section>
    <q-item-section>
      {{ channel }}
    </q-item-section>
    <!-- <q-item-section side v-if="notifications">
      <q-badge color="red" :label="notifications" />
    </q-item-section> -->
  </q-item>
</template>

<script>
export default {
  name: 'ChannelLink',
  props: [
    'channel'
  ]
}
</script>
