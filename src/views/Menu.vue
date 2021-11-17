<template>
  <div class="pb-5">
    <v-card-title class="mb-4">
      Para onde deseja ir?
    </v-card-title>

    <div
      v-for="(link, index) in links"
      :key="index"
      class="pl-3 mb-6"
      outlined
    >
      <div v-if="link.condition()">
        <v-btn color="primary" text :to="link.path" class="px-3" x-large>
          {{ link.title }}
        </v-btn>
        <p class="pl-3">{{ link.description }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Menu',
  data() {
    return {
      links: [
        {
          title: 'Lista de Eventos',
          description: 'Visualizar e alterar lista de eventos.',
          path: '/events',
          condition: () => this.permissionEvents,
        },
        {
          title: 'Calendário de Eventos',
          description: 'Visualizar eventos no formato de calendário.',
          path: '/events-calendar',
          condition: () => this.permissionEvents,
        },
        {
          title: 'Trilhas',
          description: `
            Visualizar e alterar lista de trilhas
            e modificar links dos eventos.
          `,
          path: '/tags',
          condition: () => this.permissionEvents,
        },
        {
          title: 'Mentorias',
          description: `
            Visualizar e alterar lista de trilhas
            e modificar links dos eventos.
          `,
          path: '/mentorias',
          condition: () => this.permissionMentorias,
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      permissions: 'auth/permissions',
    }),
    permissionMentorias() {
      return this.permissions.includes('mentorias');
    },
    permissionEvents() {
      return this.permissions.includes('eventos');
    },
  },
};
</script>
