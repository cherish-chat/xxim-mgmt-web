<template>
  <div class="devops-config-container">

    <el-card class="content-container" shadow="never">
      <el-row type="flex" justify="end">
      <el-col :span="3"  >
        <div>
          <el-button size="mini" v-perms="['devops:config:edit']" type="primary" @click="handleUpdate">
            {{$i18n.t('保存')}}
          </el-button>
          <el-button size="mini" v-perms="['devops:config:edit']" type="info" @click="handleCancel">
            {{$i18n.t('取消')}}
          </el-button>
        </div>
      </el-col>
    </el-row>
    </el-card>

    <el-card class="content-container" shadow="never">
<el-row>
      <el-col :span="24">
        <el-tabs :tab-position="tabPosition" style="height: 100%;">
          <el-tab-pane :label="$i18n.t('常规配置')">
            <el-divider content-position="left"><span class="text-2xl font-bold">{{$i18n.t('常规配置')}}</span></el-divider>
            <div>
              <el-form :model="configData.common" label-width="120px" class="mt-4">
                <el-form-item :label="$i18n.t('主机')">
                  <el-input v-model="configData.common.host" :placeholder="$i18n.t('请输入主机')"/>
                </el-form-item>
                <el-form-item :label="$i18n.t('IP2Region URL')">
                  <el-input v-model="configData.common.ip2RegionUrl" :placeholder="$i18n.t('请输入IP2Region URL')"/>
                </el-form-item>
                <el-form-item :label="$i18n.t('日志等级')">
                  <!--使用option debug info error severe-->
                  <el-select v-model="configData.common.logLevel" :placeholder="$i18n.t('请选择日志等级')">
                    <el-option :label="$i18n.t('debug')" value="debug"/>
                    <el-option :label="$i18n.t('info')" value="info"/>
                    <el-option :label="$i18n.t('error')" value="error"/>
                    <el-option :label="$i18n.t('severe')" value="severe"/>
                  </el-select>
                </el-form-item>
                <el-form-item :label="$i18n.t('模式')">
                  <!--使用option dev pro-->
                  <el-select v-model="configData.common.mode" :placeholder="$i18n.t('请选择模式')">
                    <el-option :label="$i18n.t('dev')" value="dev"/>
                    <el-option :label="$i18n.t('pro')" value="pro"/>
                  </el-select>
                </el-form-item>
                <el-form-item :label="$i18n.t('RPC超时时间')">
                  <!--int类型输入框-->
                  <el-input-number v-model="configData.common.rpcTimeOut" :min="100" :max="100000" :step="100"/>
                </el-form-item>


                <el-form-item>
                  <div slot="label" style="color: #000;font-weight: bold">
                    {{$i18n.t('MySQL')}}
                  </div>
                </el-form-item>
                <div>
                  <el-form-item :label="$i18n.t('地址')">
                    <el-input v-model="configData.common.mysql.addr" :placeholder="$i18n.t('请输入地址')"/>
                  </el-form-item>
                  <el-form-item :label="$i18n.t('日志等级')">
                    <!--使用option info silent warning error-->
                    <el-select v-model="configData.common.mysql.logLevel" :placeholder="$i18n.t('请选择日志等级')">
                      <el-option :label="$i18n.t('info')" value="info"/>
                      <el-option :label="$i18n.t('silent')" value="silent"/>
                      <el-option :label="$i18n.t('warning')" value="warning"/>
                      <el-option :label="$i18n.t('error')" value="error"/>
                    </el-select>
                  </el-form-item>
                  <el-form-item :label="$i18n.t('最大空闲连接数')">
                    <!--int类型输入框-->
                    <el-input-number v-model="configData.common.mysql.maxIdleConns" :min="1" :max="100" :step="1"/>
                  </el-form-item>
                  <el-form-item :label="$i18n.t('最大打开连接数')">
                    <!--int类型输入框-->
                    <el-input-number v-model="configData.common.mysql.maxOpenConns" :min="1" :max="100" :step="1"/>
                  </el-form-item>
                </div>

                <el-form-item>
                  <div slot="label" style="color: #000;font-weight: bold">
                    {{$i18n.t('Redis')}}
                  </div>
                </el-form-item>
                <div>
                  <el-form-item :label="$i18n.t('主机')">
                    <el-input v-model="configData.common.redis.host" :placeholder="$i18n.t('请输入主机')"/>
                  </el-form-item>
                  <el-form-item :label="$i18n.t('密码')">
                    <el-input v-model="configData.common.redis.pass" :placeholder="$i18n.t('请输入密码')"/>
                  </el-form-item>
                  <el-form-item :label="$i18n.t('TLS')">
                    <el-switch v-model="configData.common.redis.tls" active-color="#13ce66" inactive-color="#ff4949"/>
                  </el-form-item>
                  <el-form-item :label="$i18n.t('类型')">
                    <!--使用option cluster sentinel single-->
                    <el-select v-model="configData.common.redis.type" :placeholder="$i18n.t('请选择类型')">
                      <el-option label="node" value="node"/>
                      <el-option label="cluster" value="cluster"/>
                    </el-select>
                  </el-form-item>
                </div>

                <el-form-item>
                  <div slot="label" style="color: #000;font-weight: bold">
                    {{$i18n.t('链路追踪')}}
                  </div>
                </el-form-item>
                <div>
                  <el-form-item :label="$i18n.t('处理器')">
                    <!--使用option jaeger zipkin-->
                    <el-select v-model="configData.common.telemetry.batcher" :placeholder="$i18n.t('请选择处理器')">
                      <el-option :label="$i18n.t('jaeger')" value="jaeger"/>
                      <el-option :label="$i18n.t('zipkin')" value="zipkin"/>
                    </el-select>
                  </el-form-item>
                  <el-form-item :label="$i18n.t('端点')">
                    <el-input v-model="configData.common.telemetry.endPoint" :placeholder="$i18n.t('请输入端点')"/>
                  </el-form-item>
                  <el-form-item :label="$i18n.t('采样率')">
                    <!--最大1 最小0 步长0.01-->
                    <el-input-number v-model="configData.common.telemetry.sampler" :min="0" :precision="2" :max="1"
                                     :step="0.01"/>
                  </el-form-item>
                </div>
              </el-form>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$i18n.t('长连接rpc配置')">
            <el-divider content-position="left"><span class="text-2xl font-bold">{{$i18n.t('长连接rpc配置')}}</span></el-divider>
            <div>
              <el-form :model="configData.connRpc" label-width="120px" class="mt-4">
                <el-form-item :label="$i18n.t('发现类型')">
                  <!--使用option endpoints k8s-->
                  <el-select v-model="configData.connRpc.discovType" :placeholder="$i18n.t('请选择发现类型')">
                    <el-option :label="$i18n.t('endpoints')" value="endpoints"/>
                    <el-option :label="$i18n.t('k8s')" value="k8s"/>
                  </el-select>
                </el-form-item>
                <el-form-item :label="$i18n.t('端点')">
                  <!--数组类型 可以添加删除-->
                  <el-form-item>
                    <el-tag style="margin-left: 5px" v-for="(item, index) in configData.connRpc.endpoints" :key="index"
                            closable @close="configData.connRpc.endpoints.splice(index, 1)">
                      {{ item }}
                    </el-tag>
                    <el-input v-model="newEndpoint" style="margin-left: 10px;width:200px" @keyup.enter.native="addEndpoint"
                              :placeholder="$i18n.t('新增endpoint')"/>
                  </el-form-item>

                </el-form-item>
                <el-form-item :label="$i18n.t('K8S命名空间')">
                  <el-input v-model="configData.connRpc.k8sNamespace" :placeholder="$i18n.t('请输入K8S命名空间')"/>
                </el-form-item>
                <el-form-item :label="$i18n.t('端口')">
                  <!--int类型输入框-->
                  <el-input-number v-model="configData.connRpc.port" :min="1" :max="65536" :step="1"/>
                </el-form-item>
                <el-form-item :label="$i18n.t('Websocket端口')">
                  <!--int类型输入框-->
                  <el-input-number v-model="configData.connRpc.websocketPort" :min="1" :max="65536" :step="1"/>
                </el-form-item>

                <el-form-item :label="$i18n.t('rsa公钥')">
                  <!--textarea类型输入框-->
                  <el-input v-model="configData.connRpc.rsaPublicKey" type="textarea" autosize/>
                  <el-button type="primary" @click="rsaKeyGenerate">{{ $i18n.t('生成') }}</el-button>
                </el-form-item>
                <el-form-item :label="$i18n.t('rsa私钥')">
                  <!--textarea类型输入框-->
                  <el-input v-model="configData.connRpc.rsaPrivateKey" type="textarea" autosize/>
                </el-form-item>

              </el-form>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$i18n.t('消息rpc配置')">
            <el-divider content-position="left"><span class="text-2xl font-bold">{{$i18n.t('消息rpc配置')}}</span></el-divider>
            <div>
              <el-form :model="configData.msgRpc" label-width="120px" class="mt-4">
                <el-form-item :label="$i18n.t('端口')">
                  <!--int类型输入框-->
                  <el-input-number v-model="configData.msgRpc.port" :min="1" :max="65536" :step="1"/>
                </el-form-item>


                <el-form-item>
                  <div slot="label" style="color: #000;font-weight: bold">
                    {{$i18n.t('MobPush')}}
                  </div>
                </el-form-item>
                <div>
                  <el-form-item :label="$i18n.t('启用')">
                    <el-switch v-model="configData.msgRpc.mobPush.enabled" active-color="#13ce66" inactive-color="#ff4949"/>
                  </el-form-item>
                  <el-form-item :label="$i18n.t('安卓声音')">
                    <!--option default-->
                    <el-select v-model="configData.msgRpc.mobPush.androidSound" :placeholder="$i18n.t('请选择安卓声音')">
                      <el-option label="default" value="default"/>
                    </el-select>
                  </el-form-item>
                  <el-form-item :label="$i18n.t('APNS类别')">
                    <!--option default-->
                    <el-select v-model="configData.msgRpc.mobPush.apnsCateGory" :placeholder="$i18n.t('请选择APNS类别')">
                      <el-option label="default" value="default"/>
                    </el-select>
                  </el-form-item>
                  <el-form-item :label="$i18n.t('APNS生产环境')">
                    <!--switch-->
                    <el-switch v-model="configData.msgRpc.mobPush.apnsProduction" active-color="#13ce66"
                               inactive-color="#ff4949"/>
                  </el-form-item>
                  <el-form-item :label="$i18n.t('APNS声音')">
                    <!--option default-->
                    <el-select v-model="configData.msgRpc.mobPush.apnsSound" :placeholder="$i18n.t('请选择APNS声音')">
                      <el-option label="default" value="default"/>
                    </el-select>
                  </el-form-item>
                  <el-form-item :label="$i18n.t('AppKey')">
                    <el-input v-model="configData.msgRpc.mobPush.appKey" :placeholder="$i18n.t('请输入AppKey')"/>
                  </el-form-item>
                  <el-form-item :label="$i18n.t('AppSecret')">
                    <el-input v-model="configData.msgRpc.mobPush.appSecret" :placeholder="$i18n.t('请输入AppSecret')"/>
                  </el-form-item>
                </div>

                <el-form-item>
                  <div slot="label" style="color: #000;font-weight: bold">
                    {{$i18n.t('Pulsar')}}
                  </div>
                </el-form-item>
                <div>
                  <el-form-item :label="$i18n.t('启用')">
                    <el-switch v-model="configData.msgRpc.pulsar.enabled" active-color="#13ce66" inactive-color="#ff4949"/>
                  </el-form-item>
                  <el-form-item :label="$i18n.t('生产者超时')">
                    <!--int类型输入框-->
                    <el-input-number v-model="configData.msgRpc.pulsar.producerTimeout" :min="100" :max="100000"
                                     :step="100"/>
                  </el-form-item>
                  <el-form-item :label="$i18n.t('接收队列大小')">
                    <!--int类型输入框-->
                    <el-input-number v-model="configData.msgRpc.pulsar.receiverQueueSize" :min="1" :max="100000" :step="1"/>
                  </el-form-item>
                  <el-form-item :label="$i18n.t('令牌')">
                    <el-input v-model="configData.msgRpc.pulsar.token" :placeholder="$i18n.t('请输入令牌')"/>
                  </el-form-item>
                  <el-form-item :label="$i18n.t('主题名称')">
                    <el-input v-model="configData.msgRpc.pulsar.topicName" :placeholder="$i18n.t('请输入主题名称')"/>
                  </el-form-item>
                  <el-form-item :label="$i18n.t('VPC URL')">
                    <el-input v-model="configData.msgRpc.pulsar.vpcUrl" :placeholder="$i18n.t('请输入VPC URL')"/>
                  </el-form-item>
                </div>
              </el-form>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$i18n.t('后台管理配置')">
            <el-divider content-position="left"><span class="text-2xl font-bold">{{$i18n.t('后台管理配置')}}</span></el-divider>
            <div>
              <el-form :model="configData.mgmt" label-width="120px" class="mt-4">
                <el-form-item :label="$i18n.t('http端口')">
                  <!--int类型输入框-->
                  <el-input-number v-model="configData.mgmt.httpPort" :min="1" :max="65536" :step="1"/>
                </el-form-item>
                <el-form-item :label="$i18n.t('rpc端口')">
                  <!--int类型输入框-->
                  <el-input-number v-model="configData.mgmt.rpcPort" :min="1" :max="65536" :step="1"/>
                </el-form-item>

                <el-form-item>
                  <div slot="label" style="color: #000;font-weight: bold">
                    {{$i18n.t('超级管理员')}}
                  </div>
                </el-form-item>
                <div>
                  <el-form-item :label="$i18n.t('id')">
                    <el-input v-model="configData.mgmt.superAdminId" :placeholder="$i18n.t('请输入超管id')"/>
                  </el-form-item>
                  <el-form-item :label="$i18n.t('密码')">
                    <el-input v-model="configData.mgmt.superAdminPass" :placeholder="$i18n.t('请输入超管密码')"/>
                  </el-form-item>
                </div>


                <el-form-item>
                  <div slot="label" style="color: #000;font-weight: bold">
                    {{$i18n.t('BMS加密')}}
                  </div>
                </el-form-item>
                <div>
                  <el-form-item label="aesIv">
                    <el-input v-model="configData.mgmt.aesIv" :placeholder="$i18n.t('请输入aesIv')"/>
                  </el-form-item>
                  <el-form-item label="aesKey">
                    <el-input v-model="configData.mgmt.aesKey" :placeholder="$i18n.t('请输入aesKey')"/>
                  </el-form-item>
                </div>

              </el-form>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$i18n.t('群聊rpc配置')">
            <el-divider content-position="left"><span class="text-2xl font-bold">{{$i18n.t('群聊rpc配置')}}</span></el-divider>
            <div>
              <el-form :model="configData.groupRpc" label-width="120px" class="mt-4">
                <el-form-item :label="$i18n.t('端口')">
                  <!--int类型输入框-->
                  <el-input-number v-model="configData.groupRpc.port" :min="1" :max="65536" :step="1"/>
                </el-form-item>
                <el-form-item :label="$i18n.t('群上限')">
                  <!--int类型输入框-->
                  <el-input-number v-model="configData.groupRpc.maxGroupCount" :min="1" :max="10000" :step="100"/>
                </el-form-item>
                <el-form-item :label="$i18n.t('人数上限')">
                  <!--int类型输入框-->
                  <el-input-number v-model="configData.groupRpc.maxGroupMemberCount" :min="100" :max="200000" :step="100"/>
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$i18n.t('通知rpc配置')">
            <el-divider content-position="left"><span class="text-2xl font-bold">{{$i18n.t('通知rpc配置')}}</span></el-divider>
            <div>
              <el-form :model="configData.noticeRpc" label-width="120px" class="mt-4">
                <el-form-item :label="$i18n.t('端口')">
                  <!--int类型输入框-->
                  <el-input-number v-model="configData.noticeRpc.port" :min="1" :max="65536" :step="1"/>
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$i18n.t('关系rpc配置')">
            <el-divider content-position="left"><span class="text-2xl font-bold">{{$i18n.t('关系rpc配置')}}</span></el-divider>
            <div>
              <el-form :model="configData.relationRpc" label-width="120px" class="mt-4">
                <el-form-item :label="$i18n.t('端口')">
                  <!--int类型输入框-->
                  <el-input-number v-model="configData.relationRpc.port" :min="1" :max="65536" :step="1"/>
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$i18n.t('用户rpc配置')">
            <el-divider content-position="left"><span class="text-2xl font-bold">{{$i18n.t('用户rpc配置')}}</span></el-divider>
            <div>
              <el-form :model="configData.userRpc" label-width="120px" class="mt-4">
                <el-form-item :label="$i18n.t('端口')">
                  <!--int类型输入框-->
                  <el-input-number v-model="configData.userRpc.port" :min="1" :max="65536" :step="1"/>
                </el-form-item>

                <el-form-item :label="$i18n.t('显示详细错误')">
                  <el-switch v-model="configData.userRpc.LoginDetailsError" active-color="#13ce66" inactive-color="#ff4949"/>
                </el-form-item>

                <el-form-item :label="$i18n.t('短信')" v-if="configData.userRpc.sms">
                  <el-form v-model="configData.userRpc.sms">
                    <el-form-item :label="$i18n.t('启用')">
                      <el-switch v-model="configData.userRpc.sms.enabled" active-color="#13ce66" inactive-color="#ff4949"/>
                    </el-form-item>
                    <el-form-item :label="$i18n.t('厂商')">
                      <el-select v-model="configData.userRpc.sms.type">
                        <el-option :label="$i18n.t('腾讯云')" value="tencent"/>
                      </el-select>
                    </el-form-item>
                    <el-form-item v-if="configData.userRpc.sms.type==='tencent'">
                      <el-form v-model="configData.userRpc.sms.tencentSms">
                        <el-form-item :label="$i18n.t('AppId')">
                          <el-input v-model="configData.userRpc.sms.tencentSms.appId" :placeholder="$i18n.t('请输入AppId')"/>
                        </el-form-item>
                        <el-form-item :label="$i18n.t('secretId')">
                          <el-input v-model="configData.userRpc.sms.tencentSms.secretId" :placeholder="$i18n.t('请输入secretId')"/>
                        </el-form-item>
                        <el-form-item :label="$i18n.t('secretKey')">
                          <el-input v-model="configData.userRpc.sms.tencentSms.secretKey" :placeholder="$i18n.t('请输入secretKey')"/>
                        </el-form-item>
                        <el-form-item :label="$i18n.t('region')">
                          <el-input v-model="configData.userRpc.sms.tencentSms.region" :placeholder="$i18n.t('请输入region')"/>
                        </el-form-item>
                        <el-form-item :label="$i18n.t('签名')">
                          <el-input v-model="configData.userRpc.sms.tencentSms.sign" :placeholder="$i18n.t('请输入签名')"/>
                        </el-form-item>
                        <el-form-item :label="$i18n.t('模板ID')">
                          <el-input v-model="configData.userRpc.sms.tencentSms.templateId" :placeholder="$i18n.t('请输入模板ID')"/>
                        </el-form-item>
                      </el-form>
                    </el-form-item>
                  </el-form>
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$i18n.t('app管理rpc配置')">
            <el-divider content-position="left"><span class="text-2xl font-bold">{{$i18n.t('app管理rpc配置')}}</span></el-divider>
            <div>
              <el-form :model="configData.appMgmtRpc" label-width="120px" class="mt-4">
                <el-form-item :label="$i18n.t('端口')">
                  <!--int类型输入框-->
                  <el-input-number v-model="configData.appMgmtRpc.port" :min="1" :max="65536" :step="1"/>
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$i18n.t('连接管理rpc配置')">
            <el-divider content-position="left"><span class="text-2xl font-bold">{{$i18n.t('连接管理rpc配置')}}</span></el-divider>
            <div>
              <el-form :model="configData.imRpc" label-width="120px" class="mt-4">
                <el-form-item :label="$i18n.t('端口')">
                  <!--int类型输入框-->
                  <el-input-number v-model="configData.imRpc.port" :min="1" :max="65536" :step="1"/>
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>

          <el-tab-pane :label="$i18n.t('对象存储AP置')" v-if="configData.xos">
            <el-divider content-position="left"><span class="text-2xl font-bold">{{$i18n.t('对象存储AP置')}}</span></el-divider>
            <div>
              <el-form :model="configData.xos" label-width="120px" class="mt-4">
                <el-form-item :label="$i18n.t('http端口')">
                  <!--int类型输入框-->
                  <el-input-number v-model="configData.xos.httpPort" :min="1" :max="65536" :step="1"/>
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>

          <el-tab-pane :label="$i18n.t('验证码配置')" v-if="configData.captcha">
            <el-divider content-position="left"><span class="text-2xl font-bold">{{$i18n.t('验证码配置')}}</span></el-divider>
            <div>
              <el-form :model="configData.captcha" label-width="120px" class="mt-4">
                <el-form-item :label="$i18n.t('图片宽')">
                  <!--int类型输入框-->
                  <el-input-number v-model="configData.captcha.imgWidth" :min="1" :max="65536" :step="1"/>
                </el-form-item>

                <el-form-item :label="$i18n.t('图片高')">
                  <!--int类型输入框-->
                  <el-input-number v-model="configData.captcha.imgHeight" :min="1" :max="65536" :step="1"/>
                </el-form-item>

                <el-form-item :label="$i18n.t('验证码位数')">
                  <!--int类型输入框-->
                  <el-input-number v-model="configData.captcha.keyLong" :min="1" :max="65536" :step="1"/>
                </el-form-item>

                <el-form-item :label="$i18n.t('尝试次数')">
                  <!--int类型输入框-->
                  <el-input-number v-model="configData.captcha.openCaptcha" :min="1" :max="65536" :step="1"/>
                </el-form-item>

                <el-form-item :label="$i18n.t('错误拉黑时长')">
                  <!--int类型输入框-->
                  <el-input-number v-model="configData.captcha.openCaptchaTimeOut" :min="1" :max="65536" :step="1"/>
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>

          <el-tab-pane :label="$i18n.t('文件上传rpc配置')" v-if="configData.fileRpc">
            <el-divider content-position="left"><span class="text-2xl font-bold">{{$i18n.t('文件上传rpc配置')}}</span></el-divider>
            <div>
              <el-form :model="configData.fileRpc" label-width="120px" class="mt-4">
                <el-form-item :label="$i18n.t('http端口')">
                  <!--int类型输入框-->
                  <el-input-number v-model="configData.fileRpc.httpPort" :min="0" :max="65536" :step="1"/>
                </el-form-item>

                <el-form-item :label="$i18n.t('rpc端口')">
                  <!--int类型输入框-->
                  <el-input-number v-model="configData.fileRpc.rpcPort" :min="0" :max="65536" :step="1"/>
                </el-form-item>

                <el-form-item :label="$i18n.t('文件上传间隔时间')">
                  <!--int类型输入框-->
                  <el-input-number v-model="configData.fileRpc.uploadInterval" :min="0" :max="65536" :step="1"/>
                </el-form-item>

              </el-form>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-col>

    </el-row>
    </el-card>




  </div>
</template>
<script>
import { PAGES_SIZE } from '@/config/constants'
import { devopConfigAll, updateDevopConfigAll } from '@/api/wt/system'
import configs from '@/config'

export default {
  name: 'AdminManage',
  components: {},
  data () {
    return {
      tabPosition:'left',
      PAGES_SIZE,
      loading: false,
      newEndpoint: '',
      configData: {
        common: {
          host: '',
          ip2RegionUrl: '',
          logLevel: '',
          mode: '',
          rpcTimeOut: 0,
          mysql: {
            addr: '',
            logLevel: '',
            maxIdleConns: 0,
            maxOpenConns: 0
          },
          redis: {
            host: '',
            pass: '',
            tls: false,
            type: ''
          },
          telemetry: {
            batcher: '',
            endPoint: '',
            sampler: 0
          }
        },
        connRpc: {
          discovType: '',
          endpoints: [],
          k8sNamespace: '',
          port: 0,
          websocketPort: 0
        },
        groupRpc: {
          port: 0
        },
        imRpc: {
          port: 0
        },
        mgmt: {
          httpPort: 0,
          rpcPort: 0,
          superAdminId: '',
          superAdminPass: ''
        },
        msgRpc: {
          port: 0,
          mobPush: {
            androidSound: '',
            apnsCateGory: '',
            apnsProduction: false,
            apnsSound: '',
            appKey: '',
            appSecret: '',
            enabled: false
          },
          pulsar: {
            enabled: false,
            producerTimeout: 0,
            receiverQueueSize: 0,
            token: '',
            topicName: '',
            vpcUrl: ''
          }
        },
        noticeRpc: {
          port: 0
        },
        relationRpc: {
          port: 0
        },
        appMgmtRpc: {
          port: 0
        },
        userRpc: {
          port: 0
        }
      }

    }
  },
  created () {
    this.fetch()
  },
  methods: {
    rsaKeyToPem(exportedKey, type){
      // 将导出的密钥转换为 PEM 格式
      const exportedAsString = String.fromCharCode(...new Uint8Array(exportedKey));
      const exportedAsBase64 = btoa(exportedAsString);

      let pemString = "";
      pemString += `-----BEGIN ${type.toUpperCase()} KEY-----\r\n`;
      pemString += `${exportedAsBase64.match(/.{1,64}/g)?exportedAsBase64.match(/.{1,64}/g).join("\r\n") : ""}\r\n`;
      pemString += `-----END ${type.toUpperCase()} KEY-----\r\n`;

      return pemString;
    },
    async generateRsaKeyPair () {
      const keyPair = await window.crypto.subtle.generateKey(
          {
            name: "RSA-OAEP",
            modulusLength: 2048, // 可以是1024, 2048或4096
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            hash: { name: "SHA-512" }, // 可以是"SHA-1"、"SHA-256"、"SHA-384"或"SHA-512"
          },
          true, // 密钥是否可导出（即可用于导出密钥）
          ["encrypt", "decrypt"] // 必须是["encrypt", "decrypt"]或["wrapKey", "unwrapKey"]
      );
      return keyPair;
    },
    async rsaKeyGenerate () {
      // 调用 generateRsaKeyPair() 函数来生成密钥对
      const keyPair = await this.generateRsaKeyPair()
      // 导出公钥和私钥
      const publicKey = await window.crypto.subtle.exportKey('spki', keyPair.publicKey)
      const privateKey = await window.crypto.subtle.exportKey('pkcs8', keyPair.privateKey)
      // 将公钥和私钥转换为可读格式
      const publicPem = await this.rsaKeyToPem(publicKey, 'public')
      const privatePem = await this.rsaKeyToPem(privateKey, 'private')
      this.configData.connRpc.rsaPublicKey = publicPem
      this.configData.connRpc.rsaPrivateKey = privatePem
    },
    handleCancel () {
      this.fetch()
    },
    handleUpdate () {
      updateDevopConfigAll({ config: this.configData }).then((res) => {
        this.$Message.success(this.$i18n.t('操作成功'))
        this.fetch()
      })
    },
    addEndpoint () {
      this.configData.connRpc.endpoints.push(this.newEndpoint)
      this.newEndpoint = ''
    },
    // 从接口拉取数据
    fetch () {
      this.loading = true
      devopConfigAll({}).then((res) => {
        this.configData = res.data
      }).finally(() => {
        this.loading = false
      })
    }

  }
}
</script>

<style lang="scss" scoped>
</style>
