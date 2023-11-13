/**
 * @description 路由守卫，目前两种模式：all模式与intelligence模式
 */
import router from '@/router'
import store from '@/store'
import VabProgress from 'nprogress'
import 'nprogress/nprogress.css'
import getPageTitle from '@/utils/pageTitle'
import { toLoginRoute } from '@/utils/routes'
import {
  authentication,
  loginInterception,
  routesWhiteList,
  supportVisit,
} from '@/config'

VabProgress.configure({
  easing: 'ease',
  speed: 500,
  trickleSpeed: 200,
  showSpinner: false,
})
router.beforeEach(async (to, from, next) => {
  const { showProgressBar } = store.getters['settings/theme']
  if (showProgressBar) VabProgress.start()
  let hasToken = store.getters['user/token']

  if (!loginInterception) hasToken = true

  if (hasToken) {
    if (store.getters['routes/routes'].length) {
      // 禁止已登录用户返回登录页
      if (to.path === '/login') {
        next({ path: '/' })
        if (showProgressBar) VabProgress.done()
      } else next()
    } else {
      try {
        if (loginInterception) await store.dispatch('user/getUserInfo')
        // config/setting.config.js loginInterception为false(关闭登录拦截时)时，创建虚拟角色
        else await store.dispatch('user/setVirtualRoles')
        // 根据路由模式获取路由并根据权限过滤
        await store.dispatch('routes/setRoutes', authentication)
        next({ ...to, replace: true })
      } catch (err) {
        await store.dispatch('user/resetAll')
        next(toLoginRoute(to.path))
      }
    }
  } else {
    if (routesWhiteList.includes(to.path)) {
      // 设置游客路由(不需要可以删除)
      if (supportVisit && !store.getters['routes/routes'].length) {
        await store.dispatch('routes/setRoutes', 'visit')
        next({ ...to, replace: true })
      } else next()
    } else next(toLoginRoute(to.path))
  }
})
router.afterEach((to) => {
  document.title = getPageTitle(to.meta.title)
  if (VabProgress.status) VabProgress.done()
})
