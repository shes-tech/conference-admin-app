<template>
  <v-form :disabled="isLoading || isSaving">
    <v-card-title>
      <v-btn icon :to="pathBack" class="mr-3" color="error" exact>
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <span v-if="crudType === 'create'">Criar nova mentoria</span>
      <span v-if="crudType === 'edit'">Editar mentoria</span>
      <LoadingCircle v-if="isLoading" />
      <v-spacer></v-spacer>
      <v-btn
        color="success"
        @click="save()"
        :loading="isSaving"
        :disabled="!isFormValid"
      >
        Salvar
      </v-btn>
    </v-card-title>

    <v-alert v-if="errorMsg" type="error" class="mt-3" dense>
      Erro: {{ errorMsg }}
    </v-alert>

    <div v-if="!isLoading" class="mentoria-form mx-3 pb-3">
      <v-card-subtitle> Informações Gerais </v-card-subtitle>

      <v-text-field
        v-model="mentoria.title"
        label="Título"
        class="mb-2"
        hide-details
        outlined
        dense
      ></v-text-field>
      <v-text-field
        v-model="mentoria.link"
        label="Link do Calendly"
        class="mb-2"
        hide-details
        outlined
        dense
      ></v-text-field>
      <v-switch
        v-model="mentoria.isAvailable"
        :label="`Horários Disponíveis: ${mentoria.isAvailable ? 'SIM' : 'NÃO'}`"
      ></v-switch>

      <div class="mentora-section">
        <v-card-subtitle class="mt-8">Mentora</v-card-subtitle>

        <v-text-field
          v-model="mentoria.mentora.name"
          label="Nome"
          class="mb-2"
          hide-details
          outlined
          dense
        ></v-text-field>
        <v-text-field
          v-model="mentoria.mentora.cargo"
          label="Cargo"
          class="mb-2"
          hide-details
          outlined
          dense
        ></v-text-field>
        <v-text-field
          v-model="mentoria.mentora.empresa"
          label="Empresa"
          class="mb-2"
          hide-details
          outlined
          dense
        ></v-text-field>
        <v-textarea
          v-model="mentoria.mentora.minibio"
          label="Minibio"
          class="mb-2"
          hide-details
          outlined
          dense
        ></v-textarea>

        <v-row>
          <v-col cols="6">
            <v-card-subtitle>
              Foto
            </v-card-subtitle>
            <UploadAndResizeImage
              v-model="mentoria.mentora.picture"
              bucket="mentoras-2021"
            />
          </v-col>

          <v-col cols="6">
            <v-card-subtitle>
              Redes Sociais
            </v-card-subtitle>
            <v-text-field v-model="mentoria.mentora.social.site" label="Site" class="mb-2"
              hide-details outlined dense />
            <v-text-field v-model="mentoria.mentora.social.linkedin" label="LinkedIn" class="mb-2"
              hide-details outlined dense />
            <v-text-field v-model="mentoria.mentora.social.instagram" label="Instagram" class="mb-2"
              hide-details outlined dense />
            <v-text-field v-model="mentoria.mentora.social.twitter" label="Twitter" class="mb-2"
              hide-details outlined dense />
            <v-text-field v-model="mentoria.mentora.social.facebook" label="Facebook"
              hide-details outlined dense />
          </v-col>
        </v-row>
      </div>
    </div>
  </v-form>
</template>

<script>
import UploadAndResizeImage from '@/components/UploadAndResizeImage.vue';
import LoadingCircle from '@/components/LoadingCircle.vue';

import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'MentoriaEdit',
  components: {
    LoadingCircle,
    UploadAndResizeImage,
  },
  props: {
    id: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      crudType: null,
      listPage: 'list',
      isLoading: false,
      isSaving: false,
      errorMsg: null,
      mentoria: {
        mentora: {
          picture: null,
          social: {},
        },
      },
      time: {
        start: null,
        end: null,
      },
      speakers: [],
    };
  },
  methods: {
    ...mapActions({
      saveMentoria: 'mentorias/saveMentoria',
      fetchMentoriaById: 'mentorias/fetchMentoriaById',
    }),
    async recoverMentoria(id) {
      this.isLoading = true;
      if (!this.mentorias[id]) await this.fetchMentoriaById(id);

      const mentoria = this.mentorias[id] || {};
      const mentora = mentoria.mentora || {};
      const social = mentora.social || {};
      this.mentoria = {
        mentora: {
          social: { ...social },
          ...mentora,
        },
        ...mentoria,
      };

      this.isLoading = false;
    },
    async save() {
      const { id, mentoria } = this;
      const finalMentoria = { ...mentoria };

      try {
        this.isSaving = true;
        this.errorMsg = null;
        const createdMentoria = await this.saveMentoria({ id, mentoria: finalMentoria });

        this.$router.replace(
          `/mentorias/${id || createdMentoria.id}`,
        );
      } catch (err) {
        this.errorMsg = err;
      } finally {
        this.isSaving = false;
      }
    },
  },
  computed: {
    ...mapGetters({
      mentorias: 'mentorias/mentorias',
    }),
    pathBack() {
      const { id } = this;
      if (id) return `/mentorias/${id}`;
      return '/mentorias';
    },
    isFormValid() {
      const { mentoria } = this;
      const isValid = mentoria.title && mentoria.mentora.name;
      return Boolean(isValid);
    },
  },
  created() {
    if (this.id) {
      this.crudType = 'edit';
      this.recoverMentoria(this.id);
    } else {
      this.crudType = 'create';
    }

    const { lastView, lastDay } = this.$route.query;
    if (lastView === 'calendar') this.listPage = 'calendar';
    if (lastDay === 'calendar') this.calendarLastDay = lastDay;
  },
};
</script>

<style lang="scss" scoped>
.mentoria-form {
  max-height: calc(100vh - 160px);
  overflow-y: scroll;
}

.tag-info {
  span {
    display: block;
  }
}

.mentora-section {
  background-color: #f0f0f0;
  border-radius: 4px;
  padding: 0em 1em 0.3em 1em;
  margin-right: 0.6em;
}
</style>
