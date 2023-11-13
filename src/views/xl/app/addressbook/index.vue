<template>
    <div class="tel-container">

      <el-card class="!border-none" shadow="never">
        <el-row type="flex" justify="end" style="padding: 10px">
          <el-col :span="5"  >
            <div>
              <el-button size="mini" v-perms="['app:addressbook:edit']"  type="primary" @click="handleUpdate">
                {{$i18n.t('保存')}}
              </el-button>
              <el-button size="mini"  type="info" @click="handleCancel">
                {{$i18n.t('取消')}}
              </el-button>
            </div>
          </el-col>
        </el-row>
        <div class="mt-4">
          <el-divider  content-position="left"><span class="text-2xl font-bold">通讯录配置</span>
          </el-divider>
          <el-form :model="configData" label-width="120px" class="mt-4">
            <el-form-item  label="号码使用逗号隔开">
              <el-input  :rows="20" type="textarea" v-model="configData.addressBook"/>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </div>
</template>

<script>
import { getAddressBook, editAddressBook } from "@/api/wt/system";

export default {
  name: "index",
  data(){
    return {
      configData:{
        addressBook: ""
      }
    }
  },
  created() {
    this.fetch()
  },
  methods:{
    fetch(){
      this.loading = true
      getAddressBook({}).then((res) => {
        this.configData.addressBook = res.data.addressBook
      }).finally(() => {
        this.loading = false
      })
    },
    handleUpdate(){
      editAddressBook({
        addressBook: this.configData.addressBook
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
};
</script>

<style lang="scss" scoped>

</style>
