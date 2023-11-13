<template>
  <div>
    <el-form :model="mdl" ref="ruleForm" label-width="100px">
      <el-form-item  :label="$i18n.t('名称')"  >
        <el-input   v-model="mdl.name"   :placeholder="$i18n.t('PLEASE_INPUT', { value: $i18n.t('名称') })" ></el-input>
      </el-form-item>

      <el-form-item  :label="$i18n.t('备注')"  >
        <el-input  type="textarea"  v-model="mdl.remark"   :placeholder="$i18n.t('PLEASE_INPUT', { value: $i18n.t('备注') })" ></el-input>
      </el-form-item>

      <el-form-item  :label="$i18n.t('排序')"  >
        <el-input-number   v-model="mdl.sort"   :placeholder="$i18n.t('PLEASE_INPUT', { value: $i18n.t('排序') })" ></el-input-number>
      </el-form-item>

<!--      <el-form-item>
        <div class="top-check">
          <el-checkbox  @change="changeAll">选中全部</el-checkbox>
          <el-checkbox  @change="changeOpen">展开全部</el-checkbox>
        </div>
        <el-tree
            :data="data"
            show-checkbox
            node-key="id"
            ref="tree"
            highlight-current
            @check="handleCurrentChecked"
            :props="defaultProps">
        </el-tree>
      </el-form-item>-->

      <el-form-item  :label="$i18n.t('状态')"  >
        <el-radio v-model="mdl.isDisable" :label="false">{{$i18n.t('正常')}}</el-radio>
        <el-radio v-model="mdl.isDisable" :label="true">{{$i18n.t('禁用')}}</el-radio>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
import { getAllMenus } from '@/api/wt/system'
import { array2tree } from '@/utils/index.js'
export default {
  name: "RoleTree",
  props: {
    mdl: {
      type: Object,
      required: true
    }
  },
  watch: {
    mdl: {
      immediate:true,
      handler (newVal) {

      },
      deep: true
    }
  },
  data() {
    return {
      expanded: true,
      data: [],
      checkedKeys:[],
      defaultProps: {
        children: 'children',
        label: 'menuname'
      }
    }
  },
  created() {

  },
  mounted(){
   // this.fetch()
  },
  methods: {
    fetch(){
      getAllMenus({}).then((res)=>{
        this.data=[]
        array2tree(res.data||[],this.data,0,'parentid')
         if(this.mdl.powerids.length>0){
           this.$refs.tree.setCheckedKeys(this.mdl.powerids)
         }
      })
    },
    handleCurrentChecked(nodeObj, selectedObj){
     this.checkedKeys=selectedObj.checkedKeys
    },
    getChecked(){
      return this.checkedKeys
    },
    submitForm(){

    },
    handleCloseDrawer(){

    },
    changeAll(e){
      if (e) {
        this.$refs.tree.setCheckedNodes(this.data)
      } else {
        this.$refs.tree.setCheckedKeys([])
      }
    },

    changeOpen(e){
      if (e) {
        // 展开
        this.setAllExpand()
      } else {
        // 折叠
        this.setAllFold()
      }
    },
    // 折叠所有节点
    setAllFold() {
      for (var i = 0; i < this.$refs.tree.store._getAllNodes().length; i++) {
        this.$refs.tree.store._getAllNodes()[i].expanded = false
      }
    },
    // 展开所有节点
    setAllExpand() {
      for (var i = 0; i < this.$refs.tree.store._getAllNodes().length; i++) {
        this.$refs.tree.store._getAllNodes()[i].expanded = true
      }
    },
  }
}
</script>

<style scoped>

</style>
