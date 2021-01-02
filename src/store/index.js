import { createStore } from 'vuex';
import api from '@/api/user';

export default createStore({
  state: {
    user: undefined
  },
  getters: {
    getCurrentUser: (state) => () => {
      if (state.user) {
        return state.user;
      }
      let user = api.getCurrentUser();
      if (user.username) {
        state.user = user;
      } else {
        state.user = undefined;
      }
      return state.user;
    },
  },
  actions: {
    setCurrentUser: ({ commit }, user) => {
      commit('setCurrentUser', user);
    }
  },
  mutations: {
    setCurrentUser(state, user) {
      state.user = user;
    },
  },
  modules: {
  }
})
