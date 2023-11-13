<template>
  <div class="body">
    <el-form :model="mdl" ref="ruleForm" label-width="100px">

      <el-form-item  :label="$i18n.t('ID')" prop="id">
        <el-input style="width: 100%"  class="ls-input" v-model="mdl.id" disabled/>
      </el-form-item>
      <el-form-item :label="$i18n.t('余额')" prop="balance">
        <el-input-number style="width: 100%" class="ls-input" v-model="mdl.balance" disabled/>
      </el-form-item>
      <el-form-item :label="$i18n.t('冻结')" prop="frozenBalance">
        <el-input-number style="width: 100%" class="ls-input" v-model="mdl.freezeBalance" disabled/>
      </el-form-item>
      <el-form-item :label="$i18n.t('充值')" prop="recharge">
        <el-input-number style="width: 100%" class="ls-input" v-model="mdl.amount"/>
      </el-form-item>




      <el-form-item>
        <el-button size="mini" @click="submitForm" type="primary" :loading="submitLogin" :disabled="btnDisable">{{ $i18n.t('确定') }}</el-button>
        <el-button size="mini" @click="handleCloseDrawer">{{ $i18n.t('取消') }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { rechargeWallet, walletDetail } from "@/api/wt/system";
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
      this.getWalletDetail()
  },
  methods: {
    getWalletDetail(){
      walletDetail({userId:this.mdl.id}).then((res)=>{
        const { userWallet } = res.data
        this.mdl.balance=userWallet.balance
        this.mdl.freezeBalance=userWallet.freezeBalance
      })
    },
    submitForm () {
      if (this.mdl.amount == 0 ) {
        this.$Message.success(this.$i18n.t('请输入充值金额'))
        return
      }
      this.submitLogin = true
      rechargeWallet({userId:this.mdl.id,amount:this.mdl.amount}).then(() => {
        // 关闭抽屉
        this.handleCloseDrawer()
        this.$Message.success(this.$i18n.t('操作成功'))
        // 调用爷爷组件刷新数据
        this.$parent.$parent.fetch()
      }).catch((error) => {
      }).finally(() => {
        this.submitLogin = false
      })
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
