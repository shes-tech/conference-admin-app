<template>
  <v-card class="pa-2" elevation="0" outlined color="grey lighten-3">
    <v-row>
      <v-col cols="9">
        <TextDescription label="Nome">
          {{ speaker.name }}
        </TextDescription>
        <TextDescription label="Minibio">
          {{ bio }}
        </TextDescription>

        <v-card-subtitle v-if="hasSocial" class="pt-1 pl-0 pb-3">
          Redes Sociais
        </v-card-subtitle>
        <TextDescription v-if="social.site" label="Site">
          {{ social.site }}
        </TextDescription>
        <TextDescription v-if="social.linkedin" label="LinkedIn">
          {{ social.linkedin }}
        </TextDescription>
        <TextDescription v-if="social.instagram" label="Instagram">
          {{ social.instagram }}
        </TextDescription>
        <TextDescription v-if="social.twitter" label="Twitter">
          {{ social.twitter }}
        </TextDescription>
        <TextDescription v-if="social.facebook" label="Facebook">
          {{ social.facebook }}
        </TextDescription>
      </v-col>

      <v-col cols="3">
        <v-img
          v-if="speaker.picture"
          :lazy-src="speaker.picture"
          max-height="160"
          max-width="160"
          :src="speaker.picture"
          aspect-ratio="1"
          class="speaker-img"
        ></v-img>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import TextDescription from '@/components/TextDescription.vue';

export default {
  name: 'SpeakerPreviewCard',
  components: {
    TextDescription,
  },
  props: {
    speaker: Object,
  },
  computed: {
    bio() {
      if (!this.speaker || !this.speaker.minibio) return '';

      let escapedText = this.speaker.minibio;
      escapedText = escapedText.replace(/(?:\r\n|\r|\n)/g, '<br>');
      return escapedText;
    },
    social() {
      if (!this.speaker || !this.speaker.social) return {};
      return this.speaker.social;
    },
    hasSocial() {
      const { social } = this;
      let hasSocial = Boolean(social.site);
      hasSocial += Boolean(social.linkedin);
      hasSocial += Boolean(social.instagram);
      hasSocial += Boolean(social.twitter);
      hasSocial += Boolean(social.facebook);
      return hasSocial;
    },
  },
};
</script>

<style lang="scss" scoped>
.speaker-img {
  border-radius: 100px;
}
</style>
