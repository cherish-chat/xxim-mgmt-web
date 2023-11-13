<template>
  <div class="comprehensive-table-container">
    <el-card class="query-container" shadow="never">
      <vab-query-form>
        <vab-query-form-top-panel>
          <el-form
            ref="form"
            :inline="true"
            label-width="49px"
            :model="queryForm"
            @submit.native.prevent
          >
            <el-form-item label="标题">
              <el-input  v-model="queryForm.title" placeholder="请输入标题" />
            </el-form-item>
            <el-form-item label="标题">
              <el-input v-model="queryForm.title" placeholder="请输入标题" />
            </el-form-item>
            <el-form-item v-show="!fold" label="标题">
              <el-input v-model="queryForm.title" placeholder="请输入标题" />
            </el-form-item>
            <el-form-item v-show="!fold" label="标题">
              <el-input v-model="queryForm.title" placeholder="请输入标题" />
            </el-form-item>
            <el-form-item v-show="!fold" label="标题">
              <el-input v-model="queryForm.title" placeholder="请输入标题" />
            </el-form-item>
            <el-form-item v-show="!fold" label="标题">
              <el-input v-model="queryForm.title" placeholder="请输入标题" />
            </el-form-item>
            <el-form-item v-show="!fold" label="标题">
              <el-input v-model="queryForm.title" placeholder="请输入标题" />
            </el-form-item>
            <el-form-item v-show="!fold" label="标题">
              <el-input v-model="queryForm.title" placeholder="请输入标题" />
            </el-form-item>
            <el-form-item v-show="!fold" label="标题">
              <el-input v-model="queryForm.title" placeholder="请输入标题" />
            </el-form-item>
            <el-form-item v-show="!fold" label="标题">
              <el-input v-model="queryForm.title" placeholder="请输入标题" />
            </el-form-item>
            <el-form-item v-show="!fold" label="标题">
              <el-input v-model="queryForm.title" placeholder="请输入标题" />
            </el-form-item>
            <el-form-item>
              <el-button
                icon="el-icon-search"
                native-type="submit"
                type="primary"
                @click="handleQuery"
              >
                查询
              </el-button>
              <el-button type="text" @click="handleFold">
                <span v-if="fold">展开</span>
                <span v-else>合并</span>
                <vab-icon
                  class="vab-dropdown"
                  :class="{ 'vab-dropdown-active': fold }"
                  icon="arrow-up-s-line"
                />
              </el-button>
            </el-form-item>
          </el-form>
        </vab-query-form-top-panel>
      </vab-query-form>
    </el-card>

    <el-card class="content-container" shadow="never">
      <vab-query-form>
        <vab-query-form-left-panel :span="24">
          <el-button icon="el-icon-plus" type="primary" @click="handleAdd">
            添加
          </el-button>
          <el-button
            icon="el-icon-delete"
            type="danger"
            @click="handleDelete($event)"
          >
            删除
          </el-button>
        </vab-query-form-left-panel>
      </vab-query-form>
      <el-table
        ref="tableSort"
        v-loading="listLoading"
        border
        :data="list"
        @selection-change="setSelectRows"
        @sort-change="tableSortChange"
      >
        <el-table-column
          align="center"
          show-overflow-tooltip
          type="selection"
          width="55"
        />
        <el-table-column
          align="center"
          label="序号"
          show-overflow-tooltip
          width="70"
        >
          <template #default="{ $index }">
            {{ $index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="标题"
          prop="title"
          show-overflow-tooltip
        />
        <el-table-column
          align="center"
          label="作者"
          prop="author"
          show-overflow-tooltip
        />
        <el-table-column align="center" label="评级">
          <template #default="{ row }">
            <el-rate v-model="row.rate" disabled />
          </template>
        </el-table-column>
        <el-table-column align="center" label="头像">
          <template #default="{ row }">
            <el-image
              v-if="imgShow"
              style="width: 25px;height: 25px;vertical-align: middle"
              :preview-src-list="imageList"
              :src="row.img"
            />
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          label="点击量"
          prop="pageViews"
          show-overflow-tooltip
          sortable
          width="100"
        />
        <el-table-column
          align="center"
          label="开关"
          prop="switch"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <el-tooltip
              :content="row.switch === 0 ? '点击开启' : '点击关闭'"
              :enterable="false"
              placement="top"
            >
              <el-switch v-model="row.switch" />
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          label="时间"
          prop="datetime"
          show-overflow-tooltip
          width="180"
        />
        <el-table-column
          align="center"
          label="操作"
          width="150"
        >
          <template  #default="{ row }">
            <el-link class="tb-btn-opt" type="text" @click="handleDetail(row)">详情</el-link>
            <el-link class="tb-btn-opt" type="text" @click="handleEdit(row)">编辑</el-link>
            <el-link class="tb-btn-opt" type="danger" @click="handleDelete(row)">删除</el-link>
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
    <table-edit ref="edit" @fetch-data="fetchData" />
  </div>
</template>

<script>
  import { doDelete, getList } from '@/api/table'
  import { mapActions, mapGetters } from 'vuex'
  import { handleMatched, handleTabs } from '@/utils/routes'
  import TableEdit from './components/TableEdit'

  export default {
    name: 'comprehensiveTable1',
    components: {
      TableEdit,
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'gray',
          deleted: 'danger',
        }
        return statusMap[status]
      },
    },
    data() {
      return {
        fold: true,
        height: this.$baseTableHeight(3)-32,
        imgShow: true,
        list: [],
        imageList: [],
        listLoading: true,
        layout: 'total, prev, pager, next,sizes,jumper',
        total: 0,
        selectRows: '',
        queryForm: {
          pageNo: 1,
          pageSize: 10,
        },
      }
    },
    computed: {
      ...mapGetters({
        routes: 'routes/routes',
      }),
    },
    beforeMount() {
      window.addEventListener('resize', this.handleHeight)
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.handleHeight)
    },
    created() {
      this.fetchData()
    },
    methods: {
      ...mapActions({
        addVisitedRoute: 'tabs/addVisitedRoute',
        changeTabsMeta: 'tabs/changeTabsMeta',
      }),
      handleFold() {
        this.fold = !this.fold
        this.handleHeight()
      },
      handleHeight() {
        if (this.fold) this.height = this.$baseTableHeight(3) - 32
        else this.height = this.$baseTableHeight('') - 30
      },
      tableSortChange() {
        const imageList = []
        this.$refs.tableSort.tableData.forEach((item) => {
          imageList.push(item.img)
        })
        this.imageList = imageList
      },
      setSelectRows(val) {
        this.selectRows = val
      },
      handleAdd() {
        this.$refs['edit'].showEdit()
      },
      handleEdit(row) {
        this.$refs['edit'].showEdit(row)
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
              const { msg } = await doDelete({ ids: ids })
              this.$baseMessage(msg, 'success', 'vab-hey-message-success')
              await this.fetchData()
            })
          } else {
            this.$baseMessage('未选中任何行', 'error', 'vab-hey-message-error')
          }
        }
      },
      async handleDetailStayTable() {
        for (let i = 0; i < this.selectRows.length; i++) {
          const matched = handleMatched(this.routes, 'Detail')
          const tab = handleTabs({
            ...matched[matched.length - 1],
            query: this.selectRows[i],
          })
          await this.addVisitedRoute(tab)
          this.changeTabsMeta({
            title: '详情页',
            meta: {
              title: `${tab.query.title} 详情页`,
            },
          })
        }
      },
      handleDetail(row) {
        if (row.id)
          this.$router.push({
            path: '/vab/table/detail',
            query: row,
          })
        else {
          if (this.selectRows.length === 1) {
            this.$router.push({
              path: '/vab/table/detail',
              query: this.selectRows[0],
            })
          } else {
            this.$baseMessage(
              '请选择一行进行详情页跳转',
              'error',
              'vab-hey-message-error'
            )
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
      handleQuery() {
        this.queryForm.pageNo = 1
        this.fetchData()
      },
      async fetchData() {
        this.listLoading = true
        const {
          data: { list, total },
        } = await getList(this.queryForm)
        this.list = list
        const imageList = []
        list.forEach((item) => {
          imageList.push(item.img)
        })
        this.imageList = imageList
        this.total = total
        this.listLoading = false
      },
      handleMessage() {
        this.$baseMessage('test1', 'success', 'vab-hey-message-success')
      },
      handleAlert() {
        this.$baseAlert('11')
        // this.$baseAlert('11', '自定义标题', () => {
        //   /* 可以写回调; */
        // })
        // this.$baseAlert('11', null, () => {
        //   /* 可以写回调; */
        // })
      },
      handleConfirm() {
        this.$baseConfirm(
          '你确定要执行该操作?',
          null,
          () => {
            /* 可以写回调; */
          },
          () => {
            /* 可以写回调; */
          }
        )
      },
      handleNotify() {
        this.$baseNotify('测试消息提示', 'test', 'success', 'bottom-right')
      },
      toggleSelection(rows) {
        if (rows) {
          rows.forEach((row) => {
            this.$refs.tableSort.toggleRowSelection(row)
          })
        } else {
          this.$refs.tableSort.clearSelection()
        }
      },
    },
  }
</script>
