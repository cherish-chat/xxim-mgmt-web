<template>
    <div class="operate-container">

      <el-card class="query-container" shadow="never">
        <vab-query-form>
        <vab-query-form-left-panel :span="24">
          <search-form :items="formItems" :params="params" :on-reset="onReset" :on-submit="onSearch" :btn-loading="loading" />
        </vab-query-form-left-panel>
        </vab-query-form>
      </el-card>


      <el-card class="content-container" shadow="never">
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
                    <div v-if="item.prop=='operator'">
                      <el-tag v-if="scope.row[item.prop]&&scope.row[item.prop]!=='null'"> {{ scope.row[item.prop] }}</el-tag>
                      <br/>
                      <el-tag style="margin-top: 5px"> {{ scope.row.reqIp }}</el-tag>
                    </div>
                    <div v-else-if="item.prop=='operationType'">
                      <el-tag v-if="scope.row.operationType === 'add'" type="success"> 新增</el-tag>
                      <el-tag v-else-if="scope.row.operationType === 'update'" type="warning"> 修改</el-tag>
                      <el-tag v-else-if="scope.row.operationType === 'delete'" type="danger"> 删除</el-tag>
                      <el-tag v-else> 其他</el-tag>

                    </div>
                    <div v-else-if="item.prop=='resultSuccess'">
                      <el-tag v-if="scope.row.resultSuccess" type="success"> 成功</el-tag>
                      <el-tag v-else type="danger"> {{ scope.row.reqResultMsg }}</el-tag>
                    </div>
                    <div v-else-if="item.prop=='logEnable'">
                      {{ scope.row.logEnable ? '是' : '否' }}
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
                        <el-link v-perms="['system:operationlog:detail']" type="primary"  icon="el-icon-edit" @click="onShow(scope.row)">{{ $i18n.t('详情') }}</el-link>
                      <span v-perms="['system:operationlog:del']" >
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


      <el-dialog
          v-if="dialogDetail"
          :title="$i18n.t('详情')"
          :visible.sync="dialogDetail"
          destroy-on-close
          ref="dialog"
      >
        <div style="height: 50vh;overflow: auto">
          <detail ref="rolePermition" :mdl="mdl"></detail>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogDetail = false">取 消</el-button>
          <el-button type="primary" @click="dialogPermisionComfim">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>
<script>
    import { PAGES_SIZE } from '@/config/constants'
    import { operationlogList,logDetail,deleteoperationlog } from '@/api/wt/system'
    import configs from '@/config'
    import detail from '@/components/xl/log/detail.vue'
    import SearchForm from '@/components/SearchForm'
    export default {
        name: 'AdminManage',
        components: { detail,SearchForm },
        computed: {
          formItems () {
            const statusOptions = [
              { label:  this.$i18n.t('全部'), value: '' },
              { label:  this.$i18n.t('增加'), value: 'add' },
              { label:  this.$i18n.t('删除'), value: 'delete' },
              { label:  this.$i18n.t('修改'), value: 'update' },
              { label:  this.$i18n.t('其他'), value: 'other' },
            ]
            const statusOptions1 = [
              { label: this.$i18n.t('全部'), value: '' },
              { label: this.$i18n.t('是'), value: '1' },
              { label:this.$i18n.t('否'), value: '0' }
            ]

            // 构建搜索表单
            return [
              { title: this.$i18n.t('类型'), type: 'select', key: 'operationType',options: statusOptions },
              { title: this.$i18n.t('是否成功'), type: 'select', key: 'resultSuccess',options: statusOptions1 },
              { title: this.$i18n.t('管理员'), type: 'input', key: 'operator' },
              { title: this.$i18n.t('t标题'), type: 'input', key: 'operationTitle' }
            ]
          }
        },
        data () {
            return {
                PAGES_SIZE,
                params: {},
                data: [],
                tableColumns:[
                  {
                    label:this.$i18n.t('操作人'),
                    prop:'operator',
                    isHeadShow:true,
                    width: 120
                  },
                {
                  label:this.$i18n.t('操作类型'),
                  prop:'operationType',
                  isHeadShow:true,
                  width: 100
                },
                {
                  label:this.$i18n.t('t标题'),
                  prop:'operationTitle',
                  isHeadShow:true,
                  width: 120
                },
                  {
                    label:this.$i18n.t('是否成功'),
                    prop:'resultSuccess',
                    isHeadShow:true,
                    width: 130
                  },
                {
                  label:this.$i18n.t('IP'),
                  prop:'ipSource',
                  isHeadShow:true,
                  width:180
                },
                  {
                    label:this.$i18n.t('记录日志'),
                    prop:'logEnable',
                    isHeadShow:true,
                    width:100
                  },
                  {
                    label:this.$i18n.t('请求时间'),
                    prop:'reqTimeStr',
                    isHeadShow:true,
                    width:180
                  },
                  {
                    label:this.$i18n.t('响应时间'),
                    prop:'respTimeStr',
                    isHeadShow:true,
                    width:180
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
                 dialogDetail: false,
                mdl: {},
                checkedIds: [],
                isShowPictures: false,
                picture: [],
                config: configs,

            }
        },
        created () {
          this.fetch()
        },
        methods: {
          // 删除
          onDelete (ids) {
            deleteoperationlog({ids:ids}).then(() => {
              this.$Message.success(this.$i18n.t('操作成功'))
              setTimeout(() => {
                this.fetch()
              }, 500)
            })
          },
            // 搜索按钮
            onSearch () {
              this.page.currentPage=1
              this.fetch()
            },
          onReset() {
            this.page.currentPage=1
            this.params={}
            this.fetch()
          },
            // 从接口拉取数据
            fetch () {
                this.loading = true
              operationlogList({ filter:this.params,page: {
                    page: this.page.currentPage,
                    size: this.page.perPage
                  }}).then((res) => {
                    const { operationLogs, total } = res.data
                    this.data = operationLogs
                    this.page.total = total
                    this.page.pageCount =operationLogs?operationLogs.length:0
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
            onShow(row){
              logDetail({id:row.id}).then((res)=>{
                this.mdl=res.data.operationLog||[]
                this.dialogDetail=true
              })

            },
            dialogPermisionComfim(){

              this.dialogDetail=false
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
