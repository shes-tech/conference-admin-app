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
        { text: 'Tipo', value: 'type' },
      ],
    };
  },
  methods: {
    ...mapActions({
      fetchAllEvents: 'events/fetchAllEvents',
    }),
    async loadEvents() {
      this.isLoading = true;
      await this.fetchAllEvents();
      this.isLoading = false;
    },
  },
  computed: {
    ...mapGetters({
      allEvents: 'events/allEvents',
    }),
  },
  created() {
    if (this.allEvents.length === 0) this.loadEvents();
  },
};
</script>
