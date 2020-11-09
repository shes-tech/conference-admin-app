<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://static1.squarespace.com/static/583ca58137c5810ef26a2e95/t/5f5070f146e3c302a0c2a1f9/1604689057447/?format=320w"
          width="100"
        />
        <span class="hidden-sm-and-down">Painel de Administração</span>
      </div>

      <v-spacer></v-spacer>

      <v-btn
        v-if="isUserAuthenticated"
        text
        @click="logout()"
      >
        <span class="mr-2">Sair</span>
        <v-icon>mdi-exit-to-app</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'App',
  methods: {
    ...mapActions({
      sendLogout: 'auth/logout',
    }),
    async logout() {
      await this.sendLogout();
      window.location.href = '/';
    },
  },
  computed: {
    ...mapGetters({
      isUserAuthenticated: 'auth/isUserAuthenticated',
    }),
  },
};
</script>
