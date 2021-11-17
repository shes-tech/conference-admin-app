<template>
  <div>
    <v-card-title>
      <v-btn icon to="/mentorias" class="mr-3" exact>
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      Sobre a mentoria
      <LoadingCircle v-if="isLoading" />
      <v-spacer></v-spacer>
      <v-btn color="error" icon @click="deleteMentoria()">
        <v-icon dark>
          mdi-delete
        </v-icon>
      </v-btn>
      <v-btn
        color="primary"
        elevation="0"
        class="ml-2"
        :to="`/mentorias/${id}/edit`"
      >
        <v-icon left dark>
          mdi-pencil
        </v-icon>
        Editar
      </v-btn>
    </v-card-title>

    <v-card-text v-if="!isMentoriaLoaded" class="text-center py-6">
      Carregando...
    </v-card-text>
    <v-card-text v-else class="mt-5">
      <TextDescription label="Título">
        {{ mentoria.title }}
      </TextDescription>
      <TextDescription label="Horários Disponíveis">
        {{ mentoria.isAvailable ? 'SIM' : 'NÃO' }}
      </TextDescription>
      <TextDescription label="Link do Calendly">
        {{ mentoria.link }}
      </TextDescription>
      <TextDescription label="Link no WebApp" class="pt-6">
        <a
          :href="`https://conference.shestech.org/career/${ mentoria.id }`"
          target="_blank" rel="noopener noreferrer"
        >
          https://conference.shestech.org/career/{{ mentoria.id }}
        </a>
      </TextDescription>

      <v-card-title>
        Mentora
      </v-card-title>

      <SpeakerPreviewCard
        :speaker="mentoria.mentora"
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
  name: 'MentoriaInformation',
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
      fetchMentoriaById: 'mentorias/fetchMentoriaById',
      sendDeleteMentoria: 'mentorias/deleteMentoria',
    }),
    async deleteMentoria() {
      const { mentoria } = this;
      // eslint-disable-next-line no-alert
      const shouldDelete = window.confirm(`Deseja apagar definitivamente o evento "${mentoria.title}"?`);
      if (!shouldDelete) return;

      const { id } = mentoria;
      await this.sendDeleteMentoria({ id });
      this.$router.push('/mentorias');
    },
  },
  computed: {
    ...mapGetters({
      mentorias: 'mentorias/mentorias',
      tags: 'tags/tags',
    }),
    mentoria() {
      return this.mentorias[this.id] || {};
    },
    isMentoriaLoaded() {
      return Boolean(this.mentorias[this.id]);
    },
  },
  async created() {
    const { id } = this;

    this.isLoading = true;
    await this.fetchMentoriaById(id);
    this.isLoading = false;

    const { lastView, lastDay } = this.$route.query;
    if (lastView === 'calendar') this.listPage = 'calendar';
    if (lastDay) this.calendarLastDay = lastDay;
  },
};
</script>
