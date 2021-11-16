<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <v-col cols="6" xs=12 md="4" lg="3">
        <v-form v-model="isFormValid" @submit.prevent="login()">
          <v-img
            alt="Vuetify Logo"
            class="shrink mb-7"
            contain
            src="@/assets/logo.png"
            transition="scale-transition"
          />
          <v-text-field
            v-model="email"
            label="Email"
            class="mb-3"
            hide-details
            outlined
            dense
            required
            @change="clearError()"
          ></v-text-field>
          <v-text-field
            v-model="password"
            label="Senha"
            type="password"
            class="mb-6"
            hide-details
            outlined
            dense
            required
            @change="clearError()"
          ></v-text-field>
          <v-btn type="submit" block color="primary" :loading="isValidatingLogin">
            Login
          </v-btn>

          <LoginErrorMsg class="mt-6" :error="errorMsg" />
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import LoginErrorMsg from '@/components/LoginErrorMsg.vue';

import { mapActions } from 'vuex';

export default {
  name: 'Login',
  components: {
    LoginErrorMsg,
  },
  data() {
    return {
      isValidatingLogin: false,
      isFormValid: true,
      errorMsg: null,
      email: '',
      password: '',
    };
  },
  methods: {
    ...mapActions({
      sendLogin: 'auth/login',
    }),
    clearError() {
      this.errorMsg = null;
    },
    async login() {
      this.isValidatingLogin = true;
      this.clearError();

      try {
        const { email, password } = this;
        await this.sendLogin({ email, password });
        this.$router.replace('/menu');
      } catch (err) {
        this.errorMsg = err;
      } finally {
        this.isValidatingLogin = false;
      }
    },
  },
};
</script>
