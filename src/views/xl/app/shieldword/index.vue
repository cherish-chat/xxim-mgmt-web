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
       <vab-query-form>
         <vab-query-form-left-panel :span="24">
           <el-button size="mini" v-perms="['app:shieldword:add']" type="primary" icon="el-icon-plus" @click="onAdd">
             {{$i18n.t('添加')}}
           </el-button>
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
                    <div v-if="item.prop=='userId'">
                      <el-tag > {{ scope.row.userId }}</el-tag>
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
                  <el-link v-perms="['system:ipwhitelist:edit']" type="primary" icon="el-icon-edit"
                           @click="onEDit(scope.row)">{{$i18n.t('编辑')}}
                  </el-link>
                  <span v-perms="['system:ipwhitelist:del']">
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

      <el-drawer
        :title="mdl.id > 0 ? $i18n.t('编辑') : $i18n.t('新增')"
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
    import { PAGES_SIZE } from '@/config/constants'
    import { shieldwordLists, logDetail, shieldwordDelete } from "@/api/wt/system";
    import configs from '@/config'
    import formModal from '@/components/xl/app/shield.vue'
    import SearchForm from '@/components/SearchForm'
    export default {
        name: 'AdminManage',
        components: { formModal,SearchForm },
      computed: {
        formItems () {
          // 构建搜索表单
          return [
            { title: this.$i18n.t('词语'), type: 'input', key: 'word' },
            { title:this.$i18n.t('创建时间'), type: 'el-date-picker', key: 'time' }
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
                    label:this.$i18n.t('ID'),
                    prop:'id',
                    isHeadShow:true
                  },
                  {
                    label:this.$i18n.t('词语'),
                    prop:'word',
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
          onAdd() {
            this.mdl = Object.assign({}, {
              id: "",
              word:""
            });
            this.drawer = true;
          },
          // 修改
          onEDit(row) {
            this.mdl = Object.assign({}, { ...row});
            this.drawer = true;
          },
          // 删除
          onDelete(ids) {
            shieldwordDelete({ ids: ids }).then(() => {
              this.$Message.success(this.$i18n.t("操作成功"));
              setTimeout(() => {
                this.fetch();
              }, 500);
            });
          },
          // 关闭抽屉方法
          handleCloseDrawer() {
            this.$refs.drawer.closeDrawer();
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
              shieldwordLists({ filter:obj,page: {
                    page: this.page.currentPage,
                    size: this.page.perPage
                  }}).then((res) => {
                    const { appMgmtShieldWords, total } = res.data
                    this.data = appMgmtShieldWords
                    this.page.total = total
                    this.page.pageCount =appMgmtShieldWords?appMgmtShieldWords.length:0
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
