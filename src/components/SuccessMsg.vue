<template>
  <v-alert
    v-if="msg"
    outlined
    dense
    type="success"
  >
    {{ message }}
  </v-alert>
</template>

<script>
export default {
  name: 'LoginErrorMsg',
  props: {
    msg: String || Object,
  },
  computed: {
    message() {
      const { msg } = this;
      if (!msg) return '';

      const { code, message } = msg;
      if (code === 'auth/reset-password-email-sent') {
        return `
          Email enviado com sucesso.
          Acesse a sua caixa de entrada para resetar a sua senha.
        `;
      }

      return message || msg;
    },
  },
};
</script>
