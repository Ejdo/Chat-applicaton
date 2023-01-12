import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { AuthStateInterface } from './state'
import { authService, authManager } from 'src/services'
import { LoginCredentials, RegisterData } from 'src/contracts'
import { api } from 'boot/axios'
import { Channel } from 'src/contracts/Channel'

const actions: ActionTree<AuthStateInterface, StateInterface> = {
  async check ({ state, commit, dispatch }) {
    try {
      commit('AUTH_START')
      const user = await authService.me()
      // join user to general channel - hardcoded for now

      if (user?.id !== state.user?.id) {
        await api.get('channels/index').then(response => {
          response.data.forEach((channel:Channel) => dispatch('channels/join', channel.name, { root: true }))
        })
      }
      commit('AUTH_SUCCESS', user)
      return user !== null
    } catch (err) {
      commit('AUTH_ERROR', err)
      throw err
    }
  },
  async register ({ commit }, form: RegisterData) {
    try {
      commit('AUTH_START')
      const user = await authService.register(form)
      commit('AUTH_SUCCESS', null)
      return user
    } catch (err) {
      commit('AUTH_ERROR', err)
      throw err
    }
  },
  async login ({ commit }, credentials: LoginCredentials) {
    try {
      commit('AUTH_START')
      const apiToken = await authService.login(credentials)
      commit('AUTH_SUCCESS', null)
      // save api token to local storage and notify listeners
      authManager.setToken(apiToken.token)
      return apiToken
    } catch (err) {
      commit('AUTH_ERROR', err)
      throw err
    }
  },
  async logout ({ commit, dispatch }) {
    try {
      commit('AUTH_START')
      await authService.logout()
      await dispatch('channels/leave', null, { root: true })
      commit('AUTH_SUCCESS', null)
      // remove api token and notify listeners
      authManager.removeToken()
    } catch (err) {
      commit('AUTH_ERROR', err)
      throw err
    }
  },
  setStatus ({ commit }, status : string) {
    if (status === 'Online') {
      commit('SET_STATUS', 0)
    } else if (status === 'Offline') {
      commit('SET_STATUS', 1)
    } else if (status === 'Do not disturb') {
      commit('SET_STATUS', 2)
    }
  }
}

export default actions
