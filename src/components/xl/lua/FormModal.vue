<template>
  <div class="body">
    <el-form :model="mdl" ref="ruleForm" label-width="100px">
      <el-form-item :label="$i18n.t('类型')" prop="type">
        <el-select
          style="width: 100%"
          v-model="mdl.type"
          class="flex-1"
          clearable
          :placeholder="$i18n.t('请选择角色')"
        >
          <el-option :label="$i18n.t('生成僵尸号信息')" :value="1"/>
        </el-select>
      </el-form-item>

      <el-form-item :label="$i18n.t('名称')" prop="name">
        <el-input
          class="ls-input"
          v-model="mdl.name"
          :placeholder="$i18n.t('请输入名称')"
          clearable
        />
      </el-form-item>
      <el-form-item :label="$i18n.t('描述')" prop="desc">
        <el-input
          type="textarea"
          class="ls-input"
          v-model="mdl.desc"
          :placeholder="$i18n.t('请输入描述')"
          clearable
        />
      </el-form-item>
      <el-form-item :label="$i18n.t('启用')">
        <el-switch
          v-model="mdl.enable"
          :active-value="true"
          :inactive-value="false"
        />
      </el-form-item>

      <el-form-item :label="$i18n.t('代码')">
        <el-input
          type="textarea"
          class="ls-input"
          v-model="mdl.code"
          :autosize="{ minRows: 10, maxRows: 4}"
          :placeholder="$i18n.t('请输入代码')"
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
import { luaconfigAdd,upload,luaconfigEdit } from '@/api/wt/system'
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
        luaconfigAdd({luaConfig:this.mdl}).then(() => {
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
        luaconfigEdit({luaConfig:this.mdl}).then(() => {
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
        this.mdl.avatar=res.data.url
        request.onSuccess(res.data)
      }).catch((error) => {
        request.onError(error)
      })
    },
    handleChange(file, fileList){
      this.fileList = fileList.slice(-1);
    },
    handleImagePreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleImageRemove (file,fileList) {
        this.fileList=fileList
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
  ::v-deep.el-upload-list--picture-card .el-upload-list__item .el-icon-check{
    position: absolute!important;
    left: 12px;
    bottom: 1px;
  }
}
</style>
