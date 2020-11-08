// import Vue from 'vue';
import firebase from 'firebase/app';

// const db = firebase.firestore();
// const auth = firebase.auth();

const defaultState = {
  user: null,
};

const actions = {
  login: async ({ commit }, { email, password }) => {
    const user = await firebase.auth().signInWithEmailAndPassword(email, password);
    commit('SET_USER', user);
    console.log(user);
  },
};

const getters = {
  isUserAuthenticated: (state) => Boolean(state.user),
};

const mutations = {
  SET_USER: (state, user) => {
    state.user = user;
  },
};

export default {
  namespaced: true,
  state: defaultState,
  getters,
  actions,
  mutations,
};
