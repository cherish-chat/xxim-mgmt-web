<template>
  <div class="body">
    <el-form :model="mdl" ref="ruleForm" label-width="100px">
      <el-form-item :label="$i18n.t('账号')" prop="username">
        <el-input
            v-model="mdl.username"
            :disabled="mdl.isRoot"
            :placeholder="$i18n.t('请输入账号')"
            clearable
        />
      </el-form-item>


      <el-form-item :label="$i18n.t('头像')" >
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


      <el-form-item :label="$i18n.t('名称')" prop="nickname">
        <el-input
            v-model="mdl.nickname"
            :placeholder="$i18n.t('请输入名称')"
            clearable
        />
      </el-form-item>


      <el-form-item :label="$i18n.t('角色')" prop="role">
        <el-select
            style="width: 100%"
            v-model="mdl.role"
            :disabled="mdl.isRoot"
            class="flex-1"
            clearable
            :placeholder="$i18n.t('请选择角色')"
        >
          <el-option v-if="mdl.isRoot" :label="$i18n.t('系统管理员')" :value="0"/>
          <el-option
              v-for="(item, index) in roleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="$i18n.t('密码')" prop="password">
        <el-input
            v-model.trim="mdl.password"
            show-password
            clearable
            autocomplete="new-password"
            :placeholder="$i18n.t('请输入密码')"
        />
      </el-form-item>

      <el-form-item :label="$i18n.t('确认密码')" prop="passwordConfirm">
        <el-input
            v-model.trim="mdl.passwordConfirm"
            show-password
            clearable
            :placeholder="$i18n.t('请输入确认密码')"
        />
      </el-form-item>

      <el-form-item :label="$i18n.t('管理员状态')" v-if="!mdl.isRoot">
        <el-switch
            v-model="mdl.isDisable"
            :active-value="false"
            :inactive-value="true"
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
import {getRoleList, insertAdmin,upload,updateAdmin } from '@/api/wt/system'
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
    if (this.mdl.avatar) {
      this.fileList.push({ name: "", url:  this.mdl.avatar })
    }
    this.getRoleListData()
  },
  methods: {
    getRoleListData(){
      getRoleList({ }).then((res) => {
        const { roles, count } = res.data
        if(this.mdl.isRoot){
          let obj={label:this.$i18n.t('系统管理员'),value:0}
          this.roleOptions.push(obj)
        }
        if(roles){
          roles.map((item)=>{
            let obj={label:item.name,value:item.id}
            this.roleOptions.push(obj)
          })
        }
      })
    },
    submitForm () {
      this.submitLogin = true
      if (this.mdl.id =='') {
        insertAdmin({user:this.mdl}).then(() => {
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
        updateAdmin({user:this.mdl}).then(() => {
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
