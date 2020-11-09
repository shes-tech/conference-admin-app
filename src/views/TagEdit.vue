<template>
  <v-form :disabled="isLoading || isSaving">
    <v-card-title>
      <v-btn icon to="/tags" class="mr-3" color="error" exact>
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <span v-if="crudType === 'create'">Criar nova trilha</span>
      <span v-if="crudType === 'edit'">Editar trilha</span>
      <LoadingCircle v-if="isLoading" />
      <v-spacer></v-spacer>
      <v-btn
        color="success"
        @click="save()"
        :loading="isSaving"
      >
        Salvar
      </v-btn>
    </v-card-title>

    <div class="tag-form mx-3 pb-6">
      <v-card-subtitle>
        Informações do Painel de Administração
      </v-card-subtitle>

      <v-text-field
        v-model="tag.description"
        label="Descrição"
        class="mb-2"
        hint="Nome para indentificação interna. Ex: 'Inspire Arena - Dia 17'"
        outlined
        dense
      ></v-text-field>

      <v-card-subtitle class="mt-4">
        Informações Públicas da Trilha
      </v-card-subtitle>

      <v-text-field
        v-model="tag.name"
        label="Nome Público"
        class="mb-2"
        hint="Este nome irá aparecer na lista de eventos para o usuário final"
        outlined
        dense
      ></v-text-field>
      <v-text-field
        v-model="tag.link"
        label="Link para os evento da trilha"
        class="mb-2"
        hint="O usuário será redirecionado para este link ao
          escolher a opção de assistir um evento desta trilha"
        outlined
        dense
      ></v-text-field>
    </div>
  </v-form>
</template>

<script>
import LoadingCircle from '@/components/LoadingCircle.vue';

import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'TagEdit',
  components: {
    LoadingCircle,
  },
  props: {
    id: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      crudType: null,
      isLoading: false,
      isSaving: false,
      tag: {
        name: '',
        description: '',
        link: '',
      },
    };
  },
  methods: {
    ...mapActions({
      saveTag: 'tags/saveTag',
      fetchTagById: 'tags/fetchTagById',
    }),
    async recoverTag(id) {
      this.isLoading = true;
      await this.fetchTagById(id);
      this.isLoading = false;

      const tag = this.tags[id];
      this.tag.name = tag.name;
      this.tag.description = tag.description;
      this.tag.link = tag.link;
    },
    async save() {
      const { id, tag } = this;
      const finalTag = {
        name: tag.name,
        description: tag.description,
        link: tag.link,
      };

      this.isSaving = true;
      const createdTag = await this.saveTag({ id, tag: finalTag });
      this.isSaving = false;

      this.$router.replace(`/tags/${id || createdTag.id}`);
    },
  },
  computed: {
    ...mapGetters({
      tags: 'tags/tags',
    }),
    selectedTag() {
      const id = this.tag.tag;
      if (id) return this.tags[id];
      return {};
    },
  },
  created() {
    if (this.id) {
      this.crudType = 'edit';
      this.recoverTag(this.id);
    } else {
      this.crudType = 'create';
    }
  },
};
</script>

<style lang="scss" scoped>
.tag-form {
  max-height: calc(100vh - 160px);
  overflow-y: scroll;
}

.tag-info {
  span {
    display: block;
  }
}
</style>
