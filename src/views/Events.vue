<template>
  <div>
    <v-card-title>
      <v-btn
        icon
        to="/menu"
        class="mr-3"
      >
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      Eventos
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        elevation="0"
        to="/events/create"
      >
        <v-icon left dark>
          mdi-plus
        </v-icon>
        Novo Evento
      </v-btn>
    </v-card-title>

    <v-row class="mx-1">
      <v-col cols="12" class="pb-0">
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Pesquisar"
          single-line
          hide-details
          outlined
          filled
          dense
        ></v-text-field>
      </v-col>
      <v-col cols="6">
        <v-select
          v-model="filters.day"
          :items="daysOptions"
          label="Dia"
          item-text="label"
          item-value="value"
          hide-details
          clearable
          outlined
          filled
          dense
        ></v-select>
      </v-col>
      <v-col cols="6">
        <v-select
          v-model="filters.tag"
          :items="tagsOptions"
          label="Palco"
          hide-details
          clearable
          outlined
          filled
          dense
        ></v-select>
      </v-col>
    </v-row>

    <v-data-table
      :headers="headers"
      :items="filteredEvents"
      :loading="isLoading"
      :search="search"
    >
      <template v-slot:item.title="{ item }">
        <router-link :to="`/events/${item.id}`">
          {{ item.title }}
        </router-link>
      </template>
      <template v-slot:item.startTime="{ item }">
        {{ item.startTime | shortDateFirestore }},
        {{ item.startTime | timeFirestore }} -
        {{ item.endTime | timeFirestore }}
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon
          small
          class="mr-2"
          @click="$router.push(`/events/${item.id}/edit`)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          small
          @click="deleteEvent(item)"
        >
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';

import { isSameDay } from 'date-fns';

export default {
  name: 'Events',
  data() {
    return {
      isLoading: false,
      search: '',
      headers: [
        {
          text: 'Título',
          align: 'start',
          value: 'title',
        },
        { text: 'Trilha', value: 'tag' },
        { text: 'Data', value: 'startTime' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      daysOptions: [
        { label: 'Terça 17/11', value: new Date(2020, 10, 17) },
        { label: 'Quarta 18/11', value: new Date(2020, 10, 18) },
        { label: 'Quinta 19/11', value: new Date(2020, 10, 19) },
        { label: 'Sexta 20/11', value: new Date(2020, 10, 20) },
        { label: 'Sábado 21/11', value: new Date(2020, 10, 21) },
      ],
      filters: {
        day: null,
        tag: null,
      },
    };
  },
  methods: {
    ...mapActions({
      fetchAllEvents: 'events/fetchAllEvents',
      sendDeleteEvent: 'events/deleteEvent',
    }),
    ...mapMutations({
      saveFilters: 'filters/SET_FILTERS_EVENTS_LIST',
    }),
    async loadEvents() {
      this.isLoading = true;
      await this.fetchAllEvents();
      this.isLoading = false;
    },
    async deleteEvent(event) {
      // eslint-disable-next-line no-alert
      const shouldDelete = window.confirm(`Deseja apagar definitivamente o evento "${event.title}"?`);
      if (!shouldDelete) return;

      const { id } = event;
      await this.sendDeleteEvent({ id });
    },
  },
  computed: {
    ...mapGetters({
      allEvents: 'events/allEvents',
      tags: 'tags/tags',
      storedFilters: 'filters/eventsList',
    }),
    tagsOptions() {
      const tags = [];
      const allTags = Object.values(this.tags);

      allTags.forEach((tag) => {
        const label = tag.name;
        const index = tags.indexOf(label);
        if (index === -1) tags.push(label);
      });

      return tags;
    },
    filteredEvents() {
      let events = this.allEvents.map((event) => ({
        ...event,
        tag: event.tag ? this.tags[event.tag].name : '',
      }));

      const { day, tag } = this.filters;
      if (day) events = events.filter((event) => isSameDay(event.startTime.toDate(), day));
      if (tag) events = events.filter((event) => event.tag === tag);

      return events;
    },
  },
  created() {
    if (this.allEvents.length === 0) this.loadEvents();
    if (this.storedFilters) this.filters = { ...this.storedFilters };
  },
  beforeRouteLeave(to, from, next) {
    this.saveFilters(this.filters);
    next();
  },
};
</script>
