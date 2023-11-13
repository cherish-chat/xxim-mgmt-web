<template>
    <div class="devops-appline-container">

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
            <el-tab-pane :label="$i18n.t('线路配置')">
              <el-divider content-position="left"><span class="text-2xl font-bold">{{$i18n.t('线路配置')}}</span>
              </el-divider>
              <el-form :model="configData" label-width="120px" class="mt-4">
                <el-form-item :label="$i18n.t('配置')">
                  <el-input type="textarea" v-model="configData.config" autosize/>
                </el-form-item>
                <el-form-item :label="$i18n.t('AES密钥')">
                  <el-input v-model="configData.aesKey" :placeholder="$i18n.t('请输入AES密钥')"/>
                </el-form-item>
                <el-form-item :label="$i18n.t('AES向量')">
                  <el-input v-model="configData.aesIv" :placeholder="$i18n.t('请输入AES向量')"/>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane :label="$i18n.t('存储配置')" v-if="configData.storage">
              <el-divider content-position="left"><span class="text-2xl font-bold">{{$i18n.t('存储配置')}}</span></el-divider>
              <div>
                <el-form :model="configData.storage" label-width="120px" class="mt-4">
                  <el-form-item :label="$i18n.t('类型')">
                    <el-select v-model="configData.storage.type" :placeholder="$i18n.t('请选择存储类型')">
                      <el-option :label="$i18n.t('COS')" value="cos"></el-option>
                      <el-option :label="$i18n.t('OSS')" value="oss"></el-option>
                      <el-option :label="$i18n.t('Minio')" value="minio"></el-option>
                      <el-option :label="$i18n.t('Kodo')" value="kodo"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item :label="$i18n.t('文件名')">
                    <el-input v-model="configData.storage.objectId" :placeholder="$i18n.t('请输入文件名')"></el-input>
                  </el-form-item>
                </el-form>
              </div>
            </el-tab-pane>
            <el-tab-pane :label="$i18n.t('COS配置')" v-if="configData.storage">
              <el-divider content-position="left" v-if="configData.storage.type === 'cos'"><span class="text-2xl font-bold">{{$i18n.t('COS配置')}}</span>
              </el-divider>
              <div>
                <el-form :model="configData.storage.cos" label-width="120px" class="mt-4">
                  <el-form-item :label="$i18n.t('AppId')">
                    <el-input v-model="configData.storage.cos.appId" :placeholder="$i18n.t('请输入AppId')"></el-input>
                  </el-form-item>
                  <el-form-item :label="$i18n.t('SecretId')">
                    <el-input v-model="configData.storage.cos.secretId" :placeholder="$i18n.t('请输入SecretId')"></el-input>
                  </el-form-item>
                  <el-form-item :label="$i18n.t('SecretKey')">
                    <el-input v-model="configData.storage.cos.secretKey" :placeholder="$i18n.t('请输入SecretKey')"></el-input>
                  </el-form-item>
                  <el-form-item :label="$i18n.t('BucketName')">
                    <el-input v-model="configData.storage.cos.bucketName" :placeholder="$i18n.t('请输入BucketName')"></el-input>
                  </el-form-item>
                  <el-form-item :label="$i18n.t('Region')">
                    <el-input v-model="configData.storage.cos.region" :placeholder="$i18n.t('请输入Region')"></el-input>
                  </el-form-item>
                  <el-form-item :label="$i18n.t('BucketUrl')">
                    <el-input v-model="configData.storage.cos.bucketUrl" :placeholder="$i18n.t('请输入BucketUrl')"></el-input>
                  </el-form-item>
                </el-form>
              </div>
            </el-tab-pane>
            <el-tab-pane :label="$i18n.t('OSS配置')" v-if="configData.storage">
              <el-divider content-position="left" v-if="configData.storage.type === 'oss'"><span class="text-2xl font-bold">{{$i18n.t('OSS配置')}}</span>
              </el-divider>
              <div>
                <el-form :model="configData.storage.oss" label-width="120px" class="mt-4">
                  <el-form-item :label="$i18n.t('Endpoint')">
                    <el-input v-model="configData.storage.oss.endpoint" :placeholder="$i18n.t('请输入Endpoint')"></el-input>
                  </el-form-item>
                  <el-form-item :label="$i18n.t('AccessKeyId')">
                    <el-input v-model="configData.storage.oss.accessKeyId" :placeholder="$i18n.t('请输入AccessKeyId')"></el-input>
                  </el-form-item>
                  <el-form-item :label="$i18n.t('AccessKeySecret')">
                    <el-input v-model="configData.storage.oss.accessKeySecret" :placeholder="$i18n.t('请输入AccessKeySecret')"></el-input>
                  </el-form-item>
                  <el-form-item :label="$i18n.t('BucketName')">
                    <el-input v-model="configData.storage.oss.bucketName" :placeholder="$i18n.t('请输入BucketName')"></el-input>
                  </el-form-item>
                  <el-form-item :label="$i18n.t('BucketUrl')">
                    <el-input v-model="configData.storage.oss.bucketUrl" :placeholder="$i18n.t('请输入BucketUrl')"></el-input>
                  </el-form-item>
                </el-form>
              </div>
            </el-tab-pane>
            <el-tab-pane :label="$i18n.t('Minio配置')" v-if="configData.storage">
              <el-divider content-position="left" ><span class="text-2xl font-bold">{{$i18n.t('Minio配置')}}</span>
              </el-divider>
              <div>
                <el-form :model="configData.storage.minio" label-width="120px" class="mt-4">
                  <el-form-item :label="$i18n.t('Endpoint')">
                    <el-input v-model="configData.storage.minio.endpoint" :placeholder="$i18n.t('请输入Endpoint')"></el-input>
                  </el-form-item>
                  <el-form-item :label="$i18n.t('AccessKeyId')">
                    <el-input v-model="configData.storage.minio.accessKeyId" :placeholder="$i18n.t('请输入AccessKeyId')"></el-input>
                  </el-form-item>
                  <el-form-item :label="$i18n.t('secretAccessKey')">
                    <el-input v-model="configData.storage.minio.secretAccessKey"
                              :placeholder="$i18n.t('请输入secretAccessKey')"></el-input>
                  </el-form-item>
                  <el-form-item :label="$i18n.t('BucketName')">
                    <el-input v-model="configData.storage.minio.bucketName" :placeholder="$i18n.t('请输入BucketName')"></el-input>
                  </el-form-item>
                  <el-form-item :label="$i18n.t('BucketUrl')">
                    <el-input v-model="configData.storage.minio.bucketUrl" :placeholder="$i18n.t('请输入BucketUrl')"></el-input>
                  </el-form-item>
                </el-form>
              </div>
            </el-tab-pane>
            <el-tab-pane :label="$i18n.t('Kodo配置')" v-if="configData.storage">
              <el-divider content-position="left" ><span class="text-2xl font-bold">{{$i18n.t('Kodo配置')}}</span>
              </el-divider>
              <div>
                <el-form :model="configData.storage.kodo" label-width="120px" class="mt-4">
                  <el-form-item :label="$i18n.t('Endpoint')">
                    <el-input v-model="configData.storage.kodo.endpoint" :placeholder="$i18n.t('请输入Endpoint')"></el-input>
                  </el-form-item>
                  <el-form-item :label="$i18n.t('AccessKeyId')">
                    <el-input v-model="configData.storage.kodo.accessKeyId" :placeholder="$i18n.t('请输入AccessKeyId')"></el-input>
                  </el-form-item>
                  <el-form-item :label="$i18n.t('AccessKeySecret')">
                    <el-input v-model="configData.storage.kodo.accessKeySecret"
                              :placeholder="$i18n.t('请输入AccessKeySecret')"></el-input>
                  </el-form-item>
                  <el-form-item :label="$i18n.t('BucketName')">
                    <el-input v-model="configData.storage.kodo.bucketName" :placeholder="$i18n.t('请输入BucketName')"></el-input>
                  </el-form-item>
                  <el-form-item :label="$i18n.t('BucketUrl')">
                    <el-input v-model="configData.storage.kodo.bucketUrl" :placeholder="$i18n.t('请输入BucketUrl')"></el-input>
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
import { appLineList,updateAppList } from '@/api/wt/system'


export default {
  name: 'appLine',
  components: {  },
  data () {
    return {
      tabPosition:'left',
      PAGES_SIZE,
      loading:false,
      newEndpoint:'',
      configData: {
        config: "",
        aesIv: "",
        aesKey: "",
        storage: {
          type: "",
          objectId: "",
          cos: {},
          oss: {},
          minio: {},
          kodo: {}
        }
      }
    }
  },
  created () {
    this.fetch()
  },
  methods: {
    handleCancel(){
      this.fetch()
    },
    handleUpdate(){
      updateAppList({appLineConfig:this.configData}).then((res) => {
        this.$Message.success(this.$i18n.t('操作成功'))
        this.fetch()
      })
    },
    addEndpoint(){
      this.configData.connRpc.endpoints.push(this.newEndpoint)
      this.newEndpoint = ''
    },
    // 从接口拉取数据
    fetch () {
      this.loading = true
      appLineList({}).then((res) => {
        this.configData=res.data.appLineConfig
      }).finally(() => {
        this.loading = false
      })
    },

  }
}
</script>

<style lang="scss" scoped>
.top-tip{
  list-style: none;
  margin-bottom: 10px;
}

</style>
