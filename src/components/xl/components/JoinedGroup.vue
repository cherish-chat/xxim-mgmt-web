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
              <div v-if="item.prop=='creatorID'">
                <div>
                  {{scope.row['creatorID']}}|{{scope.row['creator_nickname']}}
                </div>
                <div>
                  {{$i18n.t('账号')}}：{{scope.row['creatorID']}}
                </div>

              </div>
              <div v-else-if="item.prop=='createdAt'">
                {{scope.row[item.prop]| formatDate}}
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
    </div>
  </div>
</template>

<script>
import { PAGES_SIZE } from '@/config/constants'
import SearchForm from '@/components/SearchForm'
import { friendGroupList } from '@/api/wt/system'
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
          label:this.$i18n.t('群ID'),
          prop:'groupId',
          isHeadShow:true
        },
        {
          label:this.$i18n.t('群名称'),
          prop:'name',
          isHeadShow:true
        },
        {
          label:this.$i18n.t('群人数'),
          prop:'memberCount',
          isHeadShow:true
        },
        {
          label:this.$i18n.t('加入时间'),
          prop:'joinTimeStr',
          isHeadShow:true
        },

        {
          label:this.$i18n.t('创建时间'),
          prop:'createTimeStr',
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
        { title: this.$i18n.t('账号'), type: 'input', key: 'id' },
        { title: this.$i18n.t('名称'), type: 'input', key: 'name' }
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
      this.fetch()
    },
    onReset(){
      this.params={}
      this.fetch()
    },
    // 从接口拉取数据
    fetch () {
      this.loading = true
      friendGroupList({
        filter:{
          userId:this.mdl.id,
          ...this.params
        },
        page:{
          page: this.page.currentPage,
          size: this.page.perPage
        },
        userId:this.mdl.id,
        }).then((res) => {
        // eslint-disable-next-line camelcase
        const { groupList, total } = res.data
        this.data = groupList
        this.page.total = total
        // eslint-disable-next-line camelcase
        this.page.pageCount = groupList?groupList.length:0
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
