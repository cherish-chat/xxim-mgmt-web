<template>
  <div class="detail-container">
    <el-page-header
      :content="'【' + route.query.title + '】详情页面'"
      @back="goBack"
    />
    <el-alert
      :closable="false"
      show-icon
      title="详情页菜单高亮，并缓存详情页，返回上一页再次打开可看到效果，dynamicNewTab可配置详情页只打开一个tab页还是可以根据参数不同无限打开多个，当前展示的是可以打开多个"
      type="success"
    />
    <el-form :inline="true" :model="form">
      <el-form-item label="输入框缓存">
        <el-input v-model="form.text" />
      </el-form-item>
    </el-form>
    <el-button
      icon="el-icon-refresh"
      type="primary"
      @click="handleRefreshMainPage"
    >
      刷新综合表格页面
    </el-button>
    <el-descriptions border :column="3" title="详情">
      <template #extra>
        <el-button size="small" type="primary">操作</el-button>
      </template>
      <el-descriptions-item>
        <template slot="label">标题</template>
        {{ route.query.title }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">作者</template>
        {{ route.query.author }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">时间</template>
        {{ route.query.datetime }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">评级</template>
        <el-rate disabled :value="Number(route.query.rate)" />
      </el-descriptions-item>

      <el-descriptions-item>
        <template slot="label">备注</template>
        {{ route.query.description }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-office-building"></i>
          联系地址
        </template>
        江苏省苏州市吴中区吴中大道 1188 号
      </el-descriptions-item>
    </el-descriptions>

    <vab-json-viewer copyable :expand-depth="5" sort :value="route" />
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import { handleActivePath } from '@/utils/routes'
  import VabJsonViewer from 'vue-json-viewer'

  export default {
    name: 'Detail',
    components: { VabJsonViewer },
    data() {
      return {
        route: { query: { title: '加载中' } },
        form: {
          text: '',
        },
      }
    },
    created() {
      const route = this.$route
      this.$nextTick(() => {
        this.changeTabsMeta({
          title: '详情页',
          meta: {
            title: `${route.query.title} 详情页`,
          },
        })
        this.route = {
          path: route.path,
          params: route.params,
          query: route.query,
          name: route.name,
          meta: route.meta,
        }
      })
    },
    methods: {
      ...mapActions({
        changeTabsMeta: 'tabs/changeTabsMeta',
        delVisitedRoute: 'tabs/delVisitedRoute',
      }),
      async goBack() {
        const detailPath = await handleActivePath(this.$route, true)
        await this.$router.push('/vab/table/comprehensiveTable')
        await this.delVisitedRoute(detailPath)
      },
      handleRefreshMainPage() {
        this.$baseEventBus.$emit('reload-router-view', 'ComprehensiveTable')
      },
    },
  }
</script>
