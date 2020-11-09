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

    <v-card-title>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Pesquisar"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>

    <v-data-table
      :headers="headers"
      :items="allEvents"
      :items-per-page="5"
      :loading="isLoading"
      :search="search"
    >
      <template v-slot:item.title="{ item }">
        <router-link :to="`/events/${item.id}`">
          {{ item.title }}
        </router-link>
      </template>
      <template v-slot:item.tag="{ item }">
        {{ item.tag ? tags[item.tag].name : '' }}
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
import { mapActions, mapGetters } from 'vuex';

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
    };
  },
  methods: {
    ...mapActions({
      fetchAllEvents: 'events/fetchAllEvents',
      sendDeleteEvent: 'events/deleteEvent',
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
    }),
  },
  created() {
    if (this.allEvents.length === 0) this.loadEvents();
  },
};
</script>
