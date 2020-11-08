<template>
  <v-card class="ma-4">
    <router-view />
  </v-card>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'BasePage',
  methods: {
    ...mapActions({
      fetchAllTags: 'tags/fetchAllTags',
    }),
  },
  created() {
    this.fetchAllTags();
  },
};
</script>
