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
    ></vue-particles>
    <div class="content">
      <div class="login-div">
        <div class="logo">
          <div style="font-size: 26px; color: #231919;text-align: center">{{$i18n.t('标题')}}</div>
        </div>
        <el-form
          ref="form"
          label-position="top"
          class="login-from"
          :model="loginJson"
          :rules="rules"
        >
          <el-form-item :label="$i18n.t('账号')"  prop="id">
            <el-input
              type="text"
              v-model="loginJson.id"
              autofocus
              clearable
              :placeholder="$i18n.t('请输入账号')"
            >
              <template #prefix>
                <vab-icon icon="user-2-fill" />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item :label="$i18n.t('密码')" prop="password">
            <el-input
              type="password"
              v-model="loginJson.password"
              clearable
              :placeholder="$i18n.t('请输入密码')"
            >
              <template #prefix>
                <vab-icon icon="lock-password-fill" />
              </template>
            </el-input>
          </el-form-item>

          <el-form-item :label="$i18n.t('验证码')"  prop="captcha">
            <el-row :gutter="10">
              <el-col :span="16">
                <el-input
                  type="text"
                  v-model="loginJson.captchaCode"
                  :placeholder="$i18n.t('请输入验证码')"
                >
                  <template #prefix>
                    <vab-icon icon="shield-check-fill" />
                  </template>
                </el-input>
              </el-col>
              <el-col :span="8">
                <el-image class="code" :src="codeUrl" @click="changeCode" />
              </el-col>
            </el-row>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              style="width: 100%; margin-top: 10px"
              :loading="loading"
              @click="onSubmit()"
            >
              <span v-if="!loading">{{$i18n.t('登录')}}</span>
              <span v-else>{{$i18n.t('请稍后')}}</span>
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import FingerprintJS from '@fingerprintjs/fingerprintjs'
  import { captcha } from '@/api/wt/system'
  export default {
    name: 'login',
    data() {
      return {
        loading: false,
        isLogin: true,
        loginJson: {
          id: '',
          password: '',
          terminal: 1,
          captchaId: '',
          captchaCode: ''
        },
        title: process.env.VUE_APP_TITLE,
        redirect: undefined,
        codeUrl: '',
        captchaId:"",
        rules: {
          id: [
            { required: true, message: this.$i18n.t('请输入账号'), trigger: 'blur' }
          ],
          password: [
            { required: true, message: this.$i18n.t('请输入密码'), trigger: 'blur' }
          ],
          captchaCode:[
            { required: true, message: this.$i18n.t('请输入验证码'), trigger: 'blur' }
          ]
        }
      }
    },
    watch: {
      $route: {
        handler(route) {
          this.redirect = (route.query && route.query.redirect) || '/'
        },
        immediate: true,
      },
    },
    created() {
      this.changeCode()
    },
    methods: {
      ...mapActions({
        login: 'user/login',
      }),
      changeCode() {
        captcha({}).then((res)=>{
          this.codeUrl ='data:image/png;base64,' + res.data.captchaB64
          this.loginJson.captchaId=res.data.captchaId
        })
      },
      async onSubmit() {
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            this.loading = false
            const fp = await FingerprintJS.load()
            const result = await fp.get()
            this.login(this.loginJson)
              .then(async (result) => {
                await this.$router.push(this.handleRoute())
              })
              .finally(() => {
                this.loading = false
                this.changeCode()
              })
          } else {
            return false;
          }
        });


      },
      handleRoute() {
        return this.redirect === '/404' || this.redirect === '/403'
          ? '/'
          : this.redirect
      },
    },
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
    background-image: url('~@/assets/xl_images/img.png');
    background-repeat: no-repeat;
    background-size: cover;
    overflow: hidden;

    .content {
      width: 400px;
      height: 370px;
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
      padding-top: 20px;
      padding-bottom: 20px;
      & > .logo {
        img {
          height: 90px;
        }
        span {
          font-size: 14px;
          margin-bottom: 20px;
        }
      }
      & > .login-from {
        .isSave {
          width: 100%;
          .ivu-form-item-content {
            width: 100%;
            display: inline-flex;
            flex-direction: row;
            justify-content: space-between;
          }
        }
        .other-Login {
          .ivu-form-item-content {
            & > span {
              img {
                width: 24px;
                margin-left: 16px;
                cursor: pointer;
                vertical-align: middle;
                opacity: 0.7;
                transition: all 0.2s ease-in-out;
              }
            }
          }
        }
      }
    }

    .el-form-item--small.el-form-item{
      margin-bottom: 12px;
    }
  }
</style>
