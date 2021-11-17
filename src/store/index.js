import Vue from 'vue';
import Vuex from 'vuex';

import auth from './modules/auth';
import events from './modules/events';
import mentorias from './modules/mentorias';
import tags from './modules/tags';
import filters from './modules/filters';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    auth,
    events,
    mentorias,
    tags,
    filters,
  },
});
