<template>
    <div class="body">
        <el-form :model="mdl" ref="ruleForm" label-width="100px">


          <el-form-item :label="$i18n.t('ID')" prop="id">
            <el-input class="ls-input" v-model="mdl.id" :placeholder="$i18n.t('请输入ID')" :disabled="mdl.mode==='edit'"/>
          </el-form-item>
          <el-form-item :label="$i18n.t('名称')" prop="name">
            <el-input class="ls-input" v-model="mdl.name" :placeholder="$i18n.t('请输入名称')"/>
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

          <el-form-item :label="$i18n.t('描述')" prop="description">
            <el-input type="textarea" class="ls-input" v-model="mdl.description" placeholder="请输入描述"/>
          </el-form-item>
          <el-form-item :label="$i18n.t('禁言')" prop="allMute">
            <el-select v-model="mdl.allMute" :placeholder="$i18n.t('请选择禁言')">
              <el-option key="0" :label="$i18n.t('取消禁言')" :value="false"/>
              <el-option key="1" :label="$i18n.t('全员禁言')" :value="true"/>
            </el-select>
          </el-form-item>

          <el-form-item :label="$i18n.t('禁谁')" prop="allMute">
            <el-select v-model="mdl.allMuterType" :placeholder="$i18n.t('请选择禁谁')">
              <el-option key="0" :label="$i18n.t('所有人')" :value="0"/>
              <el-option key="1" :label="$i18n.t('普通人')" :value="1"/>
            </el-select>
          </el-form-item>


          <el-form-item :label="$i18n.t('备注')" prop="adminRemark">
            <el-input class="ls-input"  type="textarea" v-model="mdl.adminRemark" :placeholder="$i18n.t('请输入后台的备注')"/>
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
    import {  groupUpdate,upload } from '@/api/wt/system'


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
                    { label: this.$i18n.t('是'), value: 1 },
                    { label: this.$i18n.t('否'), value: 0 }
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
                fileList: []
            }
        },
        created () {
          if (this.mdl.avatar) {
            this.fileList.push({ name: "", url:  this.mdl.avatar })
          }
        },
        methods: {
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
            submitForm () {
                // 先清空表单错误提示
                this.errors = {}
                this.submitLogin = true
                // 设置手动接管message提示
                this.$store.dispatch('MessageTake', true)
                this.errorMessage = ''
                if (this.mdl.id === 0) {
                   /* createUserLevel(this.mdl).then(() => {
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
                    })*/
                } else {
                    groupUpdate({groupModel:this.mdl}).then(() => {
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
      ::v-deep.el-upload-list--picture-card .el-upload-list__item .el-icon-check{
        position: absolute!important;
        left: 12px;
        bottom: 1px;
      }
    }
</style>
