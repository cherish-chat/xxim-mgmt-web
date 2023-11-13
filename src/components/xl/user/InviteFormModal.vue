<template>
  <div class="body">
    <el-form :model="mdl" ref="ruleForm" label-width="100px">
      <el-form-item :label="$i18n.t('邀请码')" prop="code">
        <el-input
            class="ls-input"
            v-model="mdl.code"
            :placeholder="$i18n.t('请输入邀请码')"
            clearable
            :disabled="mdl.mode==='edit'"
        />
      </el-form-item>
      <el-form-item :label="$i18n.t('备注')" prop="remark">
        <el-input
            type="textarea"
            class="ls-input"
            v-model="mdl.remark"
            :placeholder="$i18n.t('请输入备注')"
            clearable
        />
      </el-form-item>
      <el-form-item :label="$i18n.t('开启')" prop="isEnable">
        <!-- options -->
        <el-select
            class="ls-input"
            v-model="mdl.isEnable"
            :placeholder="$i18n.t('请选择是否开启')"
            clearable
        >
          <el-option key="1" :label="$i18n.t('开启')" :value="true"/>
          <el-option key="0" :label="$i18n.t('关闭')" :value="false"/>
        </el-select>
      </el-form-item>
      <el-form-item :label="$i18n.t('模式')" prop="isEnable">
      <!-- options -->
      <el-select
          class="ls-input"
          v-model="mdl.defaultConvMode"
          :placeholder="$i18n.t('请选择预设会话模式')"
          clearable
      >
        <el-option key="0" :label="$i18n.t('添加所有预设会话')" :value="0"/>
        <el-option key="1" :label="$i18n.t('只添加一个会话(轮询)')" :value="1"/>
        <el-option key="2" :label="$i18n.t('只添加一个会话(随机)')" :value="2"/>
        <el-option key="3" :label="$i18n.t('不添加会话')" :value="3"/>
      </el-select>
    </el-form-item>



      <el-form-item>
        <el-button size="mini" @click="submitForm" type="primary" :loading="submitLogin" :disabled="btnDisable">{{ $i18n.t('确定') }}</el-button>
        <el-button size="mini" @click="handleCloseDrawer">{{ $i18n.t('取消') }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {invitationcodeAdd,upload,invitationcodeUpdate } from '@/api/wt/system'
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
      console.log("=========xxx",this.mdl)
      if (this.mdl.id =='') {
        invitationcodeAdd({userInvitationCode:this.mdl}).then(() => {
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
        invitationcodeUpdate({userInvitationCode:this.mdl}).then(() => {
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
