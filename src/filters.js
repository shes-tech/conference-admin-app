import Vue from 'vue';

import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';

Vue.filter('time', (date) => format(date, 'HH:mm', { locale: pt }));
Vue.filter('date', (date) => format(date, 'EEEE (dd \'de\' MMM)', { locale: pt }));

Vue.filter('timeFirestore', (date) => {
  const dateObject = date && date.toDate && date.toDate();
  if (!dateObject) return '';
  return format(dateObject, 'HH:mm', { locale: pt });
});

Vue.filter('dateFirestore', (date) => {
  const dateObject = date && date.toDate && date.toDate();
  if (!dateObject) return '';
  return format(dateObject, 'EEEE (dd \'de\' MMM)', { locale: pt });
});

Vue.filter('shortDateFirestore', (date) => {
  const dateObject = date && date.toDate && date.toDate();
  if (!dateObject) return '';
  return format(dateObject, 'EE (dd)', { locale: pt });
});
