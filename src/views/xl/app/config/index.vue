<template>
  <div class="app-config-container">

      <el-card class="content-container" shadow="never">
         <el-row type="flex" justify="end">
      <el-col :span="5"  >
        <div>
          <el-button size="mini" v-perms="['app:config:edit']" type="primary" @click="handleUpdate">
            {{$i18n.t('保存')}}
          </el-button>
          <el-button size="mini" v-perms="['app:config:edit']" type="info" @click="handleCancel">
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
          <el-tab-pane :label="group" v-for="group in Object.keys(configData)" :key="group">
            <el-divider content-position="left"><span class="text-2xl font-bold">{{ group }}</span></el-divider>
            <!-- 遍历configData[group] -->
            <el-form :model="configData[group]" label-width="200px" size="small" class="mt-4">
              <el-form-item v-for="config in configData[group]" :key="config.k" :label="getLabel(config)">
                <!-- config.type: string number bool stringArray -->
                <el-input v-if="config.type === 'string'" v-model="config.v" />
                <el-input-number v-else-if="config.type === 'number'" v-model="config.v" :controls="false"/>
                <el-switch v-else-if="config.type === 'bool'" v-model="config.v" />
                <el-input type="textarea" v-else-if="config.type === 'stringArray'" v-model="config.v" />
                <el-select type="textarea" v-else-if="config.type === 'option'" v-model="config.v">
                  <el-option v-for="(option, index) in JSON.parse(config.options)" :key="index" :label="option.label" :value="option.value" />
                </el-select>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
      </el-card>




  </div>
</template>

<script>
import { appConfigAll,appConfigEdit } from '@/api/wt/system'
export default {
  name: 'appConfig',
  data(){
    return{
      tabPosition:'left',
      loading:false,
      configData:{}
    }
  },
  created () {
    this.fetch()
  },
  methods:{
    fetch(){
      this.loading = true
      appConfigAll({}).then((res) => {
        let data=res.data
        const configMap= {}
        for (const config of data.appMgmtConfigs) {
          if (!configMap[config.group]) {
            configMap[config.group] = []
          }
          configMap[config.group].push(config)
        }
        this.configData = configMap
        console.log("====configData",this.configData)
      }).finally(() => {
        this.loading = false
      })
    },
    getLabel(config){
      let name = config.name;
      if (config.type === 'stringArray') {
        name += '(数组)'
      }
      return name
    },
    handleUpdate(){
      // 拼成 Config[] 数组
      const configs= []
      for (const group in this.configData) {
        for (const config of this.configData[group]) {
          // 把所有v都转成string
          const tmp = {...config, v: config.v.toString()}
          configs.push(tmp)
        }
      }
      appConfigEdit({
        appMgmtConfigs: configs
      }).then(() => {
        this.$Message.success(this.$i18n.t('操作成功'))
        this.fetch()
      }).catch(() => {
      })
    },
    handleCancel(){
      this.fetch()
    }
  }
}
</script>

<style scoped>

</style>
