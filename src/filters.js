import Vue from 'vue';

import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';

Vue.filter('time', (date) => format(date, 'HH:mm', { locale: pt }));
Vue.filter('date', (date) => format(date, 'EEEE (dd \'de\' MMM)', { locale: pt }));
