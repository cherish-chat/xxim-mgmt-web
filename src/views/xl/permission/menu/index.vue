<template>
  <div class="menu-container">

    <el-card class="content-container" shadow="never">
      <vab-query-form>
        <vab-query-form-left-panel :span="24">
          <el-button size="mini" v-perms="['system:menu:add']" type="primary" @click="handleAdd()">
            <template #icon>
              <icon name="el-icon-Plus"/>
            </template>
            {{$i18n.t('新增')}}
          </el-button>
          <el-button size="mini" @click="handleExpand">{{$i18n.t('展开/折叠')}} </el-button>
        </vab-query-form-left-panel>
      </vab-query-form>
      <el-table
        v-loading="loading"
        ref="tableRef"
        :data="data"
        row-key="id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column
          :label="$i18n.t('菜单名称')"
          prop="menuName"
          min-width="150"
          show-overflow-tooltip
        />
        <el-table-column  :label="$i18n.t('类型')"  prop="menuType" min-width="80">
          <template #default="{ row }">
            <div v-if="row.menuType == 'M'">{{$i18n.t('目录')}}</div>
            <div v-else-if="row.menuType == 'C'">{{$i18n.t('菜单')}}</div>
            <div v-else-if="row.menuType == 'A'">{{$i18n.t('按钮')}}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$i18n.t('图标')"  prop="menuIcon" min-width="80">
          <template #default="{ row }">
            <div class="flex">
              <vab-icon :icon="row.menuIconElement2" style="font-size: 20px" />
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :label="$i18n.t('权限标识')"
          prop="perms"
          min-width="150"
          show-overflow-tooltip
        />
        <el-table-column  :label="$i18n.t('状态')" prop="isDisable" min-width="100">
          <template #default="{ row }">
            <el-tag v-if="row.isDisable == 0">{{$i18n.t('正常')}}</el-tag>
            <el-tag v-else type="danger">{{$i18n.t('停用')}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$i18n.t('排序')"  prop="menuSort" min-width="100"/>
        <el-table-column
          :label="$i18n.t('更新时间')"
          prop="updatedAtStr"
          min-width="180"
        ></el-table-column>
        <el-table-column :label="$i18n.t('操作')" width="180" fixed="right">
          <template #default="{ row }">

            <el-link v-perms="['system:menu:add']" type="primary"    @click="handleAdd(row.id)">{{$i18n.t('新增')}}</el-link>
            <el-divider direction="vertical"></el-divider>
            <el-link   v-perms="['system:menu:edit']" type="primary"    @click="handleEdit(row)">{{$i18n.t('编辑')}}</el-link>
            <span  v-perms="['system:menu:del']">
                            <el-divider direction="vertical"></el-divider>
                         <el-popconfirm
                              confirm
                              :title="$i18n.t('确定删除')"
                              @confirm="handleDelete([row.id])"
                              :ok-text="$i18n.t('确定')"
                              :cancel-text="$i18n.t('取消')"
                            >
                                <el-link slot="reference" type="danger" icon="el-icon-delete">{{ $i18n.t('删除') }}</el-link>
                            </el-popconfirm>
                        </span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>


    <EditPopup  @refreshList="fetch" :mdl="mdl" :dialogVisible.sync="showEdit"></EditPopup>
  </div>
</template>
<script>
import {  getMenuTableList,deleteMenu } from '@/api/wt/system'
import { PAGES_SIZE } from '@/config/constants'
import EditPopup from './edit.vue'
export default {
  name:"Menu",
  components:{
    EditPopup
  },
  data () {
    return {
      PAGES_SIZE,
      params: {
      },
      data: [],
      page: {
        total: 0,
        currentPage: 1,
        perPage: PAGES_SIZE[0],
        pageCount: 1
      },
      loading:false,
      showEdit:false,
      mdl:{},
      isExpand:false
    }
  },
  created(){
    this.fetch()
  },
  methods:{
    handleAdd(id){
      this.mdl={id:""}
      if(id)this.mdl.id=id
      this.showEdit=true
    },
    handleExpand(){
      this.isExpand = !this.isExpand
      this.toggleExpand(this.data, this.isExpand)
    },
    toggleExpand(children, unfold = true){
      for (const key in children) {
        this.$refs.tableRef.toggleRowExpansion(children[key], unfold)
        if (children[key].children) {
          this.toggleExpand(children[key].children, unfold)
        }
      }
    },
    handleEdit(row){
      this.mdl={
        id:row.id,
        isEdit:true
      }
      this.showEdit=true
    },
    handleDelete(ids){
      deleteMenu({ids:ids}).then(() => {
        this.$Message.success(this.$i18n.t('操作成功'))
        setTimeout(() => {
          this.fetch()
        }, 500)
      })
    },
    fetch(){
      this.loading = true
      getMenuTableList({ }).then((res) => {
        const { menus, count } = res.data
        this.data = menus
        this.page.total = count
        this.page.pageCount = menus?menus.length:0
      }).finally(() => {
        this.loading = false
      })
    },
    // 每页显示数量修改
    onPerPageChange (perPage) {
      this.page.perPage = perPage
      this.fetch()
    },
  }
}
</script>
