<template>
  <v-row justify="center">
    <v-col cols="6">
      <v-menu
        ref="menu"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        min-width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            :value="showDate"
            label="Data do evento"
            prepend-inner-icon="mdi-calendar"
            readonly
            outlined
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="date"
          max="2021-11-20"
          min="2021-11-17"
          :show-current="false"
          @change="saveDate"
          ref="picker"
        ></v-date-picker>
      </v-menu>
    </v-col>

    <v-col cols="6" class="text-right">
      <v-input
        label="Início"
      >
        <VueTimepicker
          v-model="start"
          class="ml-2"
          :minute-interval="5"
          @change="generateOutput"
        />
      </v-input>
      <v-input
        label="Fim"
        outlined
      >
        <VueTimepicker
          v-model="end"
          class="ml-5"
          :minute-interval="5"
          @change="generateOutput"
        />
      </v-input>
    </v-col>
  </v-row>
</template>

<script>
import VueTimepicker from 'vue2-timepicker';
import 'vue2-timepicker/dist/VueTimepicker.css';

import { format, parse } from 'date-fns';
import pt from 'date-fns/locale/pt';

export default {
  name: 'TimePicker',
  components: {
    VueTimepicker,
  },
  model: {
    prop: 'input',
    event: 'change',
  },
  props: ['input'],
  data() {
    return {
      date: '2020-11-17',
      start: '00:00',
      end: '00:00',
      final: {
        start: null,
        end: null,
      },
    };
  },
  methods: {
    saveDate(date) {
      this.$refs.menu.save(date);
      this.generateOutput();
    },
    generateOutput() {
      const { date, start, end } = this;
      if (!date || !start || !end) return {};
      if (start.length !== 5) return {};
      if (end.length !== 5) return {};

      const formatString = 'yyyy-MM-dd HH:mm x';
      const final = {
        start: parse(`${date} ${start} -03`, formatString, new Date()),
        end: parse(`${date} ${end} -03`, formatString, new Date()),
      };

      this.final = final;
      this.$emit('change', final);
      return final;
    },
    readInput(input) {
      if (!input || !input.start || !input.end) {
        return;
      }
      if (input.start === this.final.start && input.end === this.final.end) {
        return;
      }

      this.final.start = input.start;
      this.final.end = input.end;

      this.date = format(input.start, 'yyyy-MM-dd');
      this.start = format(input.start, 'HH:mm');
      this.end = format(input.end, 'HH:mm');
    },
  },
  computed: {
    showDate() {
      const { date } = this;
      if (!date) return '';

      const dateObj = parse(date, 'yyyy-MM-dd', new Date());
      return format(dateObj, 'EEEE (dd \'de\' MMM)', { locale: pt });
    },
  },
  watch: {
    input(newValue) {
      this.readInput(newValue);
    },
  },
  mounted() {
    this.readInput(this.input);
  },
};
</script>
