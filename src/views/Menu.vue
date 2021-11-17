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
      <v-btn color="primary" text :to="link.path" class="px-3" x-large>
        {{ link.title }}
      </v-btn>
      <p class="pl-3">{{ link.description }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Menu',
  data() {
    return {
      links: [
        {
          title: 'Lista de Eventos',
          description: 'Visualizar e alterar lista de eventos.',
          path: '/events',
        },
        {
          title: 'Calendário de Eventos',
          description: 'Visualizar eventos no formato de calendário.',
          path: '/events-calendar',
        },
        {
          title: 'Trilhas',
          description: `
            Visualizar e alterar lista de trilhas
            e modificar links dos eventos.
          `,
          path: '/tags',
        },
        {
          title: 'Mentorias',
          description: `
            Visualizar e alterar lista de trilhas
            e modificar links dos eventos.
          `,
          path: '/mentorias',
        },
      ],
    };
  },
};
</script>
