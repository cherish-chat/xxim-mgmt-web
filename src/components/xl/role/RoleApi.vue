<template>
  <div>
    <el-form :model="mdl" ref="ruleForm" label-width="100px">
      <el-form-item>
        <div class="top-check">
          <el-checkbox  @change="changeAll">{{$i18n.t('全选')}}</el-checkbox>
<!--          <el-checkbox  @change="changeOpen">展开全部</el-checkbox>-->
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
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getAllAPI } from '@/api/wt/system'
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
        label: 'title'
      }
    }
  },
  created() {

  },
  mounted(){
    this.fetch()
  },
  methods: {
    fetch(){
      getAllAPI({}).then((res)=>{
        this.data=res.data.apiPaths||[]
        this.$refs.tree.setCheckedKeys(this.mdl.apiPaths)
      })
    },
    handleCurrentChecked(nodeObj, selectedObj){
     this.checkedKeys=selectedObj.checkedKeys
    },
    getChecked(){
      return this.$refs.tree.getCheckedKeys()
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
