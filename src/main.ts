import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import { Message, Modal } from 'view-design'

import 'view-design/dist/styles/iview.css'
import '@/assets/css/reset.styl'

Vue.config.productionTip = false

Vue.prototype.$Message = Message

Vue.prototype.$Modal = Modal

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
