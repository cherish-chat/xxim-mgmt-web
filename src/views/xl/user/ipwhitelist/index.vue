<template>
    <div class="ip-white-container">


    <el-card class="content-container" shadow="never">
      <vab-query-form>
        <vab-query-form-left-panel :span="24">
            <el-button size="mini" v-perms="['user:ipwhitelist:add']" type="primary" icon="el-icon-plus" @click="onAdd">{{$i18n.t('添加')}}</el-button>
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


                    <div v-if="item.prop=='isEnable'">
                      <span v-if="scope.row[item.prop]">是</span>
                      <span v-else>否</span>
                    </div>
                    <div v-else-if="item.prop=='userId'">
                      <el-tag v-if="scope.row[item.prop] === ''" type="primary">所有用户</el-tag>
                      <span v-else>{{ scope.row[item.prop] }}</span>
                    </div>
                    <div v-else-if="item.prop=='platform'">
                      <el-tag v-if="scope.row.platform !== ''" type="success">{{ scope.row.platform }}</el-tag>
                      <el-tag v-else type="danger">全部</el-tag>
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
                        <el-link v-perms="['user:ipwhitelist:edit']" type="primary"  icon="el-icon-edit" @click="onEDit(scope.row)">{{ $i18n.t('编辑') }}</el-link>
                        <span v-perms="['user:ipwhitelist:del']" >
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
          :title="mdl.id>0 ? $i18n.t('编辑') : $i18n.t('新增')"
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
    import { usermgmtipwhitelist, deleteusermgmtipwhitelist } from '@/api/wt/system'
    import FormModal from '@/components/xl/user/IPWhiteFormModal.vue'
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
                    label:this.$i18n.t('ID'),
                    prop:'id',
                    isHeadShow:true
                  },
                  {
                    label:this.$i18n.t('平台'),
                    prop:'platform',
                    isHeadShow:true
                  },
                {
                  label:this.$i18n.t('作用用户'),
                  prop:'userId',
                  isHeadShow:true
                },
                {
                  label:this.$i18n.t('备注'),
                  prop:'remark',
                  isHeadShow:true
                },
                  {
                    label:this.$i18n.t('开始ip'),
                    prop:'startIp',
                    isHeadShow:true
                  },
                {
                  label:this.$i18n.t('结束ip'),
                  prop:'endIp',
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
          this.fetch()
        },
        computed: {
            formItems () {
                // 构建搜索表单
                return [
                  { title: this.$i18n.t('管理员账号'), type: 'input', key: 'username' },
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
            // 搜索按钮
            onSearch () {
                this.fetch()
            },
          onReset() {
            this.params={}
            this.fetch()
          },
            // 从接口拉取数据
            fetch () {
                this.loading = true
              usermgmtipwhitelist({ filter:this.params,page: {
                    page: this.page.currentPage,
                    size: this.page.perPage
                  }}).then((res) => {
                    const { userIpLists, count } = res.data
                    this.data = userIpLists
                    this.page.total = count
                    this.page.pageCount =userIpLists?userIpLists.length:0
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
                deleteusermgmtipwhitelist({ids:ids}).then(() => {
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
              console.log("====row",row)
                this.mdl = Object.assign({}, {...row})
                this.drawer = true
            },
            // 添加会员等级
            onAdd () {
                this.mdl = Object.assign({}, {
                  id: '',
                  platform: '',
                  remark: '',
                  userId: '',
                  startIp: '',
                  endIp: '',
                  isEnable: true,
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
