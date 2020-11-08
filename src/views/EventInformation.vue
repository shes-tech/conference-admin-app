<template>
  <div>
    <v-card-title>
      <v-btn icon to="/events" class="mr-3" exact>
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      Sobre o evento
    </v-card-title>

    <v-card-text>
      <p>Título: {{ event.title }}</p>
      <p>Tipo: {{ event.type }}</p>
      <!-- <p>Início: {{ event.startTime | time }}</p> -->
      <!-- <p>Fim: {{ event.endTime | time }}</p> -->
      <!-- <p>Data: {{ event.startTime.toDate() | date }}</p> -->
    </v-card-text>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'EventInformation',
  props: {
    id: String,
  },
  methods: {
    ...mapActions({
      fetchEventById: 'events/fetchEventById',
    }),
  },
  computed: {
    ...mapGetters({
      events: 'events/events',
    }),
    event() {
      return this.events[this.id] || {};
    },
  },
  created() {
    const { id } = this;
    this.fetchEventById(id);
  },
};
</script>
