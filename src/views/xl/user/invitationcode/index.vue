<template>
  <div class="invite-container">


    <el-card class="content-container" shadow="never">
      <vab-query-form>
        <vab-query-form-left-panel :span="24">
           <el-button size="mini" v-perms="['user:invitationcode:add']" type="primary" icon="el-icon-plus" @click="onAdd">{{$i18n.t('添加')}}</el-button>
        </vab-query-form-left-panel>
      </vab-query-form>

      <!-- 表格 -->
      <el-table border style="width: 100%;" stripe :data="data" v-loading="loading" >
        <template   v-for="(item,index) in tableColumns">
          <el-table-column
              v-if="item.isHeadShow"
              :key="index"
              :type="item.type?item.type:''"
              align="center"
              show-overflow-tooltip
              :prop="item.props" :label="item.label" :width="item.width" >
            <template slot-scope="scope" >
              <div v-if="item.prop=='creatorType'">
                <el-tag v-if="scope.row.creatorType === 0" type="success"> 管理员</el-tag>
                <el-tag v-else type="danger"> 用户</el-tag>
                <el-tag>{{ scope.row.creator }}</el-tag>
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
            <el-link  v-perms="['user:invitationcode:edit']" type="primary"  icon="el-icon-edit" @click="onEDit(scope.row)">{{ $i18n.t('编辑') }}</el-link>
            <span  v-perms="['user:invitationcode:del']" >
                            <el-divider direction="vertical"></el-divider>
                          <el-popconfirm
                                confirm
                                :title="$i18n.t('确定删除')"
                                @confirm="onDelete([scope.row.code])"
                                :ok-text="$i18n.t('确定')"
                                :cancel-text="$i18n.t('取消')"
                            >
                                <el-link slot="reference" type="danger" icon="el-icon-delete">{{ $i18n.t('删除') }}</el-link>
                            </el-popconfirm>
                        </span>
          </template>
        </el-table-column>
      </el-table>



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
import { invitationcodeList,invitationcodeDetail,invitationcodeDelete } from '@/api/wt/system'
import { PAGES_SIZE } from '@/config/constants'
import FormModal from '@/components/xl/user/InviteFormModal.vue'
export default {
  name: 'appConfig',
  components:{
    FormModal
  },
  data(){
    return{
      drawer:false,
      PAGES_SIZE,
      loading:false,
      data:[],
      mdl:{},
      tableColumns:[
        {
          label:this.$i18n.t('邀请码'),
          prop:'code',
          isHeadShow:true
        },
        {
          label:this.$i18n.t('备注'),
          prop:'remark',
          isHeadShow:true
        },
        {
          label:this.$i18n.t('创建人'),
          prop:'creatorType',
          isHeadShow:true
        },
        {
          label:this.$i18n.t('启用'),
          prop:'isEnable',
          isHeadShow:true
        },
        {
          label:this.$i18n.t('创建时间'),
          prop:'createdAtStr',
          isHeadShow:true
        }
      ],
      page: {
        total: 0,
        currentPage: 1,
        perPage: PAGES_SIZE[0],
        pageCount: 1
      }
    }
  },
  created () {
    this.fetch()
  },
  methods:{
    // 删除
    onDelete (ids) {
      invitationcodeDelete({codes:ids}).then(() => {
        this.$Message.success(this.$i18n.t('操作成功'))
        setTimeout(() => {
          this.fetch()
        }, 500)
      })
    },
    // 修改
    onEDit (row) {
      console.log("====row",row)
      this.mdl = Object.assign({}, {...row, mode:'edit'})
      this.drawer = true
    },
    // 添加会员等级
    onAdd () {
      this.mdl = Object.assign({}, {
        id:'',
        code: '',
        remark: '',
        isEnable: true,
        mode:'add',
        defaultConvMode:''
      })
      this.drawer = true
    },
    fetch () {
      this.loading = true
      invitationcodeList({page: {
          page: this.page.currentPage,
          size: this.page.perPage
        }}).then((res) => {
        const { userInvitationCodes, count } = res.data
        this.data = userInvitationCodes
        this.page.total = count
        this.page.pageCount =userInvitationCodes?userInvitationCodes.length:0
      }).finally(() => {
        this.loading = false
      })
    },
    // 关闭抽屉方法
    handleCloseDrawer () {
      this.$refs.drawer.closeDrawer()
    }, // 页数切换
    onCurrentPageChange (page) {
      this.page.currentPage = page
      this.fetch()
    },
    // 每页显示数量修改
    onPerPageChange (perPage) {
      this.page.perPage = perPage
      this.fetch()
    },

  }
}
</script>

<style scoped>

</style>
