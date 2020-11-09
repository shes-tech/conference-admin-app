<template>
  <div>
    <v-card
      v-for="(speaker, index) in speakers"
      :key="index"
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
      <v-text-field
        v-model="speakers[index].minibio"
        label="Minibio"
        hide-details
        outlined
        dense
        @change="change()"
      ></v-text-field>

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
    </v-card>

    <v-btn block @click="add()" depressed>
      <v-icon left>mdi-plus</v-icon>
      Adicionar Palestrante
    </v-btn>
  </div>
</template>

<script>
export default {
  name: 'SpeakersInput',
  model: {
    prop: 'input',
    event: 'change',
  },
  data() {
    return {
      speakers: [this.getDefaultSpeaker()],
    };
  },
  methods: {
    getDefaultSpeaker() {
      return {
        name: '',
        minibio: '',
        social: {
        },
      };
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
};
</script>
