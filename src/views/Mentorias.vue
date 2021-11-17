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
      Mentorias
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        elevation="0"
        to="/mentorias/create"
      >
        <v-icon left dark>
          mdi-plus
        </v-icon>
        Nova Mentoria
      </v-btn>
    </v-card-title>

    <v-card-title>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Pesquisar"
        hide-details
        single-line
        outlined
        filled
        dense
      ></v-text-field>
    </v-card-title>

    <v-data-table
      :headers="headers"
      :items="mentorias"
      :loading="isLoading"
      :search="search"
    >
      <template v-slot:item.mentoraName="{ item }">
        <router-link :to="`/mentorias/${item.id}`">
          {{ item.mentoraName }}
        </router-link>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon
          small
          class="mr-2"
          @click="$router.push(`/mentorias/${item.id}/edit`)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          small
          @click="deleteMentoria(item)"
        >
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'Mentorias',
  data() {
    return {
      isLoading: false,
      search: '',
      headers: [
        {
          text: 'Mentora',
          align: 'start',
          value: 'mentoraName',
        },
        {
          text: 'Tema',
          value: 'title',
        },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
    };
  },
  methods: {
    ...mapActions({
      fetchAllMentorias: 'mentorias/fetchAllMentorias',
      sendDeleteMentoria: 'mentorias/deleteMentoria',
    }),
    async loadMentorias() {
      this.isLoading = true;
      await this.fetchAllMentorias();
      this.isLoading = false;
    },
    async deleteMentoria(event) {
      // eslint-disable-next-line no-alert
      const shouldDelete = window.confirm(`Deseja apagar definitivamente o evento "${event.title}"?`);
      if (!shouldDelete) return;

      const { id } = event;
      await this.sendDeleteMentoria({ id });
    },
  },
  computed: {
    ...mapGetters({
      allMentorias: 'mentorias/allMentorias',
    }),
    mentorias() {
      return this.allMentorias.map((mentoria) => ({
        ...mentoria,
        mentoraName: mentoria.mentora.name,
      }));
    },
  },
  created() {
    if (this.allMentorias.length === 0) this.loadMentorias();
  },
};
</script>
