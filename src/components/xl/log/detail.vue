<template>
  <div>
    <el-form :model="mdl" ref="ruleForm" label-width="100px">
      <el-form-item :label="$i18n.t('操作人:')">
        <el-tag v-if="mdl.operator === ''"> {{$i18n.t('未登录')}}</el-tag>
        <el-tag v-else> {{ mdl.operator }}</el-tag>
        <el-tag> {{ mdl.reqIp }}</el-tag>
      </el-form-item>
      <el-form-item :label="$i18n.t('操作类型:')">
        <el-tag v-if="mdl.operationType === 'add'" type="success">{{$i18n.t('新增')}} </el-tag>
        <el-tag v-else-if="mdl.operationType === 'update'" type="warning"> {{$i18n.t('修改')}}</el-tag>
        <el-tag v-else-if="mdl.operationType === 'delete'" type="danger"> {{$i18n.t('删除')}}</el-tag>
        <el-tag v-else> {{$i18n.t('其他')}}</el-tag>
      </el-form-item>
      <el-form-item :label="$i18n.t('标题:')">
        {{ mdl.operationTitle }}
      </el-form-item>
      <el-form-item :label="$i18n.t('是否成功:')">
        <el-tag v-if="mdl.resultSuccess" type="success"> {{$i18n.t('成功')}}</el-tag>
        <el-tag v-else type="danger"> {{ mdl.reqResultMsg }}</el-tag>
      </el-form-item>
      <el-form-item :label="$i18n.t('IP:')">
        {{ mdl.ipSource }}
      </el-form-item>
      <el-form-item :label="$i18n.t('记录日志:')">
        {{ mdl.logEnable ? $i18n.t('是:'): $i18n.t('否') }}
      </el-form-item>
      <el-form-item :label="$i18n.t('请求时间:')">
        {{ mdl.reqTimeStr }}
      </el-form-item>
      <el-form-item :label="$i18n.t('响应时间:')">
        {{ mdl.respTimeStr }}
      </el-form-item>
      <el-form-item :label="$i18n.t('请求参数:')">
        <el-input
            type="textarea"
            :rows="3"
            :value="mdl.reqParams"
            readonly
        />
      </el-form-item>
      <el-form-item :label="$i18n.t('响应结果:')">
        <el-input
            type="textarea"
            :rows="3"
            :value="mdl.resp"
            readonly
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
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
