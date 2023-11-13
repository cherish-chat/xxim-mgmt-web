<template>
  <div class="login-log-container">


  <el-card class="query-container" shadow="never">
        <vab-query-form>
        <vab-query-form-left-panel :span="24">
          <search-form :items="formItems" :params="params" :on-reset="onReset" :on-submit="onSearch" :btn-loading="loading" >
        </search-form>
        </vab-query-form-left-panel>
        </vab-query-form>
    </el-card>

     <el-card class="content-container" shadow="never">
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
              <div v-if="item.prop=='userId'">
                <el-tag> {{ scope.row.userId }}</el-tag>
              </div>
              <div v-else-if="item.prop=='ip'">
                <div>
                  <el-tag type="info"> {{ scope.row.ip }}</el-tag>
                </div>
                <div>
                  <el-tag type="success"> {{ scope.row.ipCountry }} - {{ scope.row.ipProvince }} - {{ scope.row.ipCity }} - {{ scope.row.ipISP }}</el-tag>
                </div>
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
  </div>
</template>
<script>
import { PAGES_SIZE } from '@/config/constants'
import { loginrecordList, deleteoperationlog } from '@/api/wt/system'
import SearchForm from '@/components/SearchForm'
export default {
  name: 'LoginRecord',
  components: { SearchForm },
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
          isHeadShow:true
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
      dialogTableVisible: false,
      mdl: {},
    }
  },
  created () {
    this.fetch()
  },
  computed: {
    formItems () {
      // 构建搜索表单
      return [
        { title:this.$i18n.t('请求时间'), type: 'el-date-picker', key: 'time' },
        { title: this.$i18n.t('管理员'), type: 'input', key: 'userId' },
        { title: this.$i18n.t('IP'), type: 'input', key: 'ip' }
      ]
    }
  },
  methods: {
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
    // 从接口拉取数据
    fetch () {
      this.loading = true
      if(this.params.time){
        this.params.time_gte=new Date(this.params.time[0]).getTime().toString()
        this.params.time_lte=new Date(this.params.time[1]).getTime().toString()
      }
      let obj={...this.params}
      delete obj.time
      loginrecordList({ filter:obj,page: {
          page: this.page.currentPage,
          size: this.page.perPage
        }}).then((res) => {
        const { loginRecordList, total } = res.data
        this.data = loginRecordList
        this.page.total = total
        this.page.pageCount =loginRecordList?loginRecordList.length:0
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
