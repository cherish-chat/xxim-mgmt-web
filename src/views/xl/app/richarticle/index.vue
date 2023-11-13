<template>
  <div class="admin-container">

    <el-card class="content-container" shadow="never">
      <vab-query-form>
        <vab-query-form-left-panel :span="24">
          <el-button v-perms="['app:richarticle:add']" size="mini" type="primary" icon="el-icon-plus" @click="onAdd">{{$i18n.t('添加')}}</el-button>
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
              <div v-if="item.prop=='coverUrl'">
                <el-avatar :size="50" :src="scope.row[item.prop]"></el-avatar>
              </div>
              <div v-else-if="item.prop=='isEnable'">
                <el-switch
                  v-model="scope.row.isEnable"
                  disabled
                />
              </div>
              <div v-else-if="item.prop=='position'">
                <el-tag v-if="scope.row.position === 0" type="info">开屏页</el-tag>
                <el-tag v-else-if="scope.row.position === 1" type="info">首页弹窗</el-tag>
                <el-tag v-else type="danger">飘屏</el-tag>
              </div>
              <div v-else-if="item.prop=='platform'">
                <el-tag v-if="scope.row.platform !== ''" type="success">{{ scope.row.platform }}</el-tag>
                <el-tag v-else type="danger">全部</el-tag>
              </div>
              <div v-else-if="item.prop=='startTime'">
                 {{getStartTime(scope.row.startTime,scope.row.endTime)}}
              </div>
              <div v-else>
                {{scope.row[item.prop]}}
              </div>
            </template>
          </el-table-column>
        </template>

        <!-- 右侧按钮 -->
        <el-table-column align="center" :label="$i18n.t('操作')" fixed="right" :width="250">
          <template slot-scope="scope">
            <el-link    v-perms="['app:richarticle:detail']"  type="primary"  icon="el-icon-edit" @click="onView(scope.row.url)">{{$i18n.t('预览')}}</el-link>
            <el-divider direction="vertical"></el-divider>
            <el-link    v-perms="['app:richarticle:edit']"  type="primary"  icon="el-icon-edit" @click="onEDit(scope.row)">{{$i18n.t('编辑')}}</el-link>
            <span  >
                            <el-divider direction="vertical"></el-divider>
                            <el-popconfirm
                              confirm
                              :title="$i18n.t('确定删除')"
                              @confirm="onDelete([scope.row.id])"
                              :ok-text="$i18n.t('确定')"
                              :cancel-text="$i18n.t('取消')"
                            >
                                <el-link slot="reference"      v-perms="['app:richarticle:del']"  type="danger" icon="el-icon-delete">{{$i18n.t('删除')}}</el-link>
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
      v-if="dialog"
      :title="mdl.id!='' ? $i18n.t('编辑') : $i18n.t('新增')"
      :visible.sync="dialog"
      destroy-on-close
      append-to-body
      ref="dialog"
     class="rich-dialog"
    >
      <div style="min-height: 50vh;overflow: auto">
        <el-form
          class="ls-form"
          ref="formRef"
          :model="mdl"
          label-width="60px"
        >
          <el-form-item :label="$i18n.t('标题')" prop="title">
            <el-input class="ls-input" v-model="mdl.title" :placeholder="$i18n.t('请输入标题')" clearable/>
          </el-form-item>
          <el-form-item :label="$i18n.t('内容')" prop="content">
            <quill-editor ref="text" v-model="mdl.content"  style="height: 400px" class="myQuillEditor" :options="editorOption" />
          </el-form-item>
          <el-form-item style="margin-top: 100px" :label="$i18n.t('排序')" prop="sort">
            <el-input-number
              class="ls-input"
              v-model="mdl.sort"
              :min="0"
              :max="100"
              :step="1"
              :placeholder="$i18n.t('请输入排序')"
            />
          </el-form-item>
          <el-form-item :label="$i18n.t('启用')" prop="isEnable">
            <el-switch
              v-model="mdl.isEnable"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </el-form-item>
          <el-form-item :label="$i18n.t('类型')" prop="contentType">
            <el-select v-model="mdl.contentType">
              <el-option label="html" value="text/html"/>
            </el-select>
          </el-form-item>
          <el-form-item :label="$i18n.t('图片')" >
            <el-upload
              class="pic-select"
              action=""
              list-type="picture-card"
              :on-preview="handleImagePreview"
              :http-request="HttpRequest"
              :file-list="fileList"
              :on-change="handleChange"
              :on-remove="handleImageRemove"
            >
              <i class="el-icon-plus" />
            </el-upload>
            <el-dialog :visible.sync="dialogVisible" :append-to-body="true">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </el-form-item>
        </el-form>

      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog = false">{{$i18n.t('取消')}}</el-button>
        <el-button type="primary" @click="dialogComfim">{{$i18n.t('确定')}}</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import { PAGES_SIZE } from '@/config/constants'
import { richarticleLists, richarticleDelete, richarticleAdd, richarticleEdit, upload } from "@/api/wt/system";
import configs from '@/config'
import  {parseTime} from '@/utils'
import quillConfig from '@/config/quill-config'
import { quillEditor } from 'vue-quill-editor'
export default {
  name: 'AdminManage',
  components: { quillEditor },
  data () {
    return {
      PAGES_SIZE,
      editorOption: quillConfig,
      params: {},
      data: [],
      tableColumns:[
        {
          label:"ID",
          prop:'id',
          isHeadShow:true
        },
        {
          label:this.$i18n.t('内容'),
          prop:'content',
          isHeadShow:true
        },
        {
          label:this.$i18n.t('图片'),
          prop:'coverUrl',
          isHeadShow:true
        },
        {
          label:this.$i18n.t('排序'),
          prop:'sort',
          isHeadShow:true
        },
        {
          label:this.$i18n.t('启用'),
          prop:'isEnable',
          isHeadShow:true
        },
        {
          label:this.$i18n.t('更新时间'),
          prop:'updatedAtStr',
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
      dialog: false,
      dialogTableVisible: false,
      mdl: {},
      checkedIds: [],
      isShowPictures: false,
      picture: [],
      config: configs,
      dialogVisible: false,
      dialogImageUrl: '',
      fileList: [],
    }
  },
  created () {
    this.fetch()
  },
  computed: {
    isShowDivider () {
      const { meta } = this.$store.getters.router
      return meta.actions.indexOf('update') > -1 && meta.actions.indexOf('delete') > -1
    }
  },
  methods: {
    handleImagePreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    HttpRequest (request) {
      const params = new FormData()
      params.append('file', request.file)
      upload(params).then((res) => {
        this.mdl.coverUrl=res.data.url
        request.onSuccess(res.data)
      }).catch((error) => {
        request.onError(error)
      })
    },
    handleChange(file, fileList){
      this.fileList = fileList.slice(-1);
    },
    handleImageRemove (file,fileList) {
      this.fileList=fileList
    },
    getStartTime(startTime,endTime){
      return parseTime(startTime)+"-"+parseTime(endTime)
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
    // 从接口拉取数据
    fetch () {
      this.loading = true
      richarticleLists({ filter:this.params,page: {
          page: this.page.currentPage,
          size: this.page.perPage
        }}).then((res) => {
        const { appMgmtRichArticles, count } = res.data
        this.data = appMgmtRichArticles
        this.page.total = count
        this.page.pageCount =appMgmtRichArticles?appMgmtRichArticles.length:0
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
    // 选中的ID
    handleSelectionChange (rows) {
      this.checkedIds = rows.map(item => item.id)
    },
    // 删除
    onDelete (ids) {
      richarticleDelete({ids:ids}).then(() => {
        this.$Message.success(this.$i18n.t('操作成功'))
        setTimeout(() => {
          this.fetch()
        }, 500)
      })
    },
    onView(url){
      window.open(url, '_blank')
    },
    // 修改
    onEDit (row) {
      this.mdl = Object.assign({}, {...row,time:[new Date(row.startTime),new Date(row.endTime)]})
      if (this.mdl.coverUrl) {
        this.fileList.push({ name: "", url:  this.mdl.coverUrl })
      }
      this.dialog = true
    },
    // 添加会员等级
    onAdd () {
      this.mdl = Object.assign({}, {
        id: "",
        contentType: 'text/html',
        title:"",
        content: '',
        sort: 0,
        isEnable: true,
        coverUrl:''
      })
      this.fileList=[]
      this.dialog = true
    },
    dialogComfim(){
      if(this.mdl.id==''){

        richarticleAdd({appMgmtRichArticle:this.mdl}).then(() => {
          this.$Message.success(this.$i18n.t('操作成功'))
          // 调用爷爷组件刷新数据
          this.fetch()
        }).catch((error) => {
        }).finally(() => {
          this.dialog=false
        })

      }else{
        richarticleEdit({appMgmtRichArticle:this.mdl}).then(() => {
          this.$Message.success(this.$i18n.t('操作成功'))
          // 调用爷爷组件刷新数据
          this.fetch()
        }).catch((error) => {
        }).finally(() => {
          this.dialog=false
        })

      }
    },
  }
}
</script>

<style lang="scss" scoped>
.top-tip{
  list-style: none;
  margin-bottom: 10px;
}
</style>
<style lang="scss">
.rich-dialog{
  .el-dialog{
    width: 70%;
  }
}
</style>
