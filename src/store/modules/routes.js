/**
 * @description 路由拦截状态管理，目前两种模式：all模式与intelligence模式，其中partialRoutes是菜单暂未使用
 */
import Vue from 'vue'
import { asyncRoutes, constantRoutes, resetRouter } from '@/router'
import { getMenu } from '@/api/wt/user.js'
import { convertRouter, filterRoutes } from '@/utils/routes'
import { authentication, rolesControl } from '@/config'
import { isArray,isExternal } from '@/utils/validate'
import i18n from '../../i18n'


const state = () => ({
  routes: [],
  activeName: '',
})
const getters = {
  routes: (state) => state.routes,
  activeName: (state) => state.activeName,
}
const mutations = {
  /**
   * @description 多模式设置路由
   * @param {*} state
   * @param {*} routes
   */
  setRoutes(state, routes) {
    state.routes = routes
  },
  /**
   * @description 修改Meta
   * @param {*} state
   * @param options
   */
  changeMenuMeta(state, options) {
    function handleRoutes(routes) {
      return routes.map((route) => {
        if (route.name === options.name) Object.assign(route.meta, options.meta)
        if (route.children && route.children.length)
          route.children = handleRoutes(route.children)
        return route
      })
    }
    state.routes = handleRoutes(state.routes)
  },
  /**
   * @description 修改 activeName
   * @param {*} state
   * @param activeName 当前激活菜单
   */
  changeActiveName(state, activeName) {
    state.activeName = activeName
  },
}

import  {constantRouterComponents} from '@/vab/index.js'
const  generator = (routerMap, parent) => routerMap.map((item,index) => {
  const currentRouter = {
    path: item.paths,
    name: item.menuName,
    component: item.component||undefined,
    isShow:item.isShow,
    meta: {
      title: item.menuName,
      icon: item.menuIconElement2
    },
  }
  if(isExternal(item.paths)){
    currentRouter.meta.target='_blank'
  }


  item.redirect && (currentRouter.redirect = item.redirect)
  // 是否有子菜单，并递归处理
  if (item.children && item.children.length > 0) {
    currentRouter.children = generator(item.children, currentRouter)
  }
  return currentRouter
})

const actions = {
  /**
   * @description 多模式设置路由
   * @param {*} { commit }
   * @param mode
   * @returns
   */
  async setRoutes({ commit }, mode = 'none') {
    // 默认前端路由
    let routes = [...asyncRoutes]
    // 设置游客路由关闭路由拦截(不需要可以删除)
    const control = mode === 'visit' ? false : rolesControl
    // 设置后端路由(不需要可以删除)
    if (authentication === 'all') {
      let {
        data: { menus:list },
      } = await getMenu({})
      if (!isArray(list))
        Vue.prototype.$baseMessage(
          '路由格式返回有误！',
          'error',
          'vab-hey-message-error'
        )
       const  menuList=generator(list)
        const navMenu=[]
      console.log("=====i18n.t('首页')",i18n.t('首页'));
        menuList.map((item)=>{
          let obj
          if(item.path=='workbench'){
            obj={
              path: '/',
              name: i18n.t('首页'),
              component: "Layout",
              isShow:true,
              Level:1,
              childrenNameList:[],
              meta: {
                title: i18n.t('首页'),
                icon: item.meta.icon,
              },
              children:[item]
            }
            navMenu.push(obj)
          }else{
             obj={
              path: item.path,
              name: item.name,
              component: "Layout",
              isShow:true,
              Level:1,
              meta: {
                title: item.meta.title,
                icon: item.meta.icon,
              },
              children:item.children
            }
            navMenu.push(obj)
          }

        })


      if (navMenu[navMenu.length - 1].path !== '*')
        navMenu.push({ path: '*', redirect: '/404', meta: { hidden: true } })

        //console.log("====xx",navMenu);
      routes = convertRouter(navMenu)
    }

    // 根据权限和rolesControl过滤路由
    let accessRoutes = filterRoutes([...constantRoutes, ...routes], control)
    console.log("====accessRoutes",accessRoutes)




    // 设置菜单所需路由
    commit('setRoutes', JSON.parse(JSON.stringify(accessRoutes)))
    // 根据可访问路由重置Vue Router
    await resetRouter(accessRoutes)

  },


  /**
   * @description 修改Route Meta
   * @param {*} { commit }
   * @param options
   */
  changeMenuMeta({ commit }, options = {}) {
    commit('changeMenuMeta', options)
  },
  /**
   * @description 修改 activeName
   * @param {*} { commit }
   * @param activeName 当前激活菜单
   */
  changeActiveName({ commit }, activeName) {
    commit('changeActiveName', activeName)
  },
}
export default { state, getters, mutations, actions }
