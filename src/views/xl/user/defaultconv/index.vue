<template>
    <div class="default-conv-container">


    <el-card class="content-container" shadow="never">
      <vab-query-form>
        <vab-query-form-left-panel :span="24">
           <el-button v-perms="['user:defaultconv:add']" size="mini"   type="primary" icon="el-icon-plus" @click="onAdd">{{$i18n.t('添加')}}</el-button>

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


                    <div v-if="item.prop=='convType'">
                      <el-tag v-if="scope.row.convType === 0 " type="success">好友</el-tag>
                      <el-tag v-else type="danger">群聊</el-tag>
                      <el-tag type="warning">{{ scope.row.convId }}</el-tag>
                    </div>

                    <div v-else-if="item.prop=='filterType'">
                      <el-tag v-if="scope.row.filterType === 0" type="success"> 所有注册用户</el-tag>
                      <el-tag v-else type="info"> 使用邀请码注册的用户</el-tag>
                      <el-tag v-if="scope.row.filterType === 1" type="danger">邀请码:{{ scope.row.invitationCode }}</el-tag>
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
                        <el-link  v-perms="['user:defaultconv:edit']" type="primary"  icon="el-icon-edit" @click="onEDit(scope.row)">{{ $i18n.t('编辑') }}</el-link>
                        <span v-perms="['user:defaultconv:del']" >
                            <el-divider direction="vertical"></el-divider>
                             <el-popconfirm
                                confirm
                                :title="$i18n.t('确定删除')"
                                @confirm="onDelete([scope.row.id])"
                                :ok-text="$i18n.t('确定')"
                                :cancel-text="$i18n.t('取消')"
                            >
                                <el-link slot="reference" type="danger" icon="el-icon-delete">{{ $i18n.t('删除') }}</el-link>
                            </el-popconfirm>
                        </span>
                    </template>
                </el-table-column>
            </el-table>
         <div>
                <el-image-viewer v-if="isShowPictures" :on-close="() => { isShowPictures = false }" :url-list="picture">
                </el-image-viewer>
            </div>
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
            :title="mdl.id > 0 ? $i18n.t('编辑') : $i18n.t('新增')"
            :visible.sync="drawer"
            destroy-on-close
            ref="drawer"
            size="420px"
        >
            <form-modal :mdl="mdl" :handle-close-drawer="handleCloseDrawer"></form-modal>
        </el-drawer>





    </div>
</template>
<script>
    import SearchForm from '@/components/SearchForm'
    import { PAGES_SIZE } from '@/config/constants'
    import { defaultconvList, defaultconvDelete } from '@/api/wt/system'
    import FormModal from '@/components/xl/user/DefaultFriendFormModal.vue'

    import configs from '@/config'

    export default {
        name: 'ServiceList',
        components: {
          SearchForm,
          FormModal

        },
        data () {
            return {
                PAGES_SIZE,
                params: {},
                data: [],
                tableColumns:[
                {
                  label:this.$i18n.t('ID'),
                  prop:'id',
                  isHeadShow:true
                },
                {
                  label:this.$i18n.t('会话'),
                  prop:'convType',
                  isHeadShow:true,
                  width:150
                },
                {
                  label:this.$i18n.t('过滤'),
                  prop:'filterType',
                  isHeadShow:true,
                  width: 300
                },
                {
                  label:this.$i18n.t('招呼'),
                  prop:'textMsg',
                  isHeadShow:true
                },
                {
                  label:this.$i18n.t('创建时间'),
                  prop:'createdAtStr',
                  isHeadShow:true,
                  width:200
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
                drawerBatch: false,
                drawerBatchFriends: false,
                dialogTableVisible: false,
                chatRecord:false,
                mdl: {},
                checkedIds: [],
                isShowPictures: false,
                picture: [],
                config: configs
            }
        },
        created () {
            this.fetch()
        },
        computed: {
            formItems () {
              // 启用状态
              const typeOptions= [
                { label:this.$i18n.t('使用邀请码注册的用户'), value: 0 },
                { label: this.$i18n.t('所有新注册的用户'), value: 1 }
              ]
                  //升级状态
              const typeshengjiOptions= [
                { label: this.$i18n.t('好友'), value: 0 },
                { label: this.$i18n.t('群'), value: 1 }
              ]
                // 构建搜索表单
                return [
                 /* { title: '用户ID', type: 'input', key: 'user_id',},
                  { title: '群组ID', type: 'input', key: 'group_id'},*/
                  { title: this.$i18n.t('邀请码'), type: 'input', key: 'invitation_code' },
                  { title: this.$i18n.t('类型'), type: 'select', key: 'preset_type',options:typeshengjiOptions },
                  { title: this.$i18n.t('预设模式'), type: 'select', key: 'preset_mode',options:typeOptions },
                 /* { title:'创建时间', type: 'date', key: 'reg_date' }*/
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
            // 从接口拉取数据
            fetch () {
                this.loading = true
                defaultconvList({filter:this.params,
                  page: {
                    page: this.page.currentPage,
                    size: this.page.perPage
                  }
                }).then((res) => {
                    // eslint-disable-next-line camelcase
                    const { userDefaultConvs, total } = res.data
                    this.data = userDefaultConvs
                    this.page.total = total
                    // eslint-disable-next-line camelcase
                    this.page.pageCount = userDefaultConvs?userDefaultConvs.length:0
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
                defaultconvDelete({ids:ids}).then(() => {
                    this.$Message.success(this.$i18n.t('操作成功'))
                    setTimeout(() => {
                        this.fetch()
                    }, 500)
                })
            },
            // 修改
            onEDit (row) {
              console.log("===row",row)
                this.mdl = Object.assign({}, {
                  ...row
                })
                this.drawer = true
            },
            // 添加会员等级
            onAdd () {
                this.mdl = Object.assign({}, {
                  id: '',
                  convType: null,
                  filterType: null,
                  invitationCode: '',
                  convId: '',
                  textMsg: '',
                })
                this.drawer = true
            },
            onAddBatch(){
              this.mdl = Object.assign({}, {
                id: 0,
                name: '',
                icon: '',
                day: 0,
                hour: 0,
                minute: 0,
                type: 0,
                price: 0
              })
              this.drawerBatch = true
            },
          onAddBatchFriends(){
            this.mdl = Object.assign({}, {
              id: 0,
              name: '',
              icon: '',
              day: 0,
              hour: 0,
              minute: 0,
              type: 0,
              price: 0
            })
            this.drawerBatchFriends = true
          },
          onChatRecord(row){
            this.mdl = Object.assign({}, row)
            this.chatRecord = true
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
