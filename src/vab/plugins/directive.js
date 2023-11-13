import Vue from 'vue'
import { hasPermission } from '@/utils/permission'
import store from '@/store'

/**
 * @description 自定义指令v-permissions
 */
Vue.directive('permissions', {
  inserted(el, binding) {
    const { value } = binding
    if (value) {
      if (!hasPermission(value)) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  },
})

Vue.directive('perms', {
  inserted(el, binding){
    const { value } = binding
    const permissions = store.getters['acl/permission']||[]
    const all_permission = '*'
    if (Array.isArray(value)) {
        if (value.length > 0) {
            const hasPermission = permissions.some((key) => {
                return all_permission == key || value.includes(key)
            })

            if (!hasPermission) {
                el.parentNode && el.parentNode.removeChild(el)
            }
        }
    } else {
        throw new Error('like v-perms="[\'auth.menu/edit\']"')
    }
}
})

/**
 * @description 自定义指令v-drag
 */
Vue.directive('drag', {
  bind(el, binding, vNode) {
    if (
      el.querySelector('.el-dialog__header') &&
      el.querySelector('.el-dialog')
    ) {
      const dialogHeaderEl = el.querySelector('.el-dialog__header')
      const dragDom = el.querySelector('.el-dialog')
      dialogHeaderEl.style.cssText += ';cursor:move;'
      dragDom.style.cssText += ';top:0;'

      const getStyle = (function () {
        if (window.document.currentStyle) {
          return (dom, attr) => dom.currentStyle[attr]
        } else {
          return (dom, attr) => getComputedStyle(dom, null)[attr]
        }
      })()

      dialogHeaderEl.onmousedown = (e) => {
        const disX = e.clientX - dialogHeaderEl.offsetLeft
        const disY = e.clientY - dialogHeaderEl.offsetTop

        const dragDomWidth = dragDom.offsetWidth
        const dragDomHeight = dragDom.offsetHeight

        const screenWidth = document.body.clientWidth
        const screenHeight = document.body.clientHeight

        const minDragDomLeft = dragDom.offsetLeft
        const maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth

        const minDragDomTop = dragDom.offsetTop
        const maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomHeight

        let styL = getStyle(dragDom, 'left')
        let styT = getStyle(dragDom, 'top')

        if (styL.includes('%')) {
          styL = +document.body.clientWidth * (+styL / 100)
          styT = +document.body.clientHeight * (+styT / 100)
        } else {
          styL = +styL.slice(0, -2)
          styT = +styT.slice(0, -2)
        }

        document.onmousemove = function (e) {
          let left = e.clientX - disX
          let top = e.clientY - disY

          if (-left > minDragDomLeft) {
            left = -minDragDomLeft
          } else if (left > maxDragDomLeft) {
            left = maxDragDomLeft
          }

          if (-top > minDragDomTop) {
            top = -minDragDomTop
          } else if (top > maxDragDomTop) {
            top = maxDragDomTop
          }

          dragDom.style.cssText += `;left:${left + styL}px;top:${top + styT}px;`

          vNode.child.$emit('drag-dialog')
        }

        document.onmouseup = function () {
          document.onmousemove = null
          document.onmouseup = null
        }
      }
    }
  },
})

