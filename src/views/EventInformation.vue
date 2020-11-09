<template>
  <div>
    <v-card-title>
      <v-btn icon to="/events" class="mr-3" exact>
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      Sobre o evento
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        elevation="0"
        :to="`/events/${id}/edit`"
      >
        <v-icon left dark>
          mdi-pencil
        </v-icon>
        Editar
      </v-btn>
    </v-card-title>

    <v-card-text class="mt-5">
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

export default {
  name: 'EventInformation',
  components: {
    TextDescription,
    SpeakerPreviewCard,
  },
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
      tags: 'tags/tags',
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
