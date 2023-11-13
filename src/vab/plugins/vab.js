import Vue from 'vue'
import { loadingText, messageDuration } from '@/config'
import { Loading, Message, MessageBox, Notification } from 'element-ui'
import { dependencies } from '../../../package.json'

/**
 * @description 全局加载层
 * @param {number} index 自定义加载图标类名ID
 * @param {string} text 显示在加载图标下方的加载文案
 */
Vue.prototype.$baseLoading = (index = undefined, text = loadingText) => {
  return Loading.service({
    lock: true,
    text,
    spinner: index ? 'vab-loading-type' + index : index,
    background: 'hsla(0,0%,100%,.8)',
  })
}

/**
 * @description 全局多彩加载层
 * @param {number} index 自定义加载图标类名ID
 * @param {string} text 显示在加载图标下方的加载文案
 */
Vue.prototype.$baseColorfullLoading = (
  index = undefined,
  text = loadingText
) => {
  let loading
  if (!index) {
    loading = Loading.service({
      lock: true,
      text,
      spinner: 'dots-loader',
      background: 'hsla(0,0%,100%,.8)',
    })
  } else {
    const spinnerDict = {
      1: 'dots',
      2: 'gauge',
      3: 'inner-circles',
      4: 'plus',
    }
    loading = Loading.service({
      lock: true,
      text,
      spinner: spinnerDict[index] + '-loader',
      background: 'hsla(0,0%,100%,.8)',
    })
  }
  return loading
}

/**
 * @description 全局Message
 * @param {string|VNode} message 消息文字
 * @param {'success'|'warning'|'info'|'error'} type 主题
 * @param {string} customClass 自定义类名
 * @param {boolean} dangerouslyUseHTMLString 是否将message属性作为HTML片段处理
 */
Vue.prototype.$baseMessage = (
  message,
  type = 'info',
  customClass = undefined,
  dangerouslyUseHTMLString = false
) => {
  Message({
    message,
    type,
    customClass,
    duration: messageDuration,
    dangerouslyUseHTMLString,
    showClose: true,
  })
}

Vue.prototype.$Message = Message;

/**
 * @description 全局Alert
 * @param {string|VNode} content 消息正文内容
 * @param {string} title 标题
 * @param {function} callback 若不使用Promise,可以使用此参数指定MessageBox关闭后的回调
 */
Vue.prototype.$baseAlert = (
  content,
  title = '温馨提示',
  callback = undefined
) => {
  MessageBox.alert(content, title, {
    confirmButtonText: '确定',
    dangerouslyUseHTMLString: true,
    callback: () => {
      if (callback) {
        callback()
      }
    },
  }).then(() => {})
}

/**
 * @description 全局Confirm
 * @param {string|VNode} content 消息正文内容
 * @param {string} title 标题
 * @param {function} callback1 确认回调
 * @param {function} callback2 关闭或取消回调
 * @param {string} confirmButtonText 确定按钮的文本内容
 * @param {string} cancelButtonText 取消按钮的自定义类名
 */
Vue.prototype.$baseConfirm = (
  content,
  title = undefined,
  callback1 = undefined,
  callback2 = undefined,
  confirmButtonText = '确定',
  cancelButtonText = '取消'
) => {
  MessageBox.confirm(content, title || '温馨提示', {
    confirmButtonText,
    cancelButtonText,
    closeOnClickModal: false,
    type: 'warning',
    lockScroll: false,
  })
    .then(() => {
      if (callback1) {
        callback1()
      }
    })
    .catch(() => {
      if (callback2) {
        callback2()
      }
    })
}

/**
 * @description 全局Notification
 * @param {string} message 说明文字
 * @param {string|VNode} title 标题
 * @param {'success'|'warning'|'info'|'error'} type 主题样式,如果不在可选值内将被忽略
 * @param {'top-right'|'top-left'|'bottom-right'|'bottom-left'} position 自定义弹出位置
 * @param duration 显示时间,毫秒
 */
Vue.prototype.$baseNotify = (
  message,
  title,
  type = 'success',
  position = 'top-right',
  duration = messageDuration
) => {
  Notification({
    title,
    message,
    type,
    duration,
    position,
  })
}

/**
 * @description 表格高度
 * @param {*} formType
 */
Vue.prototype.$baseTableHeight = (formType) => {
  let height = window.innerHeight
  const paddingHeight = 135// 48+32+55
  const formHeight = 40

  if ('number' === typeof formType) {
    height = height - paddingHeight - formHeight * formType
  } else {
    height = height - paddingHeight
  }
  return height
}

/**
 * @description 全局事件总线
 */
Vue.prototype.$baseEventBus = new Vue()

