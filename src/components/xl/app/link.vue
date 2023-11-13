<template>
  <div class="body">
    <el-form :model="mdl" ref="ruleForm" label-width="100px">
      <el-form-item :label="$i18n.t('名称')" prop="name">
        <el-input v-model="mdl.name" :placeholder="$i18n.t('请输入名称')" clearable />
      </el-form-item>

      <el-form-item :label="$i18n.t('链接')" prop="url">
        <el-input v-model="mdl.url" :placeholder="$i18n.t('请输入链接')" clearable />
      </el-form-item>

      <el-form-item :label="$i18n.t('图标')">
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
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>

      <el-form-item :label="$i18n.t('状态')" prop="role">
        <el-select
          style="width: 100%"
          v-model="mdl.isEnable"
          class="flex-1"
          clearable
          :placeholder="$i18n.t('请选择状态')"
        >
          <el-option :label="$i18n.t('启用')" :value="true" />
          <el-option :label="$i18n.t('禁用')" :value="false" />
        </el-select>
      </el-form-item>

      <el-form-item :label="$i18n.t('排序')" prop="sort">
        <el-input-number
          v-model="mdl.sort"
          :placeholder="$i18n.t('请输入排序')"
          clearable
        />
      </el-form-item>

      <el-form-item>
        <el-button
          size="mini"
          @click="submitForm"
          type="primary"
          :loading="submitLogin"
          :disabled="btnDisable"
        >
          {{ $i18n.t('确定') }}
        </el-button>
        <el-button size="mini" @click="handleCloseDrawer">
          {{ $i18n.t('取消') }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {
    getRoleList,
    linkAdd,
    upload,
    linkEdit,
  } from '@/api/wt/system'
  export default {
    name: 'formModal',
    props: {
      mdl: {
        type: Object,
        required: true,
      },
      handleCloseDrawer: {
        type: Function,
        required: true,
      },
    },
    watch: {
      mdl: {
        handler(newVal) {
          this.btnDisable = false
        },
        deep: true,
      },
    },
    data() {
      return {
        submitLogin: false,
        btnDisable: true,
        dialogVisible: false,
        dialogImageUrl: '',
        fileList: [],
        roleOptions: [],
      }
    },
    created() {
      if (this.mdl.icon) {
        this.fileList.push({ name: '', url: this.mdl.icon })
      }
    },
    methods: {
      submitForm() {
        this.submitLogin = true
        if (this.mdl.id == '') {
          linkAdd({ appMgmtLink: this.mdl })
            .then(() => {
              // 关闭抽屉
              this.handleCloseDrawer()
              this.$Message.success(this.$i18n.t('操作成功'))
              // 调用爷爷组件刷新数据
              this.$parent.$parent.fetch()
            })
            .catch((error) => {})
            .finally(() => {
              this.submitLogin = false
            })
        } else {
          linkEdit({ appMgmtLink:this.mdl })
            .then(() => {
              // 关闭抽屉
              this.handleCloseDrawer()
              this.$Message.success(this.$i18n.t('操作成功'))
              // 调用爷爷组件刷新数据
              this.$parent.$parent.fetch()
            })
            .catch((error) => {})
            .finally(() => {
              this.submitLogin = false
            })
        }
      },
      HttpRequest(request) {
        const params = new FormData()
        params.append('file', request.file)
        upload(params)
          .then((res) => {
            this.mdl.icon = res.data.url
            request.onSuccess(res.data)
          })
          .catch((error) => {
            request.onError(error)
          })
      },
      handleChange(file, fileList) {
        this.fileList = fileList.slice(-1)
      },
      handleImagePreview(file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },
      handleImageRemove(file, fileList) {
        this.fileList = fileList
      },
    },
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
  .pic-select {
    ::v-deep.el-upload--picture-card {
      width: 100px;
      height: 100px;
      line-height: 100px;
    }
    ::v-deep.el-upload-list--picture-card .el-upload-list__item {
      width: 100px;
      height: 100px;
      line-height: 100px;
    }
    ::v-deep.el-upload-list--picture-card .el-upload-list__item .el-icon-check {
      position: absolute !important;
      left: 12px;
      bottom: 1px;
    }
  }
</style>
