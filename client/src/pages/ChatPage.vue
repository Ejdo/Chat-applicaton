<template>
  <q-page class="row q-py-sm">
    <q-scroll-area ref="area" class="row justify-center full-width">
      <div style="width:95%; margin-left: auto; margin-right: auto;">
        <q-chat-message v-for="message in messages"
          :key="message.id"
          :name="message.author.username"
          :text="[message.content]"
          :stamp="message.createdAt.split('T')[0] + ' ' + message.createdAt.split('T')[1].split('.')[0]"
          :sent="isMine(message)"
          :bg-color="messageColor(message)"
          :text-color="textColor(message)"
        />
      </div>
    </q-scroll-area>
  </q-page>
</template>

<script lang="ts">
import { SerializedMessage } from 'src/contracts'
import { QScrollArea } from 'quasar'
import { defineComponent } from 'vue'
import { mapGetters } from 'vuex'

export default defineComponent({
  name: 'ChatPage',
  computed: {
    currentUser () {
      return this.$store.state.auth.user?.id
    },
    messages (): SerializedMessage[] {
      return this.$store.getters['channels/currentMessages']
    },
    ...mapGetters('auth', ['getName'])
  },
  watch: {
    messages: {
      handler () {
        this.$nextTick(() => this.scrollMessages())
      },
      deep: true
    }
  },
  methods: {
    scrollMessages () {
      const area = this.$refs.area as QScrollArea
      area && area.setScrollPercentage('vertical', 1.1)
    },
    isMine (message: SerializedMessage): boolean {
      return message.author.id === this.currentUser
    },
    messageColor (message: SerializedMessage) : string {
      if (this.isMine(message)) {
        return 'primary'
      } else {
        if (message.content.indexOf('@' + this.getName) >= 0) {
          return 'indigo-2'
        } else {
          return 'grey-4'
        }
      }
    },
    textColor (message : SerializedMessage) : string {
      if (this.isMine(message)) {
        return 'white'
      } else {
        return 'black'
      }
    }
  }
})
</script>
