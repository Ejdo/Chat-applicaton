<template>
  <q-layout view="lHr LpR lFr">
    <q-header elevated class="bg-white text-primary">
      <q-toolbar class="justify-center">
        <q-toolbar-title shrink>
          <h2> {{ activeChannel }}</h2>
        </q-toolbar-title>
        <q-btn dense flat round icon="menu" class="absolute-right" @click="() => rightDrawerOpen = !rightDrawerOpen" />
      </q-toolbar>
    </q-header>
    <q-drawer v-model="leftDrawerOpen" show-if-above elevated behavior="desktop" side="left">
      <q-splitter v-model="splitterModel" class="full-height">
        <template v-slot:before>
          <q-tabs v-model="tab" vertical indicator-color="white">
            <div class="column full-height justify-center">
              <q-tab name="channels" icon="forum"/>
              <q-tab name="profile" icon="person"/>
              <q-tab name="settings" icon="settings"/>
              <q-btn
                icon="logout"
                flat
                rounded
                class="absolute-bottom q-my-sm"
                @click="logout"
              />
            </div>
          </q-tabs>
        </template>
        <template v-slot:after>
          <q-tab-panels v-model="tab" vertical class="full-height">
            <q-tab-panel name="channels" class="column">
              <h3 class="row">{{ tab }}</h3>
              <q-separator/>
              <q-input dense outlined v-model="channelFilter" label="Search" class="q-my-md">
                <template v-slot:prepend>
                  <q-icon name="search" />
                </template>
              </q-input>
              <q-separator></q-separator>
              <q-scroll-area class="col">
                <q-list separator>
                  <channel-link
                    v-for="(channel,index) in channels"
                    :key="index"
                    :channel="channel"
                    @click="setActiveChannel(channel)"
                  />
                </q-list>
              </q-scroll-area>
              <q-btn round color="primary" icon="add" class="fixed-bottom-right q-ma-md" style="z-index:1;" @click="addChannelDialog = true"/>
            </q-tab-panel>
            <q-tab-panel name="profile">
              <h3>{{ tab }}</h3>
              <q-separator/>
                <q-input dense outlined v-model="username" label="Username" class="q-my-md"></q-input>
                <q-input dense outlined v-model="firstName" label="First name" class="q-my-md"></q-input>
                <q-input dense outlined v-model="lastName" label="Last name" class="q-my-md"></q-input>
                <q-btn push color="primary" label="Save" @click="saveSettings" no-caps icon="save"/>
              </q-tab-panel>
            <q-tab-panel name="settings" class="q-gutter-md">
              <h3>{{ tab }}</h3>
              <q-separator/>
              <q-select v-model="status" :options="options" outlined label="Status" @update:model-value="setUserStatus"/>
            </q-tab-panel>
          </q-tab-panels>
        </template>
      </q-splitter>
    </q-drawer>
    <q-page-container>
      <router-view/>
    </q-page-container>
    <q-drawer v-model="rightDrawerOpen" elevated side="right">
      <div class="column q-pa-md">
        <h3 class="row">channel members</h3>
        <q-separator/>
        <q-list v-if="activeChannel != null">
          <q-item v-for="channelMember in channelMembers" :key="channelMember.id">
            <q-item-section>
              <q-item-label>
                {{ channelMember.username }}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="circle" :color="userState(channelMember.state)" />
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-drawer>
    <q-footer class="bg-secondary q-pa-sm row justify-center bg-white" style="z-index:1">
      <q-card class="col-8" v-show="message[0] === '/' && filteredCommands.length > 0" style="color:#5B636F; border-radius:0">
        <q-card-section>
          <q-list>
            <q-item v-for="command in filteredCommands" :key="command.command" @click="() => { message = command.command.split(' ')[0] + ' '; this.$refs.messageInput.focus()}" class="q-my-sm" clickable v-ripple>
              <q-item-section>
                <q-item-label class="text-weight-bold"> {{ command.command }}</q-item-label>
                <q-item-label> {{ command.description }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
      <q-input v-model="message"
               ref="messageInput"
               placeholder="Type a message..."
               outlined
               dense
               @keydown.enter="submitMessage"
               maxlength="255"
               class="shadow-5 col-12"
               bg-color="secondary">
        <template v-slot:append>
          <q-icon
            v-if="message !== ''"
            name="close"
            @click="clearMessage"
            class="cursor-pointer"
          />
          <q-btn
            round
            dense
            flat
            icon="send"
            color="primary"
            @click="submitMessage"
          />
        </template>
      </q-input>
    </q-footer>
    <q-dialog v-model="addChannelDialog">
      <q-card class="my-card q-pa-md">
        <q-card-section>
          <div class="row no-wrap items-center">
            <div class="col text-h6 ellipsis">
              Add new channel
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="col content-center q-gutter-md">
          <q-input
            outlined
            v-model="newChannelName"
            class="row"
            label="Name"
            :rules="[ val => val.length >= 4 || 'Name must be minimum 4 characters']"
          />
          <q-checkbox v-model="newChannelPublic" label="Public" />
          </div>
        </q-card-section>
        <q-card-actions class="q-my-md">
          <q-btn round color="primary" icon="add" class="absolute-bottom-right q-ma-md" @click="addChannel"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import ChannelLink from 'components/ChannelLink.vue'
import { Notify } from 'quasar'
import { api } from 'boot/axios'
import { User } from 'src/contracts'

export default defineComponent({
  name: 'ChatLayout',
  components: { ChannelLink },
  data: () => {
    return {
      leftDrawerOpen: true,
      rightDrawerOpen: false,
      loading: false,
      darkMode: false,
      status: ref('Online'),
      options: [
        'Online',
        'Do not disturb',
        'Offline'
      ],
      commands: [
        { command: '/join channelName [private]', description: "Join channel or create a new one if it doesn't exist" },
        { command: '/invite nickName', description: 'Invite another user to the channel' },
        { command: '/revoke nickName', description: 'Revoke invite for the user' },
        { command: '/quit', description: 'Delete the channel (must be owner)' },
        { command: '/cancel', description: 'Leave the channel (also deletes the channel if you are owner)' }
      ],
      tab: ref('channels'),
      splitterModel: ref(20),
      searchChannel: ref(''),
      message: '',
      username: ref(''),
      firstName: ref(''),
      lastName: ref(''),
      addChannelDialog: ref(false),
      newChannelName: ref(''),
      newChannelPublic: ref(true)
    }
  },
  computed: {
    ...mapGetters('channels', {
      channels: 'joinedChannels',
      lastMessageOf: 'lastMessageOf',
      channelMembers: 'channelMembers'
    }),
    activeChannel () {
      return this.$store.state.channels.active
    },
    channelFilter: {
      get () : string {
        return this.$store.state.channels.channelFilter
      },
      set (value: string) {
        this.setChannelFilter(value)
      }
    },
    filteredCommands () {
      return this.commands.filter((command) => { return command.command.split(' ')[0].indexOf(this.message.split(' ')[0]) >= 0 })
    }
  },
  methods: {
    clearMessage () {
      this.message = ''
    },
    setUserStatus () {
      this.setStatus(this.status)
    },
    userState (stateId : number) {
      if (stateId === 0) {
        return 'green'
      } else if (stateId === 1) {
        return 'red'
      } else if (stateId === 2) {
        return 'yellow'
      }
    },
    setActiveChannel (channel : string) {
      this.getMembers(channel)
      this.channelSetActive(channel)
    },
    async addChannel () {
      await api.post('channels/join', { name: this.newChannelName, isPublic: this.newChannelPublic })
      this.joinChannel(this.newChannelName)
      this.addChannelDialog = false
    },
    async saveSettings () {
      this.loading = true
      const data = { username: this.username, firstName: this.firstName, lastName: this.lastName }
      await api.put<User>(
        '/user',
        data
      ).then(() => Notify.create({
        message: 'Data saved successfully!'
      })
      )
    },
    async send () {
      this.loading = true
      await this.addMessage({ channel: this.activeChannel, message: this.message })
      this.loading = false
    },
    async submitMessage () {
      if (this.message.length > 0) {
        if (this.message[0] === '/') {
          const command = this.message.split(' ')[0]
          if (command === '/join') {
            const name = this.message.split(' ')[1]
            let isPublic = true
            if (this.message.split(' ')[2] === 'private') {
              isPublic = false
            }
            if (name.length >= 4) {
              await api.post('channels/join', {
                name,
                isPublic
              })
              await this.joinChannel(name)
              this.setActiveChannel(name)
            } else {
              Notify.create({
                message: 'Channel name must be minimum 4 characters'
              })
            }
          }
          if (this.activeChannel != null) {
            if (command === '/invite') {
              if (this.message.split(' ')[1]) {
                await this.inviteUser({ channel: this.activeChannel, username: this.message.split(' ')[1] })
              }
            } else if (command === '/revoke') {
              if (this.message.split(' ')[1]) {
                await this.revokeUser({ channel: this.activeChannel, username: this.message.split(' ')[1] })
              }
            } else if (command === '/quit') {
              await this.leaveChannel({ channel: this.activeChannel })
            } else if (command === '/cancel') {
              await this.leaveChannel({ channel: this.activeChannel })
            } else if (command === '/list') {
              this.rightDrawerOpen = true
            }
          } else {
            Notify.create({
              message: 'Please select a channel first'
            })
          }
        } else {
          if (this.activeChannel != null) {
            await this.send()
          } else {
            Notify.create({
              message: 'Please select a channel first'
            })
          }
        }
        this.message = ''
      }
    },
    ...mapMutations('channels', {
      channelSetActive: 'SET_ACTIVE'
    }),
    ...mapActions('auth', {
      logout: 'logout',
      setStatus: 'setStatus'
    }),
    ...mapActions('channels', {
      addMessage: 'addMessage',
      setChannelFilter: 'setChannelFilter',
      joinChannel: 'join',
      inviteUser: 'inviteUser',
      revokeUser: 'revokeUser',
      leaveChannel: 'leaveChannel',
      getMembers: 'getMembers'
    })
  },
  created () {
    this.username = this.$store.state.auth.user ? this.$store.state.auth.user.username : ''
    this.firstName = this.$store.state.auth.user ? this.$store.state.auth.user.firstName : ''
    this.lastName = this.$store.state.auth.user ? this.$store.state.auth.user.lastName : ''
  }
})
</script>
