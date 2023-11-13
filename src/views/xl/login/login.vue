<template>
    <div class="login-page">

      <vue-particles
          class="login-bg"
          color="#39AFFD"
          :particleOpacity="0.7"
          :particlesNumber="100"
          shapeType="circle"
          :particleSize="4"
          linesColor="#8DD1FE"
          :linesWidth="1"
          :lineLinked="true"
          :lineOpacity="0.4"
          :linesDistance="150"
          :moveSpeed="3"
          :hoverEffect="true"
          hoverMode="grab"
          :clickEffect="true"
          clickMode="push"
      >
      </vue-particles>
       <div class="content">
         <div class="login-div flexC">
           <div class="logo flexC">
             <!--                            <img src="../../assets/main/logo-dark.png" alt="">-->
             <div style="font-size: 30px;color: #231919">{{title}}</div>
             <span>{{ siteTitle }}</span>
           </div>
           <Form v-if="isLogin" ref="formValidate1" class="login-from" :model="loginJson">
             <FormItem label="账号" prop="id">
               <Input prefix="ios-person-outline" type="text" v-model="loginJson.id" autofocus clearable placeholder="请输入账号" />
             </FormItem>
             <FormItem label="密码" prop="password">
               <Input prefix="ios-lock-outline" type="password" v-model="loginJson.password" clearable placeholder="请输入密码" />
             </FormItem>
             <FormItem>
               <Button type="primary" long :loading="loading" @click="onSubmit()">
                 <span v-if="!loading">登录</span>
                 <span v-else>请稍后...</span>
               </Button>
             </FormItem>
             <el-form-item v-if="errorMessage !== ''">
               <Alert type="error" show-icon>{{ errorMessage }}</Alert>
             </el-form-item>
           </Form>
           <Form v-else ref="formValidate2" class="login-from" :model="registerJson">
             <FormItem prop="mail">
               <Input prefix="ios-mail-outline" type="text" v-model="registerJson.mail" autofocus clearable placeholder="请输入邮箱" />
             </FormItem>
             <FormItem prop="userName">
               <Input prefix="ios-person-outline" type="text" v-model="registerJson.userName" clearable placeholder="请输入手机号" />
             </FormItem>
             <FormItem prop="passWord">
               <Input prefix="ios-lock-outline" type="password" v-model="registerJson.passWord" clearable placeholder="至少6位密码，区分大小写" />
             </FormItem>
             <FormItem prop="passWord1">
               <Input prefix="ios-lock-outline" type="password" v-model="registerJson.passWord1" clearable placeholder="请再次输入密码" />
             </FormItem>
             <FormItem>
               <Button type="primary" long :loading="loading" @click="login('formValidate2')">
                 <span v-if="!loading">注册</span>
                 <span v-else>请稍后...</span>
               </Button>

             </FormItem>
             <FormItem prop="isSave" class="flexR">
               <span class="blueText" @click="isLogin=true">使用已有账户登录</span>
             </FormItem>
           </Form>
         </div>
       </div>
    </div>
</template>

<script>
    import { siteTitle } from '@/config'
    import { mapActions } from 'vuex'


    import FingerprintJS from '@fingerprintjs/fingerprintjs'

    export default {
        name: 'login',
        data () {
            return {
                siteTitle: siteTitle,
                loading: false,
                isLogin: true,
                loginJson: {
                  id: '',
                  password: '',
                  terminal:1
                },
                registerJson: {
                    mail: '',
                    userName: '',
                    passWord: '',
                    passWord1: ''
                },
                buttonName: '发送短信',
                isDisabled: false,
                time: 60,
                countryCodeList: [],
                errorMessage: '',
                googleVerifyQRCode: '',
                title:process.env.VUE_APP_TITLE
            }
        },
        created () {
           // this.fetch()
        },
        mounted () {

        },
        methods: {
            ...mapActions(['Login', 'Logout']),
            async onSubmit() {
              this.loading = false
              const fp = await FingerprintJS.load();
              const result = await fp.get();
              const visitorId = result.visitorId;
              //this.loginJson.visit_ip = visitorId
              this.Login(this.loginJson).then((result) => {
                this.$Message.success(`${this.$i18n.t('LOGIN_SUCCESS')}`)
                setTimeout(() => {
                  location.href = './'
                }, 500)
              }).finally(() => {
                this.loading = false
              })
            },
          async onWhiteAddr () {
            const fp = await FingerprintJS.load();
            const result = await fp.get();
            const visitorId = result.visitorId;
            this.$alert(visitorId, '白名单地址', {
              confirmButtonText: '确定',
              callback: action => {
              }
            });
          },
        },
        watch: {},
        filters: {}
    }
</script>

<style lang="scss">
    .login-page {
      width: 100%;
      height: 100vh;
      overflow: hidden;
      color: #cccccc;
      position: relative;
      background-color: #141a48;
      background-image: url('~@/assets/images/img.png');
      background-repeat: no-repeat;
      background-size: cover;
      overflow: hidden;



      .content {
        width: 400px;
        height: 350px;
        border-radius: 5px;
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        margin: auto; /* 有了这个就自动居中了 */
        background: white;
      }

      .login-div {
            width: 100%;
            padding: 30px;
            text-align: center;


            &>.logo{
                img{
                    height: 90px;
                }
                span{
                    font-size: 14px;
                    margin-bottom: 20px;
                }
            }
            &>.login-from{
                .isSave{
                    width: 100%;
                    .ivu-form-item-content{
                        width: 100%;
                        display: inline-flex;
                        flex-direction: row;
                        justify-content: space-between;
                    }
                }
                .other-Login{
                    .ivu-form-item-content{
                        &>span{
                            img{
                                width: 24px;
                                margin-left: 16px;
                                cursor: pointer;
                                vertical-align: middle;
                                opacity: .7;
                                transition: all .2s ease-in-out;
                            }
                        }

                    }
                }
            }
        }


    }
</style>
