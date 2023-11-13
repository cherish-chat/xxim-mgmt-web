<template>
    <div>
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
                    <div v-if="item.prop=='userId'">
                      <el-tag > {{ scope.row.userId }}</el-tag>
                    </div>
                    <div v-else>
                      {{scope.row[item.prop]}}
                    </div>
                  </template>
                </el-table-column>
              </template>

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
          <el-button @click="dialogDetail = false">{{$i18n.t('取消')}}</el-button>
          <el-button type="primary" @click="dialogPermisionComfim">{{$i18n.t('确定')}}</el-button>
        </div>
      </el-dialog>
    </div>
</template>
<script>
    import { PAGES_SIZE } from '@/config/constants'
    import { loginlogList,logDetail } from '@/api/wt/system'
    import configs from '@/config'
    import detail from '@/components/xl/log/detail.vue'
    import SearchForm from '@/components/SearchForm'
    export default {
        name: 'AdminManage',
        components: { detail,SearchForm },
      computed: {
        formItems () {
          // 构建搜索表单
          return [
            { title:this.$i18n.t('请求时间'), type: 'el-date-picker', key: 'time' },
            { title: this.$i18n.t('管理员'), type: 'input', key: 'userId' },
            { title: this.$i18n.t('IP'), type: 'input', key: 'ip' }
          ]
        },
        isShowDivider () {
          const { meta } = this.$store.getters.router
          return meta.actions.indexOf('update') > -1 && meta.actions.indexOf('delete') > -1
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
                    prop:'userId',
                    isHeadShow:true
                  },
                {
                  label:this.$i18n.t('IP'),
                  prop:'ip',
                  isHeadShow:true
                },
                {
                  label:this.$i18n.t('标识'),
                  prop:'userAgent',
                  isHeadShow:true,
                },
                  {
                    label:this.$i18n.t('请求时间'),
                    prop:'timeStr',
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
              if(this.params.time){
                this.params.time_gte=new Date(this.params.time[0]).getTime().toString()
                this.params.time_lte=new Date(this.params.time[1]).getTime().toString()
              }else{
                delete this.params.time_gte
                delete this.params.time_lte
              }
              let obj={...this.params}
              delete obj.time
              loginlogList({ filter:obj,page: {
                    page: this.page.currentPage,
                    size: this.page.perPage
                  }}).then((res) => {
                    const { loginRecords, total } = res.data
                    this.data = loginRecords
                    this.page.total = total
                    this.page.pageCount =loginRecords?loginRecords.length:0
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
