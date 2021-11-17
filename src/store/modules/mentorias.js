import Vue from 'vue';
import firebase from 'firebase/app';

const db = firebase.firestore();
const COLLECTION_NAME = 'mentorias-2021';

const defaultState = {
  mentorias: {},
  allMentorias: [],
};

const actions = {
  fetchAllMentorias: async ({ commit }) => {
    const mentorias = {};

    const snapshot = await db.collection(COLLECTION_NAME).get();
    snapshot.forEach((doc) => {
      mentorias[doc.id] = { id: doc.id, ...doc.data() };
    });

    commit('SAVE_ALL_MENTORIAS', { mentorias });
  },
  fetchMentoriaById: async ({ commit }, id) => {
    const document = await db.collection(COLLECTION_NAME).doc(id).get();

    const mentoria = {
      id: document.id,
      ...document.data(),
    };

    commit('SAVE_MENTORIA', { mentoria });
  },
  saveMentoria: async ({ dispatch }, { id, mentoria }) => {
    if (id) return dispatch('updateMentoria', { id, mentoria });
    return dispatch('createMentoria', mentoria);
  },
  createMentoria: async ({ commit }, mentoria) => {
    const document = await db.collection(COLLECTION_NAME).add(mentoria);
    const fetchedMentoria = {
      id: document.id,
      ...mentoria,
    };

    commit('SAVE_MENTORIA', { mentoria: fetchedMentoria });
    return fetchedMentoria;
  },
  updateMentoria: async ({ commit }, { id, mentoria }) => {
    await db.collection(COLLECTION_NAME).doc(id).set(mentoria);
    const fetchedMentoria = {
      id,
      ...mentoria,
    };

    commit('SAVE_MENTORIA', { mentoria: fetchedMentoria });
    return fetchedMentoria;
  },
  deleteMentoria: async ({ commit }, { id }) => {
    await db.collection(COLLECTION_NAME).doc(id).delete();
    commit('DELETE_MENTORIA', { id });
  },
};

const getters = {
  mentorias: (state) => state.mentorias,
  allMentorias: (state) => state.allMentorias.map((id) => state.mentorias[id]),
};

const mutations = {
  SAVE_ALL_MENTORIAS: (state, { mentorias }) => {
    state.mentorias = { ...mentorias };
    state.allMentorias = [...Object.keys(mentorias)];
  },
  SAVE_MENTORIA: (state, { mentoria }) => {
    Vue.set(state.mentorias, mentoria.id, mentoria);
    if (state.allMentorias.length !== 0 && !state.allMentorias.includes(mentoria.id)) {
      state.allMentorias.push(mentoria.id);
    }
  },
  DELETE_MENTORIA: (state, { id }) => {
    const index = state.allMentorias.indexOf(id);
    if (index !== -1) state.allMentorias.splice(index, 1);
  },
};

export default {
  namespaced: true,
  state: defaultState,
  getters,
  actions,
  mutations,
};
