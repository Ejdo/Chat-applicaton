import { User } from 'src/contracts'
import { MutationTree } from 'vuex'
import { AuthStateInterface } from './state'
import { activityService } from 'src/services'

const mutation: MutationTree<AuthStateInterface> = {
  AUTH_START (state) {
    state.status = 'pending'
    state.errors = []
  },
  AUTH_SUCCESS (state, user: User | null) {
    state.status = 'success'
    state.user = user
  },
  AUTH_ERROR (state, errors) {
    state.status = 'error'
    state.errors = errors
  },
  SET_STATUS (state, statusId: number) {
    if (state.user) {
      activityService.changeStatus(statusId)
      state.user.state = statusId
    }
  }
}

export default mutation
