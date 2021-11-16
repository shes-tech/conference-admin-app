<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <a href="https://shestech.org/">
          <v-img
            alt="Vuetify Logo"
            class="shrink mr-2"
            contain
            src="@/assets/logo.png"
            width="100"
          />
        </a>
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

    <v-main style="background-color: #f1f1f1;">
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
      window.location.href = 'https://shestech.netlify.app/';
    },
  },
  computed: {
    ...mapGetters({
      isUserAuthenticated: 'auth/isUserAuthenticated',
    }),
  },
};
</script>
