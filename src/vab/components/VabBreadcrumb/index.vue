<template>
  <el-breadcrumb class="vab-breadcrumb" separator=">">
    <template v-for="(item, index) in breadcrumbList">
      <el-breadcrumb-item :key="index" :to="{ path: item.redirect }">
        <vab-icon v-if="item.meta && item.meta.icon" :icon="item.meta.icon" />
        {{ item.meta.title }}
      </el-breadcrumb-item>
    </template>
  </el-breadcrumb>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { translateTitle } from '@/utils/i18n'
  import { handleMatched } from '@/utils/routes'

  export default {
    name: 'VabBreadcrumb',
    computed: {
      ...mapGetters({
        routes: 'routes/routes',
      }),
      breadcrumbList() {
        return handleMatched(this.routes, this.$route.name).filter(
          (item) => item.meta.breadcrumbHidden !== true
        )
      },
    },
    methods: {
      translateTitle,
    },
  }
</script>

<style lang="scss" scoped>
  .vab-breadcrumb {
    height: $base-nav-height;
    font-size: $base-font-size-default;
    line-height: $base-nav-height;

    :deep() {
      .el-breadcrumb__item {
        .el-breadcrumb__inner {
          font-weight: normal;
          color: #515a6e;
        }

        .is-link {
          font-weight: normal;
          color: #515a6e;
        }

        &:last-child {
          .el-breadcrumb__inner {
            a {
              color: #999;
            }
          }
        }
      }
    }
  }
</style>
