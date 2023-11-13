<template>
  <div class="body">
    <el-form :model="mdl" ref="ruleForm" label-width="100px">


      <el-form-item :label="$i18n.t('类型')" required :error="errors.type">
        <el-select v-model="mdl.convType" :value="mdl.convType">
          <el-option v-for="(option, index) in typeshengjiOptions" :label="option.label" :value="option.value" :key="index"></el-option>
        </el-select>
      </el-form-item>


      <el-form-item :label="$i18n.t('过滤')" required :error="errors.type">
        <el-select v-model="mdl.filterType" :value="mdl.filterType">
          <el-option v-for="(option, index) in typeOptions" :label="option.label" :value="option.value" :key="index"></el-option>
        </el-select>
      </el-form-item>


      <el-form-item  :label="$i18n.t('邀请码')" required :error="errors.level">
        <el-input   v-model="mdl.invitationCode"  :placeholder="$i18n.t('PLEASE_INPUT', { value: '请输入邀请码' })" ></el-input>
      </el-form-item>



      <el-form-item   :label="$i18n.t('会话')" required :error="errors.level">
        <el-input   v-model="mdl.convId"  :placeholder="$i18n.t('请输入好友/群聊id')" ></el-input>
      </el-form-item>

      <el-form-item   :label="$i18n.t('打招呼')" required :error="errors.level">
        <el-input   v-model="mdl.textMsg"  :placeholder="$i18n.t('请输入打招呼')" ></el-input>
      </el-form-item>


      <el-form-item :error="errors.submit">
        <el-button size="mini" @click="submitForm" type="primary" :loading="submitLogin" :disabled="btnDisable">{{ $i18n.t('确定') }}</el-button>
        <el-button size="mini" @click="handleCloseDrawer">{{ $i18n.t('取消') }}</el-button>
      </el-form-item>
      <el-form-item v-if="errorMessage !== ''">
        <Alert type="error" show-icon>{{ errorMessage }}</Alert>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { defaultconvAdd, defaultconvEdit,upload } from '@/api/wt/system'


export default {
  name: 'formModal',
  props: {
    mdl: {
      type: Object,
      required: true
    },
    handleCloseDrawer: {
      type: Function,
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
      // 启用状态
      typeOptions: [
        { label: this.$i18n.t('所有新注册的用户'), value: 0 },
        { label: this.$i18n.t('使用邀请码注册的用户'), value: 1 }
      ],
      //升级状态
      typeshengjiOptions: [
        { label: this.$i18n.t('好友'), value: 0 },
        { label: this.$i18n.t('群'), value: 1 }
      ],
      //禁用状态
      typejinyongOptions: [
        { label: this.$i18n.t('是'), value: 0 },
        { label: this.$i18n.t('否'), value: 1 }
      ],
      rules: {},
      errors: {
        name: '',
        title: '',
        group: '',
        type: '',
        tips: '',
        format: ''
      },
      submitLogin: false,
      btnDisable: true,
      errorMessage: '',
      attributeVisible: false,
      dialogVisible: false,
      dialogImageUrl: '',
      fileList: [],
      fileListVedio: [],
    }
  },
  created () {
    // if (this.mdl.welcome_images.length>0) {
    //   this.mdl.welcome_images.map((item)=>{
    //     this.fileList.push({ name: item, url:  item })
    //   })
    //   console.log("====fileList",this.fileList)
    // }

    // if (this.mdl.welcome_videos !== '') {
    //   this.fileList = [{ name: this.mdl.welcome_videos, url:  this.mdl.welcome_videos }]
    // }
  },
  methods: {
    submitForm () {
      // 先清空表单错误提示
      this.errors = {}
      this.submitLogin = true
      // 设置手动接管message提示
      this.errorMessage = ''
      if (this.mdl.id =='') {

        defaultconvAdd({userDefaultConv:this.mdl}).then(() => {
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
        })
      } else {
        console.log("=================")
        defaultconvEdit({userDefaultConv:this.mdl}).then(() => {
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
        })
      }
    },
    HttpRequest (request) {
      const params = new FormData()
      params.append('file', request.file)
      upload(params).then((res) => {
        this.fileList.push({name:res.data.url,url:res.data.url})
        request.onSuccess(res.data)
      }).catch((error) => {
        request.onError(error)
      })
    },
    HttpRequestVadio (request) {
      const params = new FormData()
      params.append('file', request.file)
      upload(params).then((res) => {
        this.mdl.welcome_videos.push(res.data.url)
        request.onSuccess(res.data)
      }).catch((error) => {
        request.onError(error)
      })
    },
    handleImagePreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleImageRemove () {

    },
    handleImageRemoveVadio () {
      this.mdl.welcome_videos = ''
    },
    deleteVadio(e,index){
      this.mdl.welcome_videos.splice(index,1)
      e.stopPropagation()
    }
  }
}
</script>

<style>
.el-drawer.rtl{
  overflow: scroll;
}
</style>
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
