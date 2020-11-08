<template>
  <div>
    <v-form v-model="isFormValid" @submit.prevent="login()">
      <v-text-field
        v-model="email"
        label="Email"
        required
      ></v-text-field>
      <v-text-field
        v-model="password"
        label="Senha"
        type="password"
        required
      ></v-text-field>
      <v-btn type="submit">LOGIN</v-btn>
    </v-form>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'Login',
  data() {
    return {
      isFormValid: true,
      email: '',
      password: '',
    };
  },
  methods: {
    ...mapActions({
      sendLogin: 'auth/login',
    }),
    login() {
      const { email, password } = this;
      this.sendLogin({ email, password });
    },
  },
};
</script>
