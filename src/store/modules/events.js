import Vue from 'vue';
import firebase from 'firebase/app';

const db = firebase.firestore();

const INITIAL_FETCH_LIMIT = 4;

const defaultState = {
  events: {},
  allEvents: [],
};

const actions = {
  fetchAllEvents: async ({ commit }) => {
    const events = {};

    const snapshot = await db.collection('events')
      .orderBy('endTime')
      .orderBy('startTime')
      .limit(INITIAL_FETCH_LIMIT)
      .get();

    snapshot.forEach((doc) => {
      events[doc.id] = { id: doc.id, ...doc.data() };
    });

    commit('SAVE_ALL_EVENTS', { events });
  },
  fetchEventById: async ({ state, commit }, id) => {
    if (state.events[id]) return;

    const document = await db.collection('events').doc(id).get();

    const event = {
      id: document.id,
      ...document.data(),
    };

    commit('SAVE_EVENT', { event });
  },
};

const getters = {
  events: (state) => state.events,
  allEvents: (state) => state.allEvents.map((id) => state.events[id]),
};

const mutations = {
  SAVE_ALL_EVENTS: (state, { events }) => {
    state.events = { ...state.events, ...events };
    state.allEvents = [...state.allEvents, ...Object.keys(events)];
  },
  SAVE_EVENT: (state, { event }) => {
    Vue.set(state.events, event.id, event);
  },
};

export default {
  namespaced: true,
  state: defaultState,
  getters,
  actions,
  mutations,
};
