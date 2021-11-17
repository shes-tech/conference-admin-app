// import Vue from 'vue';
import firebase from 'firebase/app';

const db = firebase.firestore();
const userLocalStorage = JSON.parse(localStorage.getItem('user'));

const defaultState = {
  user: userLocalStorage || null,
};

const actions = {
  login: async ({ commit }, { email, password }) => {
    const userAuth = await firebase.auth().signInWithEmailAndPassword(email, password);
    const userId = userAuth.user.uid;

    const userRecord = await db.collection('users').doc(userId).get();
    const userData = userRecord.data();

    const user = {
      id: userAuth.user.uid,
      permissions: userData.permissions,
    };
    commit('SET_USER', user);
  },
  logout: async ({ commit }) => {
    await firebase.auth().signOut();
    commit('DELETE_USER');
  },
  recoverPassword: async (parsers, { email }) => {
    await firebase.auth().sendPasswordResetEmail(email);
  },
};

const getters = {
  isUserAuthenticated: (state) => Boolean(state.user),
  permissions: (state) => state.user.permissions,
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
