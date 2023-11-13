<template>
  <el-dialog
    append-to-body  :title="addOrEditTitle"  :visible.sync="visible" width="50%" :close-on-click-modal="false"
             :before-close="cloasAddDialog">
    <div style="height: 50vh;overflow: auto">
    <el-form :model="formData" ref="formRef" label-width="100px" class="middlewareAddForm" :rules="rules">
      <el-form-item :label="$i18n.t('菜单类型')" prop="menuType" required>
        <el-radio-group v-model="formData.menuType">
          <el-radio :label="'M'">{{$i18n.t('目录')}}</el-radio>
          <el-radio :label="'C'">{{$i18n.t('菜单')}}</el-radio>
          <el-radio :label="'A'">{{$i18n.t('按钮')}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$i18n.t('父级菜单')"  prop="pid">
        <el-select class="main-select-tree" ref="selectTree" v-model="formData.pid"  style="width: 100%">
          <el-option v-for="item in formatData(menuOptions)" :key="item.id" :label="item.label" :value="item.value" style="display: none;" />
          <el-tree class="main-select-el-tree" ref="selecteltree"
                   :data="menuOptions"
                   clearable
                   node-key="id"
                   :props="{label: 'menuName'}"
                   @node-click="handleNodeClick"
                   :expand-on-click-node="true"
                   default-expand-all />
        </el-select>
      </el-form-item>
      <el-form-item :label="$i18n.t('菜单名称')"  prop="menuName">
        <el-input v-model="formData.menuName" :placeholder="$i18n.t('请输入菜单名称')" clearable />
      </el-form-item>
      <el-form-item
          v-if="formData.menuType != 'A'"
          :label="$i18n.t('菜单图标')"
          prop="menuIcon"
      >
        <el-popover
            width="320"
            placement="bottom"
            trigger="click">

              <span slot="reference">
                <el-input suffix-icon='data-icon' v-model='userChooseIcon' :placeholder="$i18n.t('请输入')">
                 <template slot="append"> <vab-icon :icon="icon" /></template>
                </el-input>
             </span>
          <div class="icon-selector-popper">
            <vab-icon-selector @handle-icon="handleIcon" />
          </div>


        </el-popover>
      </el-form-item>

      <el-form-item
          v-if="formData.menuType !='A'"
          :label="$i18n.t('路由路径')"
          prop="paths"
      >
        <div class="flex-1">
          <el-input v-model="formData.paths" :placeholder="$i18n.t('请输入路由路径')" clearable />
          <div class="form-tips">
            {{$i18n.t('访问的路由地址')}}
          </div>
        </div>
      </el-form-item>
      <el-form-item
          v-if="formData.menuType == 'C'"
          :label="$i18n.t('组件路径')"
          prop="component"
      >
        <div class="flex-1">
          <el-autocomplete
              class="w-full"
              style="width: 100%"
              v-model="formData.component"
              :fetch-suggestions="querySearch"
              clearable
              :placeholder="$i18n.t('请输入组件')"
          />
          <div class="form-tips">
            {{$i18n.t('访问的组件路径')}}
          </div>
        </div>
      </el-form-item>
      <el-form-item
          v-if="formData.menuType != 'M'"
          :label="$i18n.t('权限字符')"
          prop="perms"
      >
        <div class="flex-1">
          <el-input v-model="formData.perms" :placeholder="$i18n.t('请输入权限字符')" clearable />
          <div class="form-tips">
            {{$i18n.t('API验权')}}
          </div>
        </div>
      </el-form-item>
      <el-form-item
          v-if="formData.menuType =='C'"
          :label="$i18n.t('是否缓存')"
          prop="isCache"
          required
      >
        <div>
          <el-radio-group v-model="formData.isCache">
            <el-radio :label="true"> {{$i18n.t('缓存')}}</el-radio>
            <el-radio :label="false">{{$i18n.t('不缓存')}}</el-radio>
          </el-radio-group>
          <div class="form-tips">{{$i18n.t('选择缓存')}}</div>
        </div>
      </el-form-item>
      <el-form-item
          v-if="formData.menuType != 'A'"
          :label="$i18n.t('是否显示')"
          prop="isShow"
          required
      >
        <div>
          <el-radio-group v-model="formData.isShow">
            <el-radio :label="true">{{$i18n.t('显示')}}</el-radio>
            <el-radio :label="false">{{$i18n.t('隐藏')}}</el-radio>
          </el-radio-group>
          <div class="form-tips">
            {{$i18n.t('选择隐藏')}}
          </div>
        </div>
      </el-form-item>
      <el-form-item
          v-if="formData.menuType != 'A'"
          :label="$i18n.t('菜单状态')"
          prop="isDisable"
          required
      >
        <div>
          <el-radio-group v-model="formData.isDisable">
            <el-radio :label="false">{{$i18n.t('正常')}}</el-radio>
            <el-radio :label="true">{{$i18n.t('停用')}}</el-radio>
          </el-radio-group>
          <div class="form-tips">{{$i18n.t('选择停用')}}</div>
        </div>
      </el-form-item>
      <el-form-item :label="$i18n.t('菜单排序')" prop="menuSort">
        <div>
          <el-input-number v-model="formData.menuSort" :max="9999" />
          <div class="form-tips">{{$i18n.t('数值越大越排前')}}</div>
        </div>
      </el-form-item>




      <el-form-item>
        <el-button @click="close">{{$i18n.t('取消')}}</el-button>
        <el-button type="primary" @click="handleSubmit">{{$i18n.t('确定')}}</el-button>
      </el-form-item>
    </el-form>
    </div>
  </el-dialog>
</template>

<script>
import {  getAllMenus,addMenu,menuDetail,menuUpdate } from '@/api/wt/system'
import VabIconSelector from '@/extra/VabIconSelector'
import  {constantRouterComponents} from '@/vab/index.js'


export default {
  name:"MenuEditDialog",
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    mdl: {
      type: Object,
      required: true
    },
  },
  watch: {
    dialogVisible() {
      this.visible = this.dialogVisible;
    },
    mdl: {
      handler (newVal) {
        if(newVal.id==''){
          this.addOrEditTitle="新增菜单"
          this.formData={
            id: '',
            //父级id
            pid: '',
            //类型
            menuType: 'M',
            //图标
            menuIconElement2: '',
            //名称
            menuName: '',
            //排序号
            menuSort: 0,
            // 路由路径
            paths: '',
            //权限链接
            perms: '',
            //前端组件
            component: '',
            //选中路径
            selected: '',
            //路由参数
            params: '',
            //是否缓存 0=否， 1=是
            isCache: true,
            //是否显示 0=否， 1=是
            isShow: true,
            //是否禁用 0=否， 1=是
            isDisable: false
          }
        }else {
          if(newVal.id&&newVal.isEdit){
            this.addOrEditTitle="编辑菜单"
            this.getDetail()
          }else{
            this.addOrEditTitle="新增菜单"
            this.formData.pid=newVal.id
          }
        }
      },
      deep: true
    }
  },
  components: { VabIconSelector },
  data() {
    return {
      visible: false,
      addOrEditTitle:"新增菜单",
      formData: {
        id: '',
        //父级id
        pid: '',
        //类型
        menuType: 'M',
        //图标
        menuIconElement2: '',
        //名称
        menuName: '',
        //排序号
        menuSort: 0,
        // 路由路径
        paths: '',
        //权限链接
        perms: '',
        //前端组件
        component: '',
        //选中路径
        selected: '',
        //路由参数
        params: '',
        //是否缓存 0=否， 1=是
        isCache: true,
        //是否显示 0=否， 1=是
        isShow: true,
        //是否禁用 0=否， 1=是
        isDisable: false
      },
      rules: {
        pid: [
         /* {
            required: true,
            message: '请选择父级菜单',
            trigger: ['blur', 'change']
          }*/
        ],
        menuName: [
          {
            required: true,
            message: '请输入菜单名称',
            trigger: 'blur'
          }
        ],
        paths: [
          {
            required: true,
            message: '请输入路由地址',
            trigger: 'blur'
          }
        ],
        component: [
          {
            required: true,
            message: '请输入组件地址',
            trigger: 'change'
          }
        ]
      },
      menuOptions:[],
      chooseIcons:"请选择",
      userChooseIcon:"",
      icon:''
    }
  },
  created () {
    this.fetchMenu()
  },
  methods: {
    close(){
      this.$emit("update:dialogVisible", false);
    },
    async getDetail () {
      const res = await menuDetail({ id: this.mdl.id })
      let data=res.data.menu
      for (const key in this.formData) {
        if (data[key] != null && data[key] != undefined) {
          this.formData[key] = data[key]
        }
      }
      this.userChooseIcon=this.formData.menuIconElement2;//将i的样式设为选中的样式el-icon-xxx

    },
    handleNodeClick(node){
      this.formData.pid = node.id;
      this.$refs.selectTree.blur();
    },
    formatData(datas){
      let options = [];
      datas.forEach((item,key) => {
        options.push({label:item.menuName,value:item.id});
        if(item.children){
          item.children.forEach((items,keys) => {
            options.push({label:items.menuName,value:items.id});
            if(items.children){
              items.children.forEach((itemss,keyss) => {
                options.push({label:itemss.menuName,value:itemss.id});
                if(itemss.children){
                  itemss.children.forEach((itemsss,keysss) => {
                    options.push({label:itemsss.menuName,value:itemsss.id});
                  });
                }
              });
            }
          });
        }
      });
      return options;

    },
    handleIcon(icon) {
      this.icon = icon
      this.userChooseIcon=icon
      this.formData.menuIconElement2=icon
    },
    querySearch(queryString,cb){
      let results=[]
      /*if(!queryString)results=constantRouterComponents
      results= constantRouterComponents.filter((item)=>{
        return  item.toLowerCase().includes(queryString.toLowerCase())
      })*/
      results=constantRouterComponents
      cb(results.map((item) => ({ value: item })))
    },
    fetchMenu(){
      getAllMenus({}).then((res)=>{
       let temp=[{ id: "0", menuName: '顶级', children: [] }]
        temp[0].children=res.data.menus||[]
        this.menuOptions=temp
        //this.$refs.tree.setCheckedKeys(this.mdl.menus)
      })
    },
    cloasAddDialog(done) {
      done();
      this.$refs["formRef"].resetFields();
      this.$emit("update:dialogVisible", false);
    },
    handleSubmit() {
      this.$refs["formRef"].validate((valid) => {
        if (valid) {
          if (this.formData.id) {
            menuUpdate({menu:this.formData}).then((res) => {
              this.$message({
                message: "更新成功",
                type: "success",
              });
              this.$emit("update:dialogVisible", false);
              this.$refs["formRef"].resetFields();
              this.$emit("refreshList");
            });
          } else {
            addMenu({menu:this.formData}).then((res) => {
              this.$message.success("新增成功");
              this.$emit("update:dialogVisible", false);
              this.$refs["formRef"].resetFields();
              this.$emit("refreshList");
            });
          }
        }
      });
    }
  }
}
</script>


<style lang="scss">
.main-select-el-tree .el-tree-node .is-current > .el-tree-node__content{font-weight: bold; color: #409eff;}
.main-select-el-tree .el-tree-node.is-current > .el-tree-node__content{font-weight: bold; color: #409eff;}
.icon_list {
  width: 100%;
  height: 200px;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap; //一定要换行
  overflow-y: scroll; //y轴显示滚动条
  overflow-x: hidden; //x轴溢出隐藏
  i {
                       display: inline-block;
                       width: 20px;
                       height: 20px;
                       color: #000000;
                       font-size: 14px;
                       border-radius: 4px;
                       cursor: pointer;
                       text-align: center;
                       line-height: 45px;
                       margin: 5px;

&:hover {
   color: blue;
   border-color: blue;
 }
}
}

</style>
