<template>
  <v-input :label="label" :messages="messages" :hideDetails="hideDetails" class="mb-6">
    <span class="ml-3">
      <slot></slot>
    </span>
  </v-input>
</template>

<script>
export default {
  name: 'TextDescription',
  props: {
    label: String,
    hint: String,
  },
  computed: {
    messages() {
      const { hint } = this;
      if (!hint) return undefined;
      return [hint];
    },
    hideDetails() {
      return !this.messages;
    },
  },
};
</script>

<style>

</style>
