<template>
  <div class="body">
    <el-form :model="mdl" ref="ruleForm" label-width="100px">
      <el-form-item :label="$i18n.t('提示')" prop="title">
       <div style="color: red"> {{$i18n.t('更改api后需要重启服务器才能生效')}}</div>
      </el-form-item>
      <el-form-item :label="$i18n.t('标题')" prop="title">
        <el-input
            v-model="mdl.title"
            :placeholder="$i18n.t('请输入标题')"
            clearable
        />
      </el-form-item>

      <el-form-item :label="$i18n.t('路径')" prop="path">
        <el-input
            v-model="mdl.path"
            :placeholder="$i18n.t('请输入路径')"
            clearable
        />
      </el-form-item>



      <el-form-item :label="$i18n.t('日志')">
        <el-switch
            v-model="mdl.logEnable"
            :active-value="true"
            :inactive-value="false"
        />
      </el-form-item>

      <el-form-item>
        <el-button size="mini" @click="submitForm" type="primary" :loading="submitLogin" :disabled="btnDisable">{{ $i18n.t('确定') }}</el-button>
        <el-button size="mini" @click="handleCloseDrawer">{{ $i18n.t('取消') }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { addApi,upload,apiPathEdit } from '@/api/wt/system'
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
      submitLogin: false,
      btnDisable: true,
      dialogVisible: false,
      dialogImageUrl: '',
      fileList: [],
      roleOptions:[]
    }
  },
  created () {

  },
  methods: {
    submitForm () {
      this.submitLogin = true
      if (this.mdl.id =='') {
        addApi({apiPath:this.mdl}).then(() => {
          // 关闭抽屉
          this.handleCloseDrawer()
          this.$Message.success(this.$i18n.t('操作成功'))
          // 调用爷爷组件刷新数据
          this.$parent.$parent.fetch()
        }).catch((error) => {
        }).finally(() => {
          this.submitLogin = false
        })
      } else {
        apiPathEdit({apiPath:this.mdl}).then(() => {
          // 关闭抽屉
          this.handleCloseDrawer()
          this.$Message.success(this.$i18n.t('操作成功'))
          // 调用爷爷组件刷新数据
          this.$parent.$parent.fetch()
        }).catch((error) => {
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
