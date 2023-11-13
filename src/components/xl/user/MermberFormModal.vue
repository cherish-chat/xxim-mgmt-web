<template>
  <div class="body">
    <el-form :model="mdl" ref="ruleForm" label-width="100px">
      <el-form-item :label="$i18n.t('ID')" prop="username">
        <el-input
            v-model="mdl.id"
            :disabled="mdl.mode==='edit'"
            :placeholder="$i18n.t('请输入id')"
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

      <el-form-item :label="$i18n.t('手机')" prop="mobile">
        <el-input class="ls-input" v-model="mdl.mobile" :placeholder="$i18n.t('请输入手机号码')"/>
      </el-form-item>
      <el-form-item :label="$i18n.t('区号')" prop="mobileCountryCode">
        <el-input class="ls-input" v-model="mdl.mobileCountryCode" :placeholder="$i18n.t('请输入手机区号')"/>
      </el-form-item>

      <el-form-item :label="$i18n.t('昵称')" prop="nickname">
        <el-input class="ls-input" v-model="mdl.nickname" :placeholder="$i18n.t('请输入昵称')"/>
      </el-form-item>
<!--      <el-form-item label="头像" prop="avatar">
        <el-input class="ls-input" v-model="mdl.avatar" placeholder="请输入头像"/>
      </el-form-item>-->


      <el-form-item :label="$i18n.t('性别')" prop="xb">
        <!-- options: 0: 保密 1: 男 2:女 -->
        <el-select
            class="ls-input"
            v-model="mdl.xb"
            :placeholder="$i18n.t('请选择性别')"
            clearable
        >
          <el-option key="0" :label="$i18n.t('保密')" :value="0"/>
          <el-option key="1" :label="$i18n.t('男')" :value="1"/>
          <el-option key="2" :label="$i18n.t('女')" :value="2"/>
        </el-select>
      </el-form-item>
      <el-form-item :label="$i18n.t('角色')" prop="role">
        <!-- options: 0: 用户 1: 客服 2: 游客 -->
        <el-select
            class="ls-input"
            v-model="mdl.role"
            :placeholder="$i18n.t('请选择角色')"
            clearable
        >
          <el-option key="0" :label="$i18n.t('用户')" :value="0"/>
          <el-option key="1" :label="$i18n.t('客服')" :value="1"/>
          <el-option key="2" :label="$i18n.t('游客')" :value="2"/>
        </el-select>
      </el-form-item>
      <el-form-item :label="$i18n.t('备注')" prop="adminRemark">
        <el-input
            type="textarea"
            class="ls-input"
            v-model="mdl.adminRemark"
            :placeholder="$i18n.t('请输入后台备注')"
            clearable
        />
      </el-form-item>

      <!--密码 空表示不修改-->
      <el-form-item :label="$i18n.t('密码')" prop="password">
        <el-input
            class="ls-input"
            v-model="mdl.password"
            :placeholder="$i18n.t('留空表示不修改')"
            clearable
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
import {getRoleList, modelListAdd,upload,modelListUpdate } from '@/api/wt/system'
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
    // if (this.mdl.welcome_images.length>0) {
    //   this.mdl.welcome_images.map((item)=>{
    //     this.fileList.push({ name: item, url:  item })
    //   })
    // }
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
          let obj={label:'系统管理员',value:0}
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
      if (this.mdl.mode =='add') {
        modelListAdd({userModel:this.mdl,password:this.mdl.password}).then(() => {
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
        modelListUpdate({userModel:this.mdl,password:this.mdl.password}).then(() => {
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
