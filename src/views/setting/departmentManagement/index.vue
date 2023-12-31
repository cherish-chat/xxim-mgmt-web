<template>
  <div class="department-management-container">
    <el-card class="query-container" shadow="never">
      <vab-query-form>
        <vab-query-form-left-panel :span="12">
          <el-button
            icon="el-icon-plus"
            type="primary"
            @click="handleEdit($event)"
          >
            添加
          </el-button>
          <el-button
            icon="el-icon-delete"
            type="danger"
            @click="handleDelete($event)"
          >
            批量删除
          </el-button>
        </vab-query-form-left-panel>
        <vab-query-form-right-panel :span="12">
          <el-form :inline="true" :model="queryForm" @submit.native.prevent>
            <el-form-item>
              <el-input
                v-model.trim="queryForm.name"
                clearable
                placeholder="请输入名称"
              />
            </el-form-item>
            <el-form-item>
              <el-button icon="el-icon-search" type="primary" @click="queryData">
                查询
              </el-button>
            </el-form-item>
          </el-form>
        </vab-query-form-right-panel>
      </vab-query-form>
    </el-card>
    <el-card  class="content-container" shadow="never">
      <el-table
        v-loading="listLoading"
        border
        :data="list"
        default-expand-all
        row-key="id"
        :tree-props="{ children: 'children' }"
        @selection-change="setSelectRows"
      >
        <el-table-column show-overflow-tooltip type="selection" />
        <el-table-column label="名称" prop="name" show-overflow-tooltip />
        <el-table-column label="父节点Id" prop="parentId" show-overflow-tooltip />
        <el-table-column label="排序" prop="order" show-overflow-tooltip />
        <el-table-column
          label="创建时间"
          prop="createTime"
          show-overflow-tooltip
        />
        <el-table-column label="操作" width="125">
          <template #default="{ row }">
            <el-button type="text" @click="handleEdit(row)">编辑</el-button>
            <el-button
              :disabled="!row.parentId"
              type="text"
              @click="handleDelete({ row })"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
        <template #empty>
          <el-image
            class="vab-data-empty"
            :src="require('@/assets/empty_images/data_empty.png')"
          />
        </template>
      </el-table>
      <el-pagination
        background
        :current-page="queryForm.pageNo"
        :layout="layout"
        :page-size="queryForm.pageSize"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </el-card>
    <edit ref="edit" @fetch-data="fetchData" />
  </div>
</template>

<script>
  import { doDelete, getList } from '@/api/departmentManagement'
  import Edit from './components/DepartmentManagementEdit'

  export default {
    name: 'DepartmentManagement',
    components: { Edit },
    data() {
      return {
        list: [],
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        selectRows: '',
        queryForm: {
          pageNo: 1,
          pageSize: 10,
          title: '',
        },
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      setSelectRows(val) {
        this.selectRows = val
      },
      handleEdit(row) {
        if (row.id) {
          this.$refs['edit'].showEdit(row)
        } else {
          this.$refs['edit'].showEdit()
        }
      },
      handleDelete(row) {
        if (row.id) {
          this.$baseConfirm('你确定要删除当前项吗', null, async () => {
            const { msg } = await doDelete({ ids: row.id })
            this.$baseMessage(msg, 'success', 'vab-hey-message-success')
            await this.fetchData()
          })
        } else {
          if (this.selectRows.length > 0) {
            const ids = this.selectRows.map((item) => item.id).join()
            this.$baseConfirm('你确定要删除选中项吗', null, async () => {
              const { msg } = await doDelete({ ids })
              this.$baseMessage(msg, 'success', 'vab-hey-message-success')
              await this.fetchData()
            })
          } else {
            this.$baseMessage('未选中任何行', 'error', 'vab-hey-message-error')
          }
        }
      },
      handleSizeChange(val) {
        this.queryForm.pageSize = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.queryForm.pageNo = val
        this.fetchData()
      },
      queryData() {
        this.queryForm.pageNo = 1
        this.fetchData()
      },
      async fetchData() {
        this.listLoading = true
        const {
          data: { list, total },
        } = await getList(this.queryForm)
        this.list = list
        this.total = total
        this.listLoading = false
      },
    },
  }
</script>
