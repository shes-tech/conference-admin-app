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

    <v-toolbar
      flat
    >
      <v-btn
        outlined
        class="mr-4"
        color="grey darken-2"
        @click="calendarDay = '2020-11-17'"
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

    <v-calendar
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
      calendarDay: '2020-11-17',
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
        case "She's work on":
          return '#FAA613';
        case 'Eventos Extras':
          return '#4F345A';
        case 'Empower Arena':
          return '#315C2B';
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
