<template>
  <div>
    <v-card-title>
      <v-btn icon :to="pathBack" class="mr-3" exact>
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      Sobre o evento
      <LoadingCircle v-if="isLoading" />
      <v-spacer></v-spacer>
      <v-btn color="error" icon @click="deleteEvent()">
        <v-icon dark>
          mdi-delete
        </v-icon>
      </v-btn>
      <v-btn
        color="primary"
        elevation="0"
        class="ml-2"
        :to="`/events/${id}/edit?lastView=${listPage}`"
      >
        <v-icon left dark>
          mdi-pencil
        </v-icon>
        Editar
      </v-btn>
    </v-card-title>

    <v-card-text v-if="!isEventLoaded" class="text-center py-6">
      Carregando...
    </v-card-text>
    <v-card-text v-else class="mt-5">
      <TextDescription label="Título">
        {{ event.title }}
      </TextDescription>
      <TextDescription label="Descrição">
        {{ event.description || '' }}
      </TextDescription>
      <TextDescription label="Trilha">
        {{ event.tag ? tags[event.tag].name : 'Nenhuma trilha selecionada' }}
      </TextDescription>

      <TextDescription label="Horário">
        {{ event.startTime | dateFirestore }},
        {{ event.startTime | timeFirestore }} -
        {{ event.endTime | timeFirestore }}
      </TextDescription>

      <v-card-title>
        Palestrantes
      </v-card-title>

      <SpeakerPreviewCard
        v-for="(speaker, index) in event.speakers"
        :key="index"
        :speaker="speaker"
        class="mb-3"
      />
    </v-card-text>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import TextDescription from '@/components/TextDescription.vue';
import SpeakerPreviewCard from '@/components/SpeakerPreviewCard.vue';
import LoadingCircle from '@/components/LoadingCircle.vue';

export default {
  name: 'EventInformation',
  components: {
    TextDescription,
    SpeakerPreviewCard,
    LoadingCircle,
  },
  props: {
    id: String,
  },
  data() {
    return {
      isLoading: false,
      listPage: 'list',
      calendarLastDay: null,
    };
  },
  methods: {
    ...mapActions({
      fetchEventById: 'events/fetchEventById',
      sendDeleteEvent: 'events/deleteEvent',
    }),
    async deleteEvent() {
      const { event } = this;
      // eslint-disable-next-line no-alert
      const shouldDelete = window.confirm(`Deseja apagar definitivamente o evento "${event.title}"?`);
      if (!shouldDelete) return;

      const { id } = event;
      await this.sendDeleteEvent({ id });
      this.$router.push('/events');
    },
  },
  computed: {
    ...mapGetters({
      events: 'events/events',
      tags: 'tags/tags',
    }),
    event() {
      return this.events[this.id] || {};
    },
    isEventLoaded() {
      return Boolean(this.events[this.id]);
    },
    pathBack() {
      const { listPage, calendarLastDay } = this;
      if (listPage === 'calendar') {
        if (calendarLastDay) return `/events-calendar?day=${calendarLastDay}`;
        return '/events-calendar';
      }

      return '/events';
    },
  },
  async created() {
    const { id } = this;

    this.isLoading = true;
    await this.fetchEventById(id);
    this.isLoading = false;

    const { lastView, lastDay } = this.$route.query;
    if (lastView === 'calendar') this.listPage = 'calendar';
    if (lastDay) this.calendarLastDay = lastDay;
  },
};
</script>
