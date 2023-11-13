<template>
  <div>
    <el-form :model="mdl" ref="ruleForm" label-width="100px">
      <el-form-item>
        <div class="top-check">
            <el-checkbox  @change="changeAll">{{$i18n.t('全选')}}</el-checkbox>
            <el-checkbox  @change="changeOpen">{{$i18n.t('展开全部')}}</el-checkbox>
        </div>
        <el-tree
            :data="data"
            show-checkbox
            node-key="id"
            ref="tree"
            highlight-current
            :check-strictly="true"
            @check="hanleCheck"
            :props="defaultProps">
        </el-tree>
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
        label: 'menuName'
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
      getAllMenus({}).then((res)=>{
        this.data=res.data.menus||[]
          const getAllIds=(tree, result)=> {
          //遍历树  获取id数组
          for (const i in tree) {
            result.push(tree[i].id); // 遍历项目满足条件后的操作
            if (tree[i].children) {
              //存在子节点就递归
              getAllIds(tree[i].children, result);
            }
          }
          return result;
        }
        this.allKeys=[]
        getAllIds(this.data, this.allKeys)
        this.$refs.tree.setCheckedKeys(this.mdl.menus)
      })
    },

    hanleCheck (currentObj, treeStatus) {
      // 用于：父子节点严格互不关联时，父节点勾选变化时通知子节点同步变化，实现单向关联。
      let selected = treeStatus.checkedKeys.indexOf(currentObj.id) // -1未选中
      // 选中
      if (selected !== -1) {
        // 子节点只要被选中父节点就被选中
        this.selectedParent(currentObj)
        // 统一处理子节点为相同的勾选状态
        this.uniteChildSame(currentObj, true)
      } else {
        // 未选中 处理子节点全部未选中
        if (currentObj.children.length !== 0) {
          this.uniteChildSame(currentObj, false)
        }
      }
    },
    // 统一处理子节点为相同的勾选状态
    uniteChildSame (treeList, isSelected) {
      this.$refs.tree.setChecked(treeList.id, isSelected)
      for (let i = 0; i < treeList.children.length; i++) {
        this.uniteChildSame(treeList.children[i], isSelected)
      }
    },
    // 统一处理父节点为选中
    selectedParent (currentObj) {
      let currentNode = this.$refs.tree.getNode(currentObj)
      if (currentNode.parent.key !== undefined) {
        this.$refs.tree.setChecked(currentNode.parent, true)
        this.selectedParent(currentNode.parent)
      }
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
        this.$refs.tree.setCheckedKeys(this.allKeys)
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
