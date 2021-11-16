import Vue from 'vue';
import firebase from 'firebase/app';

const db = firebase.firestore();
const COLLECTION_NAME = 'events-2021';

const defaultState = {
  events: {},
  allEvents: [],
  tags: {},
};

const actions = {
  fetchAllEvents: async ({ commit }) => {
    const events = {};

    const snapshot = await db.collection(COLLECTION_NAME)
      .orderBy('endTime')
      .orderBy('startTime')
      .get();

    snapshot.forEach((doc) => {
      events[doc.id] = { id: doc.id, ...doc.data() };
    });

    commit('SAVE_ALL_EVENTS', { events });
  },
  fetchEventById: async ({ commit }, id) => {
    const document = await db.collection(COLLECTION_NAME).doc(id).get();

    const event = {
      id: document.id,
      ...document.data(),
    };

    commit('SAVE_EVENT', { event });
  },
  saveEvent: async ({ dispatch }, { id, event }) => {
    if (id) return dispatch('updateEvent', { id, event });
    return dispatch('createEvent', event);
  },
  createEvent: async ({ commit }, event) => {
    const document = await db.collection(COLLECTION_NAME).add(event);
    const fetchedEvent = {
      id: document.id,
      ...event,
    };

    commit('SAVE_EVENT', { event: fetchedEvent });
    return fetchedEvent;
  },
  updateEvent: async ({ commit }, { id, event }) => {
    await db.collection(COLLECTION_NAME).doc(id).set(event);
    const fetchedEvent = {
      id,
      ...event,
    };

    commit('SAVE_EVENT', { event: fetchedEvent });
  },
  deleteEvent: async ({ commit }, { id }) => {
    await db.collection(COLLECTION_NAME).doc(id).delete();
    commit('DELETE_EVENT', { id });
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
    if (state.allEvents.length !== 0 && !state.allEvents.includes(event.id)) {
      state.allEvents.push(event.id);
    }
  },
  DELETE_EVENT: (state, { id }) => {
    const index = state.allEvents.indexOf(id);
    if (index !== -1) state.allEvents.splice(index, 1);
  },
};

export default {
  namespaced: true,
  state: defaultState,
  getters,
  actions,
  mutations,
};
