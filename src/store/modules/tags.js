import firebase from 'firebase/app';

const db = firebase.firestore();

const defaultState = {
  tags: {},
  allTags: [],
};

const actions = {
  fetchAllTags: async ({ commit }) => {
    const tags = {};

    const snapshot = await db.collection('tags-2020').get();
    snapshot.forEach((doc) => {
      tags[doc.id] = { id: doc.id, ...doc.data() };
    });

    commit('SAVE_ALL_TAGS', { tags });
  },
};

const getters = {
  tags: (state) => state.tags,
  allTags: (state) => state.allTags.map((id) => state.tags[id]),
};

const mutations = {
  SAVE_ALL_TAGS: (state, { tags }) => {
    state.tags = { ...tags };
    state.allTags = [...Object.keys(tags)];
  },
};

export default {
  namespaced: true,
  state: defaultState,
  getters,
  actions,
  mutations,
};
