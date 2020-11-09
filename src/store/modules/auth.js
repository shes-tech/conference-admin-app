// import Vue from 'vue';
import firebase from 'firebase/app';

const userLocalStorage = JSON.parse(localStorage.getItem('user'));

const defaultState = {
  user: userLocalStorage || null,
};

const actions = {
  login: async ({ commit }, { email, password }) => {
    const user = await firebase.auth().signInWithEmailAndPassword(email, password);
    commit('SET_USER', user);
  },
  logout: async ({ commit }) => {
    await firebase.auth().signOut();
    commit('DELETE_USER');
  },
};

const getters = {
  isUserAuthenticated: (state) => Boolean(state.user),
};

const mutations = {
  SET_USER: (state, user) => {
    state.user = user;
    localStorage.setItem('user', JSON.stringify(user));
  },
  DELETE_USER: (state) => {
    state.user = null;
    localStorage.clear();
  },
};

export default {
  namespaced: true,
  state: defaultState,
  getters,
  actions,
  mutations,
};
