const defaultState = {
  eventsList: null,
};

const actions = {
};

const getters = {
  eventsList: (state) => state.eventsList,
};

const mutations = {
  SET_FILTERS_EVENTS_LIST: (state, filter) => {
    state.eventsList = filter;
  },
};

export default {
  namespaced: true,
  state: defaultState,
  getters,
  actions,
  mutations,
};
