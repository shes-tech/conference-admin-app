<template>
  <div>
    <v-card-title>
      <v-btn icon to="/tags" class="mr-3" exact>
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      Sobre a trilha
      <LoadingCircle v-if="isLoading" />
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        elevation="0"
        :to="`/tags/${id}/edit`"
      >
        <v-icon left dark>
          mdi-pencil
        </v-icon>
        Editar
      </v-btn>
    </v-card-title>

    <v-card-text v-if="!isTagLoaded" class="text-center py-6">
      Carregando...
    </v-card-text>
    <v-card-text v-else class="mt-5">
      <TextDescription label="Descrição">
        {{ tag.description }}
      </TextDescription>

      <TextDescription
        label="Nome Público"
        hint="Este nome irá aparecer na lista de eventos para o usuário final"
      >
        {{ tag.name }}
      </TextDescription>

      <TextDescription
        label="Link"
        hint="O usuário será redirecionado para este link ao escolher a opção de assistir evento"
      >
        <a :href="tag.link" target="_blank">{{ tag.link }}</a>
      </TextDescription>
    </v-card-text>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import TextDescription from '@/components/TextDescription.vue';
import LoadingCircle from '@/components/LoadingCircle.vue';

export default {
  name: 'EventInformation',
  components: {
    TextDescription,
    LoadingCircle,
  },
  props: {
    id: String,
  },
  data() {
    return {
      isLoading: false,
    };
  },
  methods: {
    ...mapActions({
      fetchTagById: 'tags/fetchTagById',
    }),
  },
  computed: {
    ...mapGetters({
      tags: 'tags/tags',
    }),
    tag() {
      return this.tags[this.id] || {};
    },
    isTagLoaded() {
      return Boolean(this.tags[this.id]);
    },
  },
  async created() {
    const { id } = this;

    this.isLoading = true;
    await this.fetchTagById(id);
    this.isLoading = false;
  },
};
</script>
