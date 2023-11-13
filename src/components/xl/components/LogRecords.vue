<template>
    <div class="body">
      <!-- 搜索组件 -->
      <search-form :items="formItems" :params="params" :on-reset="onReset" :on-submit="onSearch" :btn-loading="loading" />
      <!-- 表格区域 -->
      <div class="table-body">
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
                {{scope.row[item.prop]}}
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
      </div>
    </div>
</template>
<script>


    import { PAGES_SIZE } from '@/config/constants'
    import SearchForm from '@/components/SearchForm'
    import { getMemberActionLogList } from '@/api/wt/system'
    export default {
        name: 'LogRecords',
      components:{
        SearchForm
      },
        props: {
            mdl: {
                type: Object,
                required: true
            }
        },
        watch: {
            mdl: {
                handler (newVal) {
                    this.btnDisable = false
                },
                deep: true
            }
        },
        data () {
        return {
          PAGES_SIZE,
          params:{},
          loading:false,
          data:[],
          page: {
            total: 0,
            currentPage: 1,
            perPage: 5,
            pageCount: 1
          },
          tableColumns:[
            {
              label:this.$i18n.t('用户ID'),
              prop:'userId',
              isHeadShow:true
            },
            {
              label:this.$i18n.t('访问类型'),
              prop:'method',
              isHeadShow:true
            },
            {
              label:this.$i18n.t('访问地址'),
              prop:'url',
              isHeadShow:true
            },
            {
              label:this.$i18n.t('操作内容'),
              prop:'reqBody',
              isHeadShow:true
            },
            {
              label:this.$i18n.t('操作IP'),
              prop:'host',
              isHeadShow:true
            },
            {
              label:this.$i18n.t('操作时间'),
              prop:'timeFormat',
              isHeadShow:true
            }
          ],
          chatRecord:false
        }
      },
        computed: {
        formItems () {
          // 构建搜索表单
          return [
            { title: this.$i18n.t('操作内容'), type: 'input', key: 'account' },
            { title: this.$i18n.t('操作IP'), type: 'input', key: 'ip' },
            { title: this.$i18n.t('操作时间'), type: 'el-date-picker', key: 'ip' }
          ]
        },
        isShowDivider () {
          const { meta } = this.$store.getters.router
          return meta.actions.indexOf('update') > -1 && meta.actions.indexOf('delete') > -1
        }
      },
        created () {
          this.fetch()
        },
        methods: {
          onShowChatRecord(){
            this.chatRecord=true
          },
          onSearch(){

          },
          onReset(){
            this.params={}
          },
          // 从接口拉取数据
          fetch () {
            this.loading = true
            getMemberActionLogList({ id:this.mdl.id, offset: (this.page.currentPage-1)*this.page.perPage, limit: this.page.perPage }).then((res) => {
              // eslint-disable-next-line camelcase
              const { rows, total } = res.data
              this.data = rows
              this.page.total = total
              this.page.pageCount = rows?rows.length:0
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
            submitForm () {
                // 先清空表单错误提示
                this.errors = {}
                this.submitLogin = true
                // 设置手动接管message提示
                this.$store.dispatch('MessageTake', true)
                this.errorMessage = ''
                if (this.mdl.id === 0) {
                   /* createUserLevel(this.mdl).then(() => {
                        // 关闭抽屉
                        this.handleCloseDrawer()
                        this.$Message.success(this.$i18n.t('操作成功'))
                        // 调用爷爷组件刷新数据
                        this.$parent.$parent.fetch()
                    }).catch((error) => {
                        // 后端过来的表单错误回显
                        this.errors = Object.assign({}, { ...this.errors, ...error.errors })
                        // 手动处理错误
                        if (!error.errors) {
                            this.errorMessage = error.message
                        }
                    }).finally(() => {
                        this.submitLogin = false
                    })*/
                } else {
                    /*editUserlevel(this.mdl.id, this.mdl).then(() => {
                        // 关闭抽屉
                        this.handleCloseDrawer()
                        this.$Message.success(this.$i18n.t('操作成功'))
                        // 调用爷爷组件刷新数据
                        this.$parent.$parent.fetch()
                    }).catch((error) => {
                        // 后端过来的表单错误回显
                        this.errors = Object.assign({}, { ...this.errors, ...error.errors })
                        // 手动处理错误
                        if (!error.errors) {
                            this.errorMessage = error.message
                        }
                    }).finally(() => {
                        this.submitLogin = false
                    })*/
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
    .body {
        padding-right: 25px;
        width: 100%;
    }
    ::v-deep.el-checkbox__label {
        font-size: 12px;
    }
    .pic-select{
      ::v-deep.el-upload--picture-card{
        width:100px;
        height:100px;
        line-height: 100px;
      }
      ::v-deep.el-upload-list--picture-card .el-upload-list__item{
        width:100px;
        height:100px;
        line-height: 100px;
      }
    }
</style>
