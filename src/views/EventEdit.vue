<template>
  <v-form>
    <v-card-title>
      <v-btn icon to="/events" class="mr-3" color="error" exact>
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <span v-if="crudType === 'create'">Criar novo evento</span>
      <span v-if="crudType === 'edit'">Editar evento</span>
      <v-spacer></v-spacer>
      <v-btn
        color="success"
        @click="save()"
      >
        Salvar
      </v-btn>
    </v-card-title>

    <div class="event-form mx-3 pb-8">
      <v-card-subtitle>
        Informações Gerais
      </v-card-subtitle>

      <v-text-field
        v-model="event.title"
        label="Título"
        class="mb-2"
        hide-details
        outlined
        dense
      ></v-text-field>
      <v-textarea
        v-model="event.description"
        label="Descrição"
        class="mb-2"
        hide-details
        outlined
        dense
      ></v-textarea>

      <v-card-subtitle>
        Horários
      </v-card-subtitle>

      <TimePicker
        v-model="time"
      />

      <v-card-subtitle>
        Trilha e Link do evento
      </v-card-subtitle>

      <v-select
        v-model="event.tag"
        :items="allTags"
        label="Trilha"
        item-text="description"
        item-value="id"
        hide-details
        outlined
      ></v-select>

      <div v-if="event.tag" class="tag-info mt-3 ml-3 mb-4">
        <span>O nome da trilha aparecerá como: <b>{{ selectedTag.name }}</b></span>
        <span>
          Link:
          <a :href="selectedTag.link" target="_blank">{{ selectedTag.link }}</a>
        </span>
      </div>

      <v-card-subtitle class="mt-8">
        Palestrantes
      </v-card-subtitle>

      <SpeakersInput v-model="speakers" />

    </div>
  </v-form>
</template>

<script>
import TimePicker from '@/components/TimePicker.vue';
import SpeakersInput from '@/components/SpeakersInput.vue';
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'EventEdit',
  components: {
    TimePicker,
    SpeakersInput,
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
      event: {
        title: '',
        description: '',
        tag: null,
      },
      time: {
        start: null,
        end: null,
      },
      speakers: [],
    };
  },
  methods: {
    ...mapActions({
      saveEvent: 'events/saveEvent',
      fetchEventById: 'events/fetchEventById',
    }),
    async recoverEvent(id) {
      await this.fetchEventById(id);
      const event = this.events[id];

      this.event.title = event.title;
      this.event.description = event.description;
      this.event.tag = event.tag;

      this.time = {
        start: event.startTime.toDate && event.startTime.toDate(),
        end: event.endTime.toDate && event.endTime.toDate(),
      };

      this.speakers = event.speakers;
    },
    async save() {
      const {
        id, event, time, speakers,
      } = this;
      const finalEvent = {
        title: event.title,
        description: event.description,
        tag: event.tag,
        startTime: time.start,
        endTime: time.end,
        speakers,
      };

      const createdEvent = await this.saveEvent({ id, event: finalEvent });
      this.$router.replace(`/events/${id || createdEvent.id}`);
    },
  },
  computed: {
    ...mapGetters({
      events: 'events/events',
      tags: 'tags/tags',
      allTags: 'tags/allTags',
    }),
    selectedTag() {
      const id = this.event.tag;
      if (id) return this.tags[id];
      return {};
    },
  },
  created() {
    if (this.id) {
      this.crudType = 'edit';
      this.recoverEvent(this.id);
    } else {
      this.crudType = 'create';
    }
  },
};
</script>

<style lang="scss" scoped>
.event-form {
  max-height: calc(100vh - 160px);
  overflow-y: scroll;
}

.tag-info {
  span {
    display: block;
  }
}
</style>
