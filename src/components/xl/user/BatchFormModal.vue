<template>
    <div class="body">
        <el-form :model="mdl" ref="ruleForm" label-width="100px">


          <el-form-item :label="$i18n.t('id前缀')" required :error="errors.level">
                <el-input  v-model="mdl.idPrefix"  :placeholder="$i18n.t('请输入id前缀')" ></el-input>
                <div style="font-size: 12px;color: #f00">{{$i18n.t('例如abc')}}</div>
            </el-form-item>

          <!-- <el-form-item label="客服昵称" required :error="errors.level">
            <el-radio v-model="mdl.nickname_type" :label="0">随机昵称</el-radio>
            <el-radio v-model="mdl.nickname_type" :label="1">自定义昵称</el-radio>
          </el-form-item> -->

<!--          <el-form-item label="昵称" required :error="errors.level">
            <el-input  v-model="mdl.nicknamePrefix"  :placeholder="$i18n.t('PLEASE_INPUT', { value: '昵称' })" ></el-input>
          </el-form-item>-->



          <el-form-item :label="$i18n.t('登录密码')" required :error="errors.level">
            <el-input  v-model="mdl.password"  :placeholder="$i18n.t('请输入登录密码')" ></el-input>
          </el-form-item>

          <el-form-item :label="$i18n.t('添加数量')" required :error="errors.level">
            <el-input-number  v-model="mdl.count"  :placeholder="$i18n.t('请输入添加数量')" ></el-input-number>
          </el-form-item>

            <el-form-item :error="errors.submit">
                <el-button size="mini" @click="submitForm" type="primary" :loading="submitLogin" :disabled="btnDisable">{{ $i18n.t('确定') }}</el-button>
                <el-button size="mini" @click="handleCloseDrawer">{{ $i18n.t('取消') }}</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import { modelBatchInsertZombie } from '@/api/wt/system'
    import configs from '@/config'

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
                    { label: '男', value: 0 },
                    { label: '女', value: 1 }
                ],
              //升级状态
              typeshengjiOptions: [
                { label: '是', value: 0 },
                { label: '否', value: 1 }
              ],
              //禁用状态
              typejinyongOptions: [
                { label: '是', value: 0 },
                { label: '否', value: 1 }
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
                    console.log("=====================");
                    modelBatchInsertZombie({...this.mdl}).then(() => {
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
                   /* editUserlevel(this.mdl.id, this.mdl).then(() => {
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
