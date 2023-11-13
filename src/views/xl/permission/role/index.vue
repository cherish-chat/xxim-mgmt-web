<template>
  <div class="role-container">
    <el-card class="content-container" shadow="never">
      <vab-query-form>
        <vab-query-form-left-panel :span="24">
          <el-button v-perms="['system:role:add']"   type="primary" icon="el-icon-plus" @click="onAdd">{{$i18n.t('添加')}}</el-button>
        </vab-query-form-left-panel>
      </vab-query-form>
      <!-- 表格 -->
      <el-table border style="width: 100%;" stripe :data="data" v-loading="loading" @selection-change="handleSelectionChange">

        <el-table-column type="selection" align="center" prop="user_id" label="ID" :width="50" ></el-table-column>
        <template   v-for="(item,index) in tableColumns">
          <el-table-column
            v-if="item.isHeadShow"
            :key="index"
            :type="item.type?item.type:''"
            align="center"
            show-overflow-tooltip
            :prop="item.props" :label="item.label" :width="item.width" >
            <template slot-scope="scope" >
              <div v-if="item.prop=='isDisable'">
                <span v-if="!scope.row[item.prop]">正常</span>
                <span v-else>禁用</span>
              </div>
              <div v-else>
                {{scope.row[item.prop]}}
              </div>
            </template>
          </el-table-column>
        </template>

        <!-- 右侧按钮 -->
        <el-table-column align="center" :label="$i18n.t('操作')" fixed="right" :width="220" >
          <template slot-scope="scope">
            <el-link  v-perms="['system:role:edit']" type="primary"   @click="onEDit(scope.row)">{{$i18n.t('编辑')}}</el-link>
            <el-divider v-perms="['system:role:edit']" direction="vertical"></el-divider>
            <el-link v-perms="['system:role:edit']" type="primary"   @click="onEditPermition(scope.row)">{{$i18n.t('菜单')}}</el-link>
            <el-divider v-perms="['system:role:edit']" direction="vertical"></el-divider>
            <el-link type="primary" v-perms="['system:role:edit']"  @click="onEDitApi(scope.row)">{{$i18n.t('API')}}</el-link>
            <span v-perms="['system:role:del']" >
                            <el-divider direction="vertical"></el-divider>
                           <el-popconfirm
                              confirm
                              :title="$i18n.t('确定删除')"
                              @confirm="onDelete([scope.row.id])"
                              :ok-text="$i18n.t('确定')"
                              :cancel-text="$i18n.t('取消')"
                            >
                                <el-link slot="reference" type="danger" icon="el-icon-delete">{{$i18n.t('删除')}}</el-link>
                            </el-popconfirm>
                        </span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="table-pagination">
        <el-pagination
          background
          layout="total, prev, pager, next, ->, sizes"
          :page-size.sync="page.perPage"
          :total="page.total"
          :page-count="page.pageCount"
          :current-page.sync="page.currentPage"
          :page-sizes="PAGES_SIZE"
          @current-change="onCurrentPageChange"
          @size-change="onPerPageChange"
        >
        </el-pagination>
      </div>
    </el-card>

    <el-dialog
      v-if="dialog"
      :title="mdl.id!='' ? $i18n.t('编辑') : $i18n.t('新增')"
      :visible.sync="dialog"
      destroy-on-close
      ref="dialog"
    >
      <div style="min-height: 50vh;overflow: auto">
        <role-add  :mdl="mdl"></role-add>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog = false">{{$i18n.t('取消')}}</el-button>
        <el-button type="primary" @click="dialogComfim">{{$i18n.t('确定')}}</el-button>
      </div>
    </el-dialog>
    <el-dialog
      v-if="dialogPermision"
      :title="$i18n.t('菜单')"
      :visible.sync="dialogPermision"
      destroy-on-close
      ref="dialog"
    >
      <div style="height: 50vh;overflow: auto">
        <role-permition ref="rolePermition" :mdl="mdl"></role-permition>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogPermision = false">{{$i18n.t('取消')}}</el-button>
        <el-button type="primary" @click="dialogPermisionComfim">{{$i18n.t('确定')}}</el-button>
      </div>
    </el-dialog>
    <el-dialog
      v-if="dialogApi"
      :title="$i18n.t('API权限')"
      :visible.sync="dialogApi"
      destroy-on-close
      ref="dialog"
    >
      <div style="height: 50vh;overflow: auto">
        <role-api ref="roleApi" :mdl="mdl"></role-api>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogApi = false">{{$i18n.t('取消')}}</el-button>
        <el-button type="primary" @click="dialogApiComfim">{{$i18n.t('确定')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import SearchForm from '@/components/SearchForm'
import { PAGES_SIZE } from '@/config/constants'
import RoleAdd from '@/components/xl/role/RoleAdd.vue'
import RolePermition from '@/components/xl/role/RolePermition.vue'
import RoleApi from '@/components/xl/role/RoleApi.vue'
import {  batchDeleteRole ,getRoleList,insertRole,updateRole} from '@/api/wt/system'


export default {
  name: 'user_level',
  components: { SearchForm, RoleAdd,RolePermition,RoleApi},
  data () {
    return {
      PAGES_SIZE,
      params: {
      },
      data: [],
      tableColumns:[
        {
          label:this.$i18n.t('ID'),
          prop:'id',
          isHeadShow:true,
          width:100
        },
        {
          label:this.$i18n.t('名称'),
          prop:'name',
          isHeadShow:true
        },
        {
          label:this.$i18n.t('排序'),
          prop:'sort',
          isHeadShow:true,
          width: 80,
        },
        {
          label:this.$i18n.t('管理员人数'),
          prop:'member',
          isHeadShow:true,
          width: 120,
        },
        {
          label:this.$i18n.t('状态'),
          prop:'isDisable',
          isHeadShow:true
        },
        {
          label:this.$i18n.t('备注'),
          prop:'remark',
          isHeadShow:true
        },
        {
          label:this.$i18n.t('创建时间'),
          prop:'createTime',
          isHeadShow:true
        }
      ],
      page: {
        total: 0,
        currentPage: 1,
        perPage: PAGES_SIZE[0],
        pageCount: 1
      },
      loading: false,
      dialog: false,
      dialogPermision:false,
      dialogApi:false,
      mdl: {},
      checkedIds: []
    }
  },
  created () {
    this.fetch()
  },
  computed: {
    formItems () {
      // 用户状态筛选
      const statusOptions = [
        { label: this.$i18n.t('全部'), value: '' },
        { label: this.$i18n.t('禁用'), value: 'hidden' },
        { label: this.$i18n.t('正常'), value: 'normal' },
      ]
      // 构建搜索表单
      return [
        { title: this.$i18n.t('ID'), type: 'input', key: 'id' },
        { title: this.$i18n.t('名称'), type: 'input', key: 'rolename'},
        { title: this.$i18n.t('状态'), type: 'select', key: 'status', options: statusOptions },
      ]
    },
    isShowDivider () {
      const { meta } = this.$store.getters.router
      return meta.actions.indexOf('update') > -1 && meta.actions.indexOf('delete') > -1
    }
  },
  methods: {
    // 搜索按钮
    onSearch () {
      this.fetch()
    },
    onReset(){
      this.params={}
      this.fetch()
    },
    onAdd () {
      this.mdl = Object.assign({}, {
        "id": "",
        "name": "",
        "remark": "",
        "sort": 0,
        "isDisable": false,
        "menus": [],
        "menuIds": ""
      })
      this.dialog = true
    },
    dialogComfim(){
      if(this.mdl.id==''){
        insertRole({role:this.mdl}).then(() => {
          this.$Message.success(this.$i18n.t('操作成功'))
          // 调用爷爷组件刷新数据
          this.fetch()
        }).catch((error) => {
        }).finally(() => {
          this.dialog=false
        })

      }else{
        updateRole({role:this.mdl}).then(() => {
          this.$Message.success(this.$i18n.t('操作成功'))
          // 调用爷爷组件刷新数据
          this.fetch()
        }).catch((error) => {
        }).finally(() => {
          this.dialog=false
        })

      }
    },
    onEDit(row){
      this.mdl = Object.assign({}, {
        ...row,
        id:row.id,
        "name": row.name,
        "remark": row.remark,
        "sort": row.sort,
        "isDisable": row.isDisable,
        "menus": row.menus,
        "menuIds": row.menuIds
      })
      this.dialog = true
    },
    onEditPermition(row){
      this.mdl={...row}
      this.dialogPermision = true
    },
    onEDitApi(row){
      this.mdl={...row}
      this.dialogApi = true
    },
    dialogPermisionComfim(){
      let checked=this.$refs.rolePermition.getChecked()
      updateRole({role:{...this.mdl,menus:checked,apiPathIds:this.mdl.apiPaths.join(","),menuIds:checked.join(",")}}).then(() => {
        this.$Message.success(this.$i18n.t('操作成功'))
        this.fetch()
      }).catch((error) => {
      }).finally(() => {
        this.dialogPermision=false
      })
    },
    dialogApiComfim(){
      let checked=this.$refs.roleApi.getChecked()
      updateRole({role:{...this.mdl,apiPaths:checked,apiPathIds:checked.join(","),menuIds:this.mdl.menus.join(",")}}).then(() => {
        this.$Message.success(this.$i18n.t('操作成功'))
        this.fetch()
      }).catch((error) => {
      }).finally(() => {
        this.dialogApi=false
      })
    },
    // 从接口拉取数据
    fetch () {
      this.loading = true
      getRoleList({ }).then((res) => {
        const { roles, count } = res.data
        this.data = roles
        this.page.total = count
        this.page.pageCount = roles?roles.length:0
      }).finally(() => {
        this.loading = false
      })
    },
    // 页数切换
    onCurrentPageChange (page) {
      this.page.currentPage = page
      this.fetch()
    },
    // 每页显示数量修改
    onPerPageChange (perPage) {
      this.page.perPage = perPage
      this.fetch()
    },
    // 关闭对话框方法
    handleCloseDialog () {
      this.dialog = false
    },
    // 选中的ID
    handleSelectionChange (rows) {
      this.checkedIds = rows.map(item => item.id)
    },
    // 删除
    onDelete (ids) {
      batchDeleteRole({ids:ids}).then(() => {
        this.$Message.success(this.$i18n.t('操作成功'))
        setTimeout(() => {
          this.fetch()
        }, 500)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
