<template>
  <div class="roles-container">
    <el-card class="content-container" shadow="never">
      <el-form ref="form" label-position="top" label-width="140px" :model="form">
        <el-form-item label="账号切换">
          <el-radio-group v-model="form.account" @change="handleChangeRole">
            <el-radio-button label="admin">admin</el-radio-button>
            <el-radio-button label="editor">editor</el-radio-button>
            <el-radio-button label="test">test</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="过期Token模拟访问(令牌失效5s)">
          <el-button type="primary" @click="refreshToken">
            点击模拟token过期访问接口，无痛刷新
          </el-button>
        </el-form-item>
        <el-form-item label="描述">
          当前账号拥有的角色
          <el-tag>{{ JSON.stringify(role) }}</el-tag>
          ，权限点
          <el-tag>{{ JSON.stringify(permission) }}</el-tag>
          ，当前token
          <el-tag>{{ token }}</el-tag>
        </el-form-item>
        <el-form-item label="按钮级角色">
          <el-button v-permissions="['Admin']" type="primary">
            拥有["Admin"]角色的按钮
          </el-button>
          <el-button
            v-permissions="{ role: ['Admin'], mode: 'except' }"
            type="danger"
          >
            未拥有["Admin"]角色的按钮
          </el-button>
          <el-button v-permissions="['Editor']" type="primary">
            拥有["Editor"]角色的按钮
          </el-button>
          <el-button
            v-permissions="{ role: ['Editor'], mode: 'except' }"
            type="danger"
          >
            未拥有["Editor"]角色的按钮
          </el-button>
          <el-button
            v-permissions="{ role: ['Admin', 'Editor'], mode: 'allOf' }"
            type="primary"
          >
            同时拥有["Admin","Editor"]角色的按钮
          </el-button>
          <el-button v-permissions="['Test']" type="primary">
            拥有["Test"]角色的按钮
          </el-button>
        </el-form-item>
        <!--  注意其中roles-代表组件name，这样可以区分到具体页面 -->
        <el-form-item label="按钮级权限点">
          <el-button
            v-permissions="{ permission: ['read:system'] }"
            type="primary"
          >
            拥有["read:system"]权限点的按钮
          </el-button>
          <el-button
            v-permissions="{ permission: ['read:system'], mode: 'except' }"
            type="danger"
          >
            未拥有["'read:system'"]权限点的按钮
          </el-button>
          <el-button
            v-permissions="{ permission: ['write:system'] }"
            type="primary"
          >
            拥有["write:system"]权限点的按钮
          </el-button>
          <el-button
            v-permissions="{ permission: ['write:system'], mode: 'except' }"
            type="danger"
          >
            未拥有["write:system"]权限点的按钮
          </el-button>
          <el-button
            v-permissions="{ permission: ['delete:system'] }"
            type="primary"
          >
            拥有["delete:system"]权限点的按钮
          </el-button>
          <el-button
            v-permissions="{ permission: ['delete:system'], mode: 'except' }"
            type="danger"
          >
            未拥有["delete:system"]权限点的按钮
          </el-button>
        </el-form-item>
        <el-form-item label="按钮级角色&权限点">
          <el-button
            v-permissions="{ role: ['Admin'], permission: ['delete:system'] }"
            type="primary"
          >
            拥有["Admin"]角色或者["delete:system"]权限点的按钮
          </el-button>
          <el-button
            v-permissions="{
            role: ['Editor'],
            permission: ['read:system'],
            mode: 'allOf',
          }"
            type="primary"
          >
            拥有["Editor"]角色和["read:system"]权限点的按钮
          </el-button>
          <el-button
            v-permissions="{
            role: ['Admin'],
            permission: ['delete:system'],
            mode: 'except',
          }"
            type="danger"
          >
            没有["Admin"]和["delete:system"]权限点的按钮
          </el-button>
        </el-form-item>
      </el-form>
      <h3>intelligence模式(前端控制路由)</h3>
      <p>用法请阅读文档</p>
      <h3>all模式(后端动态路由控制)</h3>
      <p>用法请阅读文档</p>
    </el-card>

    <el-card class="content-container" shadow="never">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-table
            border
            :data="tableData"
            default-expand-all
            row-key="path"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          >
            <el-table-column
              align="center"
              label="name"
              prop="name"
              show-overflow-tooltip
              width="220"
            />
            <el-table-column
              align="center"
              label="path"
              prop="path"
              show-overflow-tooltip
              width="220"
            />
            <el-table-column
              align="center"
              label="component"
              prop="component"
              show-overflow-tooltip
              width="220"
            />
            <el-table-column
              align="center"
              label="redirect"
              prop="redirect"
              show-overflow-tooltip
              width="220"
            />
            <el-table-column
              align="center"
              label="title"
              prop="meta.title"
              show-overflow-tooltip
            />
            <el-table-column align="center" label="icon" show-overflow-tooltip>
              <template #default="{ row }">
              <span v-if="row.meta">
                <vab-icon v-if="row.meta.icon" :icon="row.meta.icon" />
              </span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="noClosable"
              show-overflow-tooltip
              width="130"
            >
              <template #default="{ row }">
              <span v-if="row.meta">
                {{ row.meta.noClosable || false }}
              </span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="noKeepAlive"
              show-overflow-tooltip
              width="130"
            >
              <template #default="{ row }">
              <span v-if="row.meta">
                <template v-if="!row.meta.noKeepAlive">false</template>
                <template v-else>true</template>
              </span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="badge" show-overflow-tooltip>
              <template #default="{ row }">
              <span v-if="row.meta">
                {{ row.meta.badge }}
              </span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="isCustomSvg"
              show-overflow-tooltip
              width="140"
            >
              <template #default="{ row }">
              <span v-if="row.meta">
                {{ row.meta.isCustomSvg || false }}
              </span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="tabHidden"
              width="100"
              show-overflow-tooltip
            >
              <template #default="{ row }">
              <span v-if="row.meta">
                <template v-if="!row.meta.tabHidden">false</template>
                <template v-else>true</template>
              </span>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-card>


  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import {
    authentication,
    loginInterception,
    rolesControl,
    tokenTableName,
  } from '@/config'
  import { getList } from '@/api/router'
  import { filterRoutes } from '@/utils/routes'
  import { expireToken } from '@/api/refreshToken'
  import { Random } from 'mockjs'

  export default {
    name: 'Permission',
    data() {
      return {
        form: {
          account: '',
        },
        tableData: [],
        res: [],
        authentication,
        loginInterception,
        rolesControl,
      }
    },
    computed: {
      ...mapGetters({
        role: 'acl/role',
        token: 'user/token',
        username: 'user/username',
        permission: 'acl/permission',
      }),
    },
    created() {
      this.form.account = this.username
      this.fetchData()
    },
    methods: {
      async handleChangeRole() {
        this.$baseLoading(0, '正在切换账号请稍后...')
        await localStorage.setItem(
          tokenTableName,
          `${this.form.account}-token-${Random.guid()}-${new Date().getTime()}`
        )
        await location.reload()
      },
      async fetchData() {
        const {
          data: { list },
        } = await getList()
        this.tableData = filterRoutes([...list])
      },
      async refreshToken() {
        const { msg } = await expireToken()
        this.$baseMessage(
          `${msg}: [${this.token}] `,
          'success',
          'vab-hey-message-success'
        )
      },
    },
  }
</script>

<style lang="scss" scoped>
  :deep() {
    .el-button {
      margin-right: 10px;
    }

    .el-button + .el-button {
      margin-right: 10px;
      margin-left: 0;
    }

    .el-form-item--small.el-form-item {
      margin-bottom: 0;

      .el-form-item__content {
        > * {
          margin-bottom: 10px;
        }
      }
    }
  }
</style>
