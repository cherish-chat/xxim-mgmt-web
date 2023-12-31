<template>
  <el-scrollbar
    class="vab-column-bar-container"
    :class="{
      'is-collapse': collapse,
      ['vab-column-bar-container-' + theme.columnStyle]: true,
    }"
  >
    <vab-logo />
    <el-tabs
      v-model="extra.first"
      tab-position="left"
      @tab-click="handleTabClick"
    >
      <template v-for="(route, index) in handleRoutes">
        <el-tab-pane :key="index + route.name" :name="route.name">
          <template slot="label">
            <div
              class="vab-column-grid"
              :class="{
                ['vab-column-grid-' + theme.columnStyle]: true,
              }"
              :title="route.meta.title"
            >
              <div>
                <vab-icon
                  v-if="route.meta.icon"
                  :icon="route.meta.icon"
                  :is-custom-svg="route.meta.isCustomSvg"
                />
                <span>
                  {{ route.meta.title }}
                </span>
              </div>
            </div>
          </template>
        </el-tab-pane>
      </template>
    </el-tabs>

    <el-menu
      :background-color="variables['column-second-menu-background']"
      :default-active="activeMenu"
      :default-openeds="defaultOpeneds"
      mode="vertical"
      :unique-opened="uniqueOpened"
    >
      <el-divider>
        {{ translateTitle(handleGroupTitle) }}
      </el-divider>
      <template v-for="route in handlePartialRoutes">
        <vab-menu
          v-if="route.meta && !route.meta.hidden"
          :key="route.path"
          :item="route"
        />
      </template>
    </el-menu>
  </el-scrollbar>
</template>

<script>
  import { translateTitle } from '@/utils/i18n'
  import variables from '@/vab/styles/variables/variables.scss'
  import { mapActions, mapGetters } from 'vuex'
  import { defaultOpeneds, openFirstMenu, uniqueOpened } from '@/config'
  import { handleActivePath, handleMatched } from '@/utils/routes'

  export default {
    name: 'VabColumnBar',
    data() {
      return {
        activeMenu: '',
        groupTitle: '',
        defaultOpeneds,
        uniqueOpened,
        variables,
      }
    },
    computed: {
      ...mapGetters({
        extra: 'settings/extra',
        theme: 'settings/theme',
        routes: 'routes/routes',
        collapse: 'settings/collapse',
        activeName: 'routes/activeName',
      }),
      handleRoutes() {
        return this.routes.filter(
          (route) => route.meta && route.meta.hidden !== true
        )
      },
      handleActiveMenu() {
        return this.routes.find((route) => route.name === this.extra.first)
      },
      handlePartialRoutes() {
        const activeMenu = this.handleActiveMenu
        return activeMenu ? activeMenu.children : []
      },
      handleGroupTitle() {
        const activeMenu = this.handleActiveMenu
        return activeMenu ? activeMenu.meta.title : ''
      },
    },
    watch: {
      $route: {
        handler(route) {
          this.activeMenu = handleActivePath(route)
          const firstMenu = route.matched[0].name
          if (this.extra.first !== firstMenu) {
            this.extra.first = firstMenu
            this.handleTabClick(true)
          }
        },
        immediate: true,
      },
      activeName: {
        handler(val) {
          const matched = handleMatched(this.routes, val)
          this.extra.first = matched[0].name
          this.activeMenu = matched[matched.length - 1].path
        },
      },
    },
    methods: {
      ...mapActions({
        openSideBar: 'settings/openSideBar',
        foldSideBar: 'settings/foldSideBar',
      }),
      translateTitle,
      handleTabClick(handler) {

        if (handler !== true && openFirstMenu) {
          const { redirect } = this.handleActiveMenu
           if(this.handleActiveMenu.path!='/link')
          this.$router.push(redirect ? redirect : this.handleActiveMenu)
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  @mixin active {
    &:hover {
      color: $base-color-blue;
      background-color: $base-column-second-menu-background-active !important;

      i,
      svg {
        color: $base-color-blue;
      }
    }

    &.is-active {
      color: $base-color-blue;
      background-color: $base-column-second-menu-background-active !important;
    }
  }

  .vab-column-bar-container {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    width: $base-left-menu-width;
    height: 100vh;
    overflow: hidden;
    background: $base-column-second-menu-background;
    box-shadow: $base-box-shadow;

    :deep() {
      * {
        transition: $base-transition;
      }
    }

    &-vertical,
    &-card,
    &-arrow {
      :deep() {
        .el-tabs + .el-menu {
          left: $base-left-menu-width-min;
          width: $base-left-menu-width - $base-left-menu-width-min;
          border: 0;
        }
      }
    }

    &-horizontal {
      :deep() {
        .logo-container-column {
          .logo {
            width: $base-left-menu-width-min * 1.3 !important;
          }

          .title {
            margin-left: $base-left-menu-width-min * 1.3 !important;
          }
        }

        .el-tabs + .el-menu {
          left: $base-left-menu-width-min * 1.3;
          width: $base-left-menu-width - $base-left-menu-width-min * 1.3;
          border: 0;
        }
      }
    }

    &-card {
      :deep() {
        .el-tabs {
          .el-tabs__item {
            padding: 5px !important;

            .vab-column-grid {
              width: $base-left-menu-width-min - 10 !important;
              height: $base-left-menu-width-min - 10 !important;
              border-radius: 5px;
            }

            &.is-active {
              background: transparent !important;

              .vab-column-grid {
                background: $base-color-blue;
              }
            }
          }
        }

        .el-tabs + .el-menu {
          left: $base-left-menu-width-min + 10;
          width: $base-left-menu-width - $base-left-menu-width-min - 20;
        }

        .el-submenu .el-submenu__title,
        .el-menu-item {
          min-width: 180px;
          border-radius: 5px;
          margin-bottom: 5px;
        }
      }
    }

    &-arrow {
      :deep() {
        .el-tabs {
          .el-tabs__item {
            &.is-active {
              background: transparent !important;

              .vab-column-grid {
                background: transparent !important;

                &:after {
                  position: absolute;
                  right: 0;
                  width: 0;
                  height: 0;
                  overflow: hidden;
                  content: '';
                  border-color: transparent #{$base-color-white} transparent transparent;
                  border-style: solid dashed dashed;
                  border-width: 8px;
                }
              }
            }
          }
        }

        .el-tabs + .el-menu {
          left: $base-left-menu-width-min + 10;
          width: $base-left-menu-width - $base-left-menu-width-min - 20;
        }

        .el-submenu .el-submenu__title,
        .el-menu-item {
          min-width: 180px;
          border-radius: 5px;
        }
      }
    }

    .vab-column-grid {
      display: flex;
      align-items: center;
      width: $base-left-menu-width-min;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;
      white-space: nowrap;

      &-vertical,
      &-card,
      &-arrow {
        justify-content: center;
        height: $base-left-menu-width-min;

        > div {
          svg {
            position: relative;
            top: 8px;
            display: block;
            width: $base-font-size-default + 4;
            height: $base-font-size-default + 4;
          }

          [class*='ri-'] {
            display: block;
            height: 20px;
          }
        }
      }

      &-horizontal {
        justify-content: left;
        width: $base-left-menu-width-min * 1.3;
        height: #{$base-left-menu-width-min/ 1.3};
        padding-left: #{$base-padding/ 2};
      }
    }

    :deep() {
      .el-scrollbar__wrap {
        overflow-x: hidden;
      }

      .el-tabs {
        position: fixed;

        .el-tabs__header.is-left {
          margin-right: 0 !important;

          .el-tabs__nav-wrap.is-left {
            margin-right: 0 !important;
            background: $base-column-first-menu-background;

            .el-tabs__nav-scroll {
              height: 100%;
              overflow-y: auto;

              &::-webkit-scrollbar {
                width: 0px;
                height: 0px;
              }
            }
          }
        }

        .el-tabs__nav {
          height: calc(100vh - #{$base-logo-height});
          background: $base-column-first-menu-background;
        }

        .el-tabs__item {
          height: auto;
          padding: 0;
          color: $base-color-white;

          &.is-active {
            background: $base-color-blue;
          }
        }
      }

      .el-tabs__active-bar.is-left,
      .el-tabs--left .el-tabs__nav-wrap.is-left::after {
        display: none;
      }

      .el-menu {
        border: 0;

        .el-divider {
          margin: 0 0 $base-margin 0;
          background-color: #f6f6f6;

          &__text {
            color: $base-color-black;
          }
        }

        .el-menu-item,
        .el-submenu__title {
          height: $base-menu-item-height;
          overflow: hidden;
          line-height: $base-menu-item-height;
          text-overflow: ellipsis;
          white-space: nowrap;
          vertical-align: middle;


          @include active;
        }

      }
    }

    &.is-collapse {
      :deep() {
        width: 0;
      }
    }
  }
</style>
