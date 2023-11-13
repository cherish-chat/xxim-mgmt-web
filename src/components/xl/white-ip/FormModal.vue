<template>
    <div class="body">
        <el-form :model="mdl" ref="ruleForm" label-width="100px">

          <el-form-item :label="$i18n.t('用户')" prop="userId">
            <el-input
                v-model="mdl.userId"
                :placeholder="$i18n.t('空表示所有用户')"
                clearable
            />
          </el-form-item>

          <el-form-item :label="$i18n.t('备注')" prop="remark">
            <el-input
                type="textarea"
                v-model="mdl.remark"
                :placeholder="$i18n.t('请输入备注')"
                clearable
            />
          </el-form-item>

          <el-form-item :label="$i18n.t('开始ip')" prop="startIp">
            <el-input
                v-model="mdl.startIp"
                :placeholder="$i18n.t('请输入开始ip')"
                clearable
            />
          </el-form-item>

          <el-form-item :label="$i18n.t('结束ip')" prop="endIp">
            <el-input
                v-model="mdl.endIp"
                :placeholder="$i18n.t('请输入结束ip')"
                clearable
            />
          </el-form-item>

          <el-form-item :label="$i18n.t('启用')">
            <el-switch
                v-model="mdl.isEnable"
                :active-value="true"
                :inactive-value="false"
            />
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
    import { ipwhitelistAdd,ipwhitelistUpdate } from '@/api/wt/system'


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
                    console.log(newVal)
                    this.btnDisable = false
                },
                deep: true
            }
        },
        data () {
            return {
                kefuOptions: [

                ],
                // 启用状态
                typeOptions: [
                    { label: '正常', value: 1 },
                    { label: '禁用', value: 2 }
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

        },
        methods: {
            submitForm () {
                // 先清空表单错误提示
                this.errors = {}
                this.submitLogin = true
                // 设置手动接管message提示
                this.$store.dispatch('MessageTake', true)
                this.errorMessage = ''
                if (this.mdl.id =='') {
                    ipwhitelistAdd({ipWhiteList:this.mdl}).then(() => {
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
                } else {
                  ipwhitelistUpdate( {ipWhiteList:this.mdl}).then(() => {
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

<style>
    .el-drawer.rtl{
        overflow: scroll;
    }
</style>
<style lang="scss" scoped>
    .body {
        padding-right: 25px;
        width: 100%;
    }
    ::v-deep.el-checkbox__label {
        font-size: 12px;
    }
</style>
