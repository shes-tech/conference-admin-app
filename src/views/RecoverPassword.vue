<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <v-col cols="6" xs=12 md="4" lg="3">
        <v-form v-model="isFormValid" @submit.prevent="recoverPassword()">
          <v-img
            alt="Vuetify Logo"
            class="shrink mb-7"
            contain
            src="@/assets/logo.png"
          />

          <v-card-title>
            <v-btn icon to="/login" class="mr-3" exact>
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <span class="headline">Recuperar Senha</span>
          </v-card-title>

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
          <v-btn type="submit" block color="primary" :loading="isValidatingLogin">
            Recuperar Senha
          </v-btn>

          <LoginErrorMsg class="mt-6" :error="errorMsg" />
          <SuccessMsg class="mt-6" :msg="successMsg" />
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import LoginErrorMsg from '@/components/LoginErrorMsg.vue';
import SuccessMsg from '@/components/SuccessMsg.vue';

import { mapActions } from 'vuex';

export default {
  name: 'RecoverPassword',
  components: {
    LoginErrorMsg,
    SuccessMsg,
  },
  data() {
    return {
      isValidatingLogin: false,
      isFormValid: true,
      errorMsg: null,
      successMsg: null,
      email: '',
    };
  },
  methods: {
    ...mapActions({
      sendRecoverPassword: 'auth/recoverPassword',
    }),
    clearError() {
      this.errorMsg = null;
    },
    async recoverPassword() {
      this.isValidatingLogin = true;
      this.clearError();

      try {
        const { email } = this;
        await this.sendRecoverPassword({ email });
        this.successMsg = {
          code: 'auth/reset-password-email-sent',
        };
      } catch (err) {
        this.errorMsg = err;
      } finally {
        this.isValidatingLogin = false;
      }
    },
  },
};
</script>
