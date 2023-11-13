<template>
  <div class="body">
    <el-form :model="mdl" ref="ruleForm" label-width="100px">

      <el-form-item :label="$i18n.t('位置')" prop="allMute">
        <el-select v-model="mdl.position"
                   :placeholder="$i18n.t('请选择位置')" style="width: 100%">
          <el-option key="0" :label="$i18n.t('飘屏')" :value="0"/>
          <el-option key="1" :label="$i18n.t('开屏页')" :value="1"/>
          <el-option key="2" :label="$i18n.t('首页弹窗')" :value="2"/>
        </el-select>
      </el-form-item>

      <el-form-item :label="$i18n.t('平台')" prop="platform">
        <!-- options: 全部, 安卓, IOS, Windows, Mac, Linux -->
        <el-select
          class="ls-input"
          v-model="mdl.platform"
          :placeholder="$i18n.t('请选择更新平台')"
          clearable
          style="width: 100%"
        >
          <el-option key="" :label="$i18n.t('全部')" value=""/>
          <el-option key="android" :label="$i18n.t('安卓')" value="android"/>
          <el-option key="ios" :label="$i18n.t('IOS')" value="ios"/>
          <el-option key="windows" :label="$i18n.t('Windows')" value="windows"/>
          <el-option key="mac" :label="$i18n.t('Mac')" value="mac"/>
          <el-option key="linux" :label="$i18n.t('Linux')" value="linux"/>
        </el-select>
      </el-form-item>

      <el-form-item :label="$i18n.t('标题')" prop="title">
        <el-input
          v-model="mdl.title"
          :placeholder="$i18n.t('请输入标题')"
          clearable
        />
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

      <el-form-item :label="$i18n.t('内容')" prop="nickname">
        <el-input
          v-model="mdl.content"
          :placeholder="$i18n.t('请输入内容')"
          clearable
        />
      </el-form-item>

      <el-form-item :label="$i18n.t('排序')" prop="nickname">
        <el-input-number
          v-model="mdl.sort"
          :placeholder="$i18n.t('请输入排序')"
          clearable
        />
      </el-form-item>

      <el-form-item :label="$i18n.t('启用')" v-if="!mdl.isRoot">
        <el-switch
          v-model="mdl.isEnable"
        />
      </el-form-item>

      <el-form-item :label="$i18n.t('时间')" prop="time">
        <el-date-picker
          v-model="mdl.time"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
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
import {getRoleList, noticeAdd,upload,noticeEdit } from '@/api/wt/system'
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
    if (this.mdl.image) {
      this.fileList.push({ name: "", url:  this.mdl.image })
    }
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
      if(this.mdl.time){
        this.mdl.startTime=new Date(this.mdl.time[0]).getTime();
        this.mdl.endTime=new Date(this.mdl.time[1]).getTime();
      }else{
        delete this.mdl.startTime
        delete this.mdl.endTime
      }
      if (this.mdl.id =='') {
        noticeAdd({appMgmtNotice:this.mdl}).then(() => {
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
        noticeEdit({appMgmtNotice:this.mdl}).then(() => {
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
        this.mdl.image=res.data.url
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
