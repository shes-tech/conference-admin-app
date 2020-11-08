import Vue from 'vue';
import firebase from 'firebase/app';

const db = firebase.firestore();

const INITIAL_FETCH_LIMIT = 4;

const defaultState = {
  events: {},
  allEvents: [],
  tags: {},
};

const actions = {
  fetchAllEvents: async ({ commit }) => {
    const events = {};

    const snapshot = await db.collection('events-2020')
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

    const document = await db.collection('events-2020').doc(id).get();

    const event = {
      id: document.id,
      ...document.data(),
    };

    commit('SAVE_EVENT', { event });
  },
  saveEvent: async ({ dispatch }, { id, event }) => {
    if (id) dispatch('updateEvent', { id, event });
    else dispatch('createEvent', event);
  },
  createEvent: async ({ commit }, event) => {
    const document = await db.collection('events-2020').add(event);
    const fetchedEvent = {
      id: document.id,
      ...event,
    };

    commit('SAVE_EVENT', { event: fetchedEvent });
  },
  updateEvent: async ({ commit }, { id, event }) => {
    await db.collection('events-2020').doc(id).set(event);
    const fetchedEvent = {
      id,
      ...event,
    };

    commit('SAVE_EVENT', { event: fetchedEvent });
  },
};

const getters = {
  events: (state) => state.events,
  allEvents: (state) => state.allEvents.map((id) => state.events[id]),
};

const mutations = {
  SAVE_ALL_EVENTS: (state, { events }) => {
    state.events = { ...events };
    state.allEvents = [...Object.keys(events)];
  },
  SAVE_EVENT: (state, { event }) => {
    Vue.set(state.events, event.id, event);
    if (!state.allEvents.includes(event.id)) state.allEvents.push(event.id);
  },
};

export default {
  namespaced: true,
  state: defaultState,
  getters,
  actions,
  mutations,
};
