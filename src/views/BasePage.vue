<template>
  <v-card class="base-card">
    <div class="inner-base ma-4">
      <router-view />
    </div>
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

<style lang="scss" scoped>
.base-card {
  max-width: 860px;
  margin-left: auto;
  margin-right: auto;
}
</style>
