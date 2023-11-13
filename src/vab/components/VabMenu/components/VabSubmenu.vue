<template>
  <div v-if="itemOrMenu.meta && itemOrMenu.meta.levelHidden">
    <template v-for="route in itemOrMenu.children">
      <vab-menu  :level="level+1" :key="route.path" :item="route" />
    </template>
  </div>
  <el-submenu
    v-else
    ref="subMenu"
    :index="itemOrMenu.path"
    :popper-append-to-body="false"
    :class="'menu-level-'+level"
  >
    <template slot="title">
      <vab-icon
        v-if="itemOrMenu.meta && itemOrMenu.meta.icon"
        :icon="itemOrMenu.meta.icon"
        :is-custom-svg="itemOrMenu.meta.isCustomSvg"
        :title="itemOrMenu.meta.title"
      />
      <span :title="itemOrMenu.meta.title">
        {{ itemOrMenu.meta.title }}
      </span>
    </template>
    <slot />
  </el-submenu>
</template>

<script>
  import { translateTitle } from '@/utils/i18n'

  export default {
    name: 'VabSubmenu',
    props: {
      itemOrMenu: {
        type: Object,
        default() {
          return null
        },
      },
      level:{
        type:Number,
        default() {
          return 1
        },
      }
    },
    methods: {
      translateTitle,
    },
    data(){
       return {

       }
    },
    created(){

    }
  }
</script>
