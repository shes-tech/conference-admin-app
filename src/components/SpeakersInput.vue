<template>
  <div>
    <v-card
      v-for="(speaker, index) in speakers"
      :key="index"
      color="grey lighten-3"
      elevation="0"
      outlined
      class="px-5 pt-1 pb-4 mb-5"
    >
      <v-row>
        <v-col cols="6" class="text-left ma-0 pa-0">
          <v-card-subtitle>
            Sobre a palestrante
          </v-card-subtitle>
        </v-col>
        <v-col cols="6" class="text-right ma-0 pa-0">
          <v-btn color="grey" class="mt-1 mb-1 text-right" text @click="remove(index)">
            <v-icon left>mdi-close</v-icon>
            Remover
          </v-btn>
        </v-col>
      </v-row>

      <v-text-field
        v-model="speakers[index].name"
        label="Nome"
        hide-details
        outlined
        dense
        class="mb-2"
        @change="change()"
      ></v-text-field>
      <v-textarea
        v-model="speakers[index].minibio"
        label="Minibio"
        hide-details
        rows="2"
        outlined
        dense
        @change="change()"
      ></v-textarea>

      <v-row>
        <v-col cols="6">
          <v-card-subtitle>
            Foto
          </v-card-subtitle>
          <UploadAndResizeImage
            v-model="speakers[index].picture"
            @change="change()"
          />
        </v-col>

        <v-col cols="6">
          <v-card-subtitle>
            Redes Sociais
          </v-card-subtitle>
          <v-text-field v-model="speaker.social.site" label="Site" class="mb-2"
            hide-details outlined dense @change="change()" />
          <v-text-field v-model="speaker.social.linkedin" label="LinkedIn" class="mb-2"
            hide-details outlined dense @change="change()" />
          <v-text-field v-model="speaker.social.instagram" label="Instagram" class="mb-2"
            hide-details outlined dense @change="change()" />
          <v-text-field v-model="speaker.social.twitter" label="Twitter" class="mb-2"
            hide-details outlined dense @change="change()" />
          <v-text-field v-model="speaker.social.facebook" label="Facebook"
            hide-details outlined dense @change="change()" />
        </v-col>
      </v-row>
    </v-card>

    <v-btn block @click="add()" depressed>
      <v-icon left>mdi-plus</v-icon>
      Adicionar Palestrante
    </v-btn>
  </div>
</template>

<script>
import UploadAndResizeImage from '@/components/UploadAndResizeImage.vue';

export default {
  name: 'SpeakersInput',
  components: {
    UploadAndResizeImage,
  },
  model: {
    prop: 'input',
    event: 'change',
  },
  props: {
    input: Array,
  },
  data() {
    return {
      speakers: this.getInitialSpeakers(),
    };
  },
  methods: {
    getInitialSpeakers() {
      const { input } = this;
      if (input && input.length !== 0) return this.getInputSpeaker();
      return [this.getDefaultSpeaker()];
    },
    getDefaultSpeaker() {
      return {
        name: '',
        minibio: '',
        picture: null,
        social: {
        },
      };
    },
    getInputSpeaker() {
      const { input } = this;
      if (!input || input.length === 0) return [];

      return input.map((speaker) => ({
        social: {},
        picture: null,
        ...speaker,
      }));
    },
    add() {
      const defaultSpeaker = this.getDefaultSpeaker();
      this.speakers.push(defaultSpeaker);
      this.change();
    },
    remove(index) {
      this.speakers.splice(index, 1);
      this.change();
    },
    change() {
      this.$emit('change', this.speakers);
    },
  },
  watch: {
    input(newValue) {
      this.speakers = [...newValue];
    },
  },
};
</script>
