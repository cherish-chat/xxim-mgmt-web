<template>
  <div class="menu-management-container">
    <el-row :gutter="8">
      <el-col :lg="4" :md="8" :sm="24" :xl="4" :xs="24">
        <el-card class="content-container" shadow="never">
          <el-tree
            :data="data"
            :default-expanded-keys="['root']"
            node-key="id"
            :props="defaultProps"
            @node-click="handleNodeClick"
          />
        </el-card>
      </el-col>
      <el-col :lg="20" :md="16" :sm="24" :xl="20" :xs="24">
        <el-card class="content-container" shadow="hover">
          <vab-query-form>
            <vab-query-form-top-panel :span="12">
              <el-button
                icon="el-icon-plus"
                type="primary"
                @click="handleEdit('')"
              >
                添加
              </el-button>
            </vab-query-form-top-panel>
          </vab-query-form>
          <el-table
            v-loading="listLoading"
            border
            :data="list"
            default-expand-all
            row-key="path"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          >
            <el-table-column
              label="标题"
              prop="meta.title"
              show-overflow-tooltip
            />
            <el-table-column label="name" prop="name" show-overflow-tooltip />
            <el-table-column label="路径" prop="path" show-overflow-tooltip />
            <el-table-column width="100"  label="是否隐藏" show-overflow-tooltip>
              <template #default="{ row }">
                {{ row.meta.hidden ? '是' : '否' }}
              </template>
            </el-table-column>
            <el-table-column
              label="是否隐藏当前节点"
              show-overflow-tooltip
              width="150"
            >
              <template #default="{ row }">
                {{ row.meta.levelHidden ? '是' : '否' }}
              </template>
            </el-table-column>
            <el-table-column
              label="vue文件路径"
              prop="component"
              width="120"
              show-overflow-tooltip
            />
            <el-table-column label="重定向" show-overflow-tooltip>
              <template #default="{ row }">
                {{ row.redirect ? row.redirect : '无' }}
              </template>
            </el-table-column>
            <el-table-column label="图标" show-overflow-tooltip>
              <template #default="{ row }">
                <vab-icon
                  v-if="row.meta && row.meta.icon"
                  :icon="row.meta.icon"
                />
              </template>
            </el-table-column>
            <el-table-column width="100" label="是否固定" show-overflow-tooltip>
              <template #default="{ row }">
                {{ row.meta && row.meta.noClosable ? '是' : '否' }}
              </template>
            </el-table-column>
            <el-table-column
              label="是否无缓存"
              show-overflow-tooltip
              width="120"
            >
              <template #default="{ row }">
                {{ row.meta && row.meta.noKeepAlive ? '是' : '否' }}
              </template>
            </el-table-column>
            <el-table-column label="badge" show-overflow-tooltip>
              <template #default="{ row }">
                <el-tag
                  v-if="row.meta && row.meta.badge"
                  effect="dark"
                  type="danger"
                >
                  {{ row.meta.badge }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="dot" show-overflow-tooltip>
              <template #default="{ row }">
                {{ row.meta && row.meta.dot ? '是' : '否' }}
              </template>
            </el-table-column>
            <el-table-column label="操作" show-overflow-tooltip width="185">
              <template #default="{ row }">
                <el-link type="primary" @click="handleEdit(row)">
                  <vab-icon icon="edit-2-line" />
                  编辑
                </el-link>
                <el-link type="danger" @click="handleDelete(row)">
                  <vab-icon icon="delete-bin-6-line" />
                  删除
                </el-link>
              </template>
            </el-table-column>
            <template #empty>
              <el-image
                class="vab-data-empty"
                :src="require('@/assets/empty_images/data_empty.png')"
              />
            </template>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <edit ref="edit" @fetch-data="fetchData" />
  </div>
</template>

<script>
  import { getList } from '@/api/router'
  import { doDelete, getTree } from '@/api/menuManagement'
  import Edit from './components/MenuManagementEdit'

  export default {
    name: 'MenuManagement',
    components: { Edit },
    data() {
      return {
        data: [],
        defaultProps: {
          children: 'children',
          label: 'label',
        },
        list: [],
        listLoading: true,
      }
    },
    async created() {
      const {
        data: { list },
      } = await getTree()
      this.data = list
      await this.fetchData()
    },
    methods: {
      handleEdit(row) {
        if (row && row.path) {
          this.$refs['edit'].showEdit(row)
        } else {
          this.$refs['edit'].showEdit()
        }
      },
      handleDelete(row) {
        if (row.path) {
          this.$baseConfirm('你确定要删除当前项吗', null, async () => {
            const { msg } = await doDelete({ paths: row.path })
            this.$baseMessage(msg, 'success', 'vab-hey-message-success')
            await this.fetchData()
          })
        }
      },
      async fetchData(role) {
        this.listLoading = true
        const {
          data: { list },
        } = await getList({ role })
        this.list = list
        this.listLoading = false
      },
      handleNodeClick({ role }) {
        this.fetchData(role)
      },
    },
  }
</script>

<style lang="scss" scoped>
  $base: '.menu-management';
  #{$base}-container {
    padding: 0 !important;
    background: $base-color-background !important;
  }
</style>
