import Vue from 'vue'
import App from './App'
import i18n from './i18n'
import store from './store'
import router from './router'
import '@/vab'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

/**
 * @description 正式环境默认使用mock，正式项目记得注释后再打包
 */
import { baseURL, pwa } from './config'
import { isExternal } from '@/utils/validate'
// if (pwa) require('./registerServiceWorker')


// if (process.env.NODE_ENV === 'production' && !isExternal(baseURL)) {
//   const { mockXHR } = require('@/utils/static')
//   mockXHR()
// }



Vue.config.productionTip = false
new Vue({
  el: '#app',
  i18n,
  store,
  router,
  render: (h) => h(App),
})
