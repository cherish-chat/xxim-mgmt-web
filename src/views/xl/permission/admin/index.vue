<template>
  <div class="admin-container">
    <el-card class="query-container" shadow="never">
        <vab-query-form>
        <vab-query-form-left-panel :span="24">
          <search-form :items="formItems" :params="params" :on-reset="onReset" :on-submit="onSearch" :btn-loading="loading" >
        </search-form>
        </vab-query-form-left-panel>
        </vab-query-form>
    </el-card>


    <el-card class="content-container" shadow="never">
      <vab-query-form>
        <vab-query-form-left-panel :span="24">
          <el-button size="mini" type="primary" icon="el-icon-plus" @click="onAdd">{{$i18n.t('添加')}}</el-button>
        </vab-query-form-left-panel>
      </vab-query-form>
      <!-- 表格 -->
      <el-table border style="width: 100%;" stripe :data="data" v-loading="loading" @selection-change="handleSelectionChange">
        <template   v-for="(item,index) in tableColumns">
          <el-table-column
            v-if="item.isHeadShow"
            :key="index"
            :type="item.type?item.type:''"
            align="center"
            show-overflow-tooltip
            :prop="item.props" :label="item.label" :width="item.width" >
            <template slot-scope="scope" >
              <div v-if="item.prop=='avatar'">
                <el-avatar :size="30" :src="scope.row[item.prop]"></el-avatar>
              </div>
              <div v-else-if="item.prop=='isDisable'">
                <el-switch
                  v-perms="['system:admin:disable']"
                  v-model="scope.row.isDisable"
                  :active-value="false"
                  :inactive-value="true"
                  @change="changeStatus($event, scope.row)"
                />
              </div>
              <div v-else>
                {{scope.row[item.prop]}}
              </div>
            </template>
          </el-table-column>
        </template>

        <!-- 右侧按钮 -->
        <el-table-column align="center" :label="$i18n.t('操作')" fixed="right" :width="150">
          <template slot-scope="scope">
            <el-link   v-perms="['system:admin:edit']"  type="primary"  icon="el-icon-edit" @click="onEDit(scope.row)">{{$i18n.t('编辑')}}</el-link>
            <span  >
                            <el-divider direction="vertical"></el-divider>
                            <el-popconfirm
                              confirm
                              :title="$i18n.t('确定删除')"
                              @confirm="onDelete([scope.row.id])"
                              :ok-text="$i18n.t('确定')"
                              :cancel-text="$i18n.t('取消')"
                            >
                                <el-link slot="reference"  v-perms="['system:admin:del']"  type="danger" icon="el-icon-delete">{{$i18n.t('删除')}}</el-link>
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
    <el-drawer
      :title="mdl.id!='' ? $i18n.t('编辑') : $i18n.t('新增')"
      :visible.sync="drawer"
      destroy-on-close
      ref="drawer"
      size="400px"
    >
      <form-modal :mdl="mdl" :handle-close-drawer="handleCloseDrawer"></form-modal>
    </el-drawer>
  </div>
</template>
<script>
import SearchForm from '@/components/SearchForm'
import { PAGES_SIZE } from '@/config/constants'
import { getAdminList, batchDeleteAdmin,adminStatus,getRoleList } from '@/api/wt/system'
import FormModal from '@/components/xl/admin/FormModal'
import configs from '@/config'

export default {
  name: 'AdminManage',
  components: { SearchForm, FormModal },
  data () {
    return {
      PAGES_SIZE,
      params: {},
      data: [],
      tableColumns:[
        {
          label:"ID",
          prop:'id',
          isHeadShow:true
        },
        {
          label:this.$i18n.t('头像'),
          prop:'avatar',
          isHeadShow:true
        },
        {
          label:this.$i18n.t('账号'),
          prop:'username',
          isHeadShow:true
        },
        {
          label:this.$i18n.t('名称'),
          prop:'nickname',
          isHeadShow:true
        },
        {
          label:this.$i18n.t('角色'),
          prop:'role',
          isHeadShow:true
        },
        {
          label:this.$i18n.t('状态'),
          prop:'isDisable',
          isHeadShow:true
        },
        {
          label:this.$i18n.t('创建时间'),
          prop:'createTime',
          isHeadShow:true,
          width:150
        },
        {
          label:this.$i18n.t('最近登录时间'),
          prop:'lastLoginTime',
          isHeadShow:true,
          width:150
        },
        {
          label:this.$i18n.t('最近登录IP'),
          prop:'lastLoginIp',
          isHeadShow:true,
          width:120
        }
      ],
      page: {
        total: 0,
        currentPage: 1,
        perPage: PAGES_SIZE[0],
        pageCount: 1
      },
      loading: false,
      drawer: false,
      dialogTableVisible: false,
      mdl: {},
      checkedIds: [],
      isShowPictures: false,
      picture: [],
      config: configs,
      roleOptions:[]
    }
  },
  created () {
    this.getRoleList()
    this.fetch()
  },
  computed: {
    formItems () {
      // 构建搜索表单
      return [
        { title: this.$i18n.t('管理员ID'), type: 'input', key: 'username' },
        { title: this.$i18n.t('管理员名称'), type: 'input', key: 'nickname' },
        { title: this.$i18n.t('管理员角色'), type: 'select', key: 'role',options: this.roleOptions},
      ]
    },
    isShowDivider () {
      const { meta } = this.$store.getters.router
      return meta.actions.indexOf('update') > -1 && meta.actions.indexOf('delete') > -1
    }
  },
  methods: {
    changeStatus(active, row){
      try {
        this.$confirm(`确定${row.isDisable? "停用" : "开启"}当前管理员？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await adminStatus({id:row.id});
          this.$Message.success(this.$i18n.t('操作成功'))
          this.fetch();
        }).catch(() => {
          this.fetch();
        });
      } catch (error) {
        this.fetch();
      }
    },
    // 搜索按钮
    onSearch () {
      this.page.currentPage=1
      this.fetch()
    },
    onReset() {
      this.params={}
      this.page.currentPage=1
      this.fetch()
    },
    getRoleList(){
      getRoleList({ }).then((res) => {
        const { roles, count } = res.data
        let obj={label:'全部',value:''}
        this.roleOptions.push(obj)
        if(roles){
          roles.map((item)=>{
            let obj={label:item.name,value:item.id}
            this.roleOptions.push(obj)
          })
        }
      })
    },
    // 从接口拉取数据
    fetch () {
      this.loading = true
      getAdminList({ filter:this.params,page: {
          page: this.page.currentPage,
          size: this.page.perPage
        }}).then((res) => {
        const { users, count } = res.data
        this.data = users
        this.page.total = count
        this.page.pageCount =users?users.length:0
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
    // 关闭抽屉方法
    handleCloseDrawer () {
      this.$refs.drawer.closeDrawer()
    },
    // 选中的ID
    handleSelectionChange (rows) {
      this.checkedIds = rows.map(item => item.id)
    },
    // 删除
    onDelete (ids) {
      batchDeleteAdmin({ids:ids}).then(() => {
        this.$Message.success(this.$i18n.t('操作成功'))
        setTimeout(() => {
          this.fetch()
        }, 500)
      })
    },
    onUnbindGoogle(ids){
      this.$confirm('确定要解绑谷歌吗？','提示')
        .then(_ => {
          batchUnlockGoogle({ids:ids.join(",")}).then((res)=>{
            this.$Message.success(this.$i18n.t('操作成功'))
            this.fetch()
          }).finally(()=>{
            done();
          })
        })
        .catch(_ => {});
    },
    // 修改
    onEDit (row) {
      this.mdl = Object.assign({}, {...row,isRoot:row. roleId=='0',role: row.roleId})
      this.drawer = true
    },
    // 添加会员等级
    onAdd () {
      this.mdl = Object.assign({}, {
        id: "",
        username: "",
        nickname: "",
        deptId: "",
        postId: "",
        role: "",
        avatar: "",
        password: "",
        passwordConfirm: "",
        isDisable: false,
        isMultipoint: 1,
        //服务端为必传参数，先给默认值
        sort: 1,
        isRoot:false
      })
      this.drawer = true
    },
    checkPicture (picture) {
      this.isShowPictures = true

      this.picture[0] = this.config.staticUrl + picture
    }
  }
}
</script>

<style lang="scss" scoped>
.top-tip{
  list-style: none;
  margin-bottom: 10px;
}
</style>
