<template>
  <div class="body">
    <el-form :model="mdl" ref="ruleForm" label-width="100px">
      <el-form-item :label="$i18n.t('词语')" prop="word" >
        <el-input v-if="mdl.id==''" :rows="10" type="textarea" v-model="mdl.word" :placeholder="$i18n.t('请输入屏蔽词 回车输入多个')" clearable />
        <el-input v-else  v-model="mdl.word" :placeholder="$i18n.t('请输入')" clearable />
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
    shieldwordAdd,
    shieldwordEdit,
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
        let words = this.mdl.word.split('\n');
        // 把空白行去掉
        words = words.filter((item) => {
          return item !== '';
        });
        if (this.mdl.id == '') {
          shieldwordAdd({ words: words })
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
          shieldwordEdit({ appMgmtShieldWord:this.mdl })
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
