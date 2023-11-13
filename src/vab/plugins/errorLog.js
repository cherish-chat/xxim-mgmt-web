import Vue from 'vue'
import store from '@/store'
import { errorLog } from '@/config'
import { isArray } from '@/utils/validate'

export const needErrorLog = () => {
  const errorLogArray = isArray(errorLog) ? [...errorLog] : [...[errorLog]]
  return errorLogArray.includes(process.env.NODE_ENV)
}

export const addErrorLog = (err) => {
  // eslint-disable-next-line no-console
  if (!err.isRequest) console.error('vue-admin-beautiful错误拦截:', err)
  const url = window.location.href
  Vue.nextTick(() => {
    store.dispatch('errorLog/addErrorLog', { err, url }).then(() => {})
  })
}

if (needErrorLog()) {
  Vue.config.errorHandler = addErrorLog
}
