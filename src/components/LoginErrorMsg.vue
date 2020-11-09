<template>
  <v-alert
    v-if="error"
    outlined
    dense
    type="error"
  >
    {{ message }}
  </v-alert>
</template>

<script>
export default {
  name: 'LoginErrorMsg',
  props: {
    error: Error || String || Object,
  },
  computed: {
    message() {
      const { error } = this;
      if (!error) return '';

      const { code, message } = error;
      if (code === 'auth/wrong-password') return 'Senha inválida';
      if (code === 'auth/user-not-found') return 'O usuário informado não existe';
      if (code === 'auth/invalid-email') return 'O endereço de email não é válido';
      if (code === 'auth/too-many-requests') {
        return `
          O acesso a essa conta foi temporariamente desativado devido a múltiplas
          tentativas de acesso inválidas. Por favor, aguarde um pouco e tente novamente.
        `;
      }

      return message || error;
    },
  },
};
</script>
