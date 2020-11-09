<template>
  <div>
    <v-card-title>
      <v-btn
        icon
        to="/menu"
        class="mr-3"
      >
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      Trilhas
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        elevation="0"
        to="/tags/create"
      >
        <v-icon left dark>
          mdi-plus
        </v-icon>
        Nova Trilha
      </v-btn>
    </v-card-title>

    <v-card-title>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Pesquisar"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>

    <v-data-table
      :headers="headers"
      :items="allTags"
      :items-per-page="5"
      :loading="isLoading"
      :search="search"
    >
      <template v-slot:item.description="{ item }">
        <router-link :to="`/tags/${item.id}`">
          {{ item.description }}
        </router-link>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'Events',
  data() {
    return {
      isLoading: false,
      search: '',
      headers: [
        {
          text: 'Nome',
          align: 'start',
          value: 'description',
        },
        {
          text: 'URL',
          value: 'link',
        },
      ],
    };
  },
  methods: {
    ...mapActions({
      fetchAllTags: 'tags/fetchAllTags',
    }),
    async loadTags() {
      this.isLoading = true;
      await this.fetchAllTags();
      this.isLoading = false;
    },
  },
  computed: {
    ...mapGetters({
      allTags: 'tags/allTags',
    }),
  },
  created() {
    if (this.allTags.length === 0) this.loadTags();
  },
};
</script>
