<template>
  <div class="pb-4">
    <v-card-title>
      <v-btn
        icon
        to="/menu"
        class="mr-3"
      >
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      Calendário de Eventos
      <v-spacer></v-spacer>
      <v-btn color="primary" to="/events" class="mr-2" outlined>
        <v-icon left dark>
          mdi-format-list-bulleted
        </v-icon>
        Ver em lista
      </v-btn>
      <v-btn
        color="primary"
        elevation="0"
        to="/events/create?lastView=calendar"
      >
        <v-icon left dark>
          mdi-plus
        </v-icon>
        Novo Evento
      </v-btn>
    </v-card-title>

    <v-toolbar v-if="!isLoading" flat>
      <v-btn
        outlined
        class="mr-4"
        color="grey darken-2"
        @click="calendarDay = '2021-11-17'"
      >
        Primeiro Dia
      </v-btn>
      <v-btn
        fab
        text
        small
        color="grey darken-2"
        @click="$refs.calendar.prev()"
      >
        <v-icon small>
          mdi-chevron-left
        </v-icon>
      </v-btn>
      <v-btn
        fab
        text
        small
        color="grey darken-2"
        @click="$refs.calendar.next()"
      >
        <v-icon small>
          mdi-chevron-right
        </v-icon>
      </v-btn>
      <v-toolbar-title v-if="$refs.calendar">
        {{ $refs.calendar.title }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>

    <v-card-text v-if="isLoading" class="text-center py-6">
      Carregando...
    </v-card-text>
    <v-calendar
      v-else
      v-model="calendarDay"
      ref="calendar"
      color="primary"
      type="category"
      category-show-all
      first-time="10:00"
      interval-count="14"
      :categories="tagsOptions"
      :event-overlap-threshold="30"
      :events="eventsCalendar"
      :event-color="getEventColor"
      @click:event="showEvent"
      @change="changeDay"
    ></v-calendar>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';

export default {
  name: 'EventsCalendar',
  data() {
    return {
      isLoading: false,
      calendarDay: '2021-11-17',
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
        { label: 'Quarta 17/11', value: new Date(2021, 10, 17) },
        { label: 'Quinta 18/11', value: new Date(2021, 10, 18) },
        { label: 'Sexta 19/11', value: new Date(2021, 10, 19) },
        { label: 'Sábado 20/11', value: new Date(2021, 10, 20) },
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
    showEvent(event) {
      const { id } = event.event;
      const day = this.calendarDay;
      this.$router.push(`/events/${id}?lastView=calendar&lastDay=${day}`);
    },
    changeDay(time) {
      const day = time.start.date;
      this.$router.replace({
        name: 'EventsCalendar',
        query: {
          day,
        },
      });
    },
    getEventColor(event) {
      const { category } = event;
      switch (category) {
        case 'Inspire Arena':
          return '#1446A0';
        case 'Engage Arena':
          return '#DB3069';
        case 'Hands-On':
          return '#315C2B';
        case 'Innovate Arena':
          return '#4F345A';
        default:
          return '#3C3C3B';
      }
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
    eventsCalendar() {
      const cal = this.allEvents.map((event) => ({
        id: event.id,
        name: event.title,
        start: event.startTime && event.startTime.toDate(),
        end: event.endTime && event.endTime.toDate(),
        category: event.tag ? this.tags[event.tag].name : '',
        timed: true,
      }));
      return cal;
    },
  },
  created() {
    if (this.allEvents.length === 0) this.loadEvents();
    if (this.storedFilters) this.filters = { ...this.storedFilters };

    const { day } = this.$route.query;
    if (day) this.calendarDay = day;
  },
  beforeRouteLeave(to, from, next) {
    this.saveFilters(this.filters);
    next();
  },
};
</script>
