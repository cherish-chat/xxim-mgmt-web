import Vue from 'vue'

// 加载雪碧图
import '@/icon'
// 加载全局样式样式
import './styles/vab.scss'

// 加载VabIcon
//import VabIcon from 'vab-icons'
 //import 'vab-icons/lib/vab-icons.css'
import VabIcon from  '../../vab-icons/lib/vab-icons.umd.min.js'
import '../../vab-icons/lib/vab-icons.css'
Vue.component('VabIcon', VabIcon)

// 加载主题
const Themes = require.context('./styles/themes', false, /\.scss$/)
Themes.keys().map(Themes)


// 加载插件
const Plugins = require.context('./plugins', true, /\.js$/)
Plugins.keys().map(Plugins)

//注册粒子效果
import VueParticles from 'vue-particles'
Vue.use(VueParticles)

// 加载组件
const Components = require.context('.', true, /\.vue$/)
Components.keys()
  .map(Components)
  .forEach((item) => {
    if (item.default.name && item.default.name !== 'Layouts')
      Vue.component(item.default.name, item.default)
  })


const views = require.context('../views/xl', true, /\.vue$/)
const  constantRouterComponents=[]
views.keys().map((name)=>{
  name=name.substring(0, name.lastIndexOf("."))
  name=name.substring(2, name.length)
  constantRouterComponents.push(name)
})
export {
  constantRouterComponents
}

