<template>
  <div class="member-container">


     <el-card class="query-container" shadow="never">
        <vab-query-form>
        <vab-query-form-left-panel :span="24">
          <!-- 搜索组件 -->
        <search-form :items="formItems" :params="params" :on-reset="onReset" :on-submit="onSearch" :btn-loading="loading" >

        </search-form>

        </vab-query-form-left-panel>
        </vab-query-form>
    </el-card>



<el-card class="content-container" shadow="never">

      <vab-query-form>
        <vab-query-form-left-panel :span="24">
         <el-button size="mini" v-perms="['user:model:add']" type="primary" icon="el-icon-plus" @click="onAdd">添加</el-button>
           <el-button  v-perms="['user:model:add']" type="primary" icon="el-icon-plus" @click="onAddBatch">批量添加僵尸号</el-button>
        </vab-query-form-left-panel>
        </vab-query-form>
 <!-- 表格 -->
      <el-table border style="width: 100%;" stripe :data="data" v-loading="loading" @selection-change="handleSelectionChange">
        <template   v-for="(item,index) in tableColumns">
          <el-table-column
              v-if="item.isHeadShow"
              :key="index"
              :type="item.type?item.type:''"
              align="center"
              show-overflow-tooltip
              :prop="item.props" :label="item.label" :width="item.width" >
            <template slot-scope="scope" >
              <div v-if="item.prop=='id'">
                <div>
                  <el-tag type="info">id: {{ scope.row.id }}</el-tag>
                </div>
                <div>
                  <el-tag>角色: {{ getRole(scope.row) }}</el-tag>
                </div>
                <div>
                  <el-tag v-if="scope.row.invitationCode !== ''" type="success">邀请码: {{ scope.row.invitationCode }}</el-tag>
                </div>
                <div>
                  <el-tag v-if="scope.row.mobile !== ''" type="warning">手机号: {{ scope.row.mobile }}</el-tag>
                </div>
              </div>
              <div v-else-if="item.prop=='nickname'">
                <div>
                  <el-tag>昵称:{{ scope.row.nickname }}</el-tag>
                </div>
                <div style="display: flex;align-items: center;justify-content: center">
                  <el-tag type="warning">性别:{{ getXb(scope.row) }}</el-tag>
                  <el-avatar :size="20" :src="scope.row.avatar"/>
                </div>

              </div>
              <div v-else-if="item.prop=='time'">
                <div v-if="scope.row.lastLoginRecord">
                  <div>
                    <el-tag v-if="scope.row.lastLoginRecord.time === 0"> 无记录</el-tag>
                  </div>
                  <div>
                    <el-tag v-if="scope.row.lastLoginRecord.time !== 0">
                      {{ scope.row.lastLoginRecord.timeStr }}
                    </el-tag>
                  </div>
                  <div>
                    <el-tag v-if="scope.row.lastLoginRecord.time !== 0" type="warning">
                      {{ scope.row.lastLoginRecord.ip }}
                    </el-tag>
                  </div>
                  <div>
                    <el-tag v-if="scope.row.lastLoginRecord.time !== 0" type="danger">
                      {{ scope.row.lastLoginRecord.ipRegion }}
                    </el-tag>
                  </div>
                </div>
                <div v-else>
                  <el-tag > 无记录</el-tag>
                </div>

              </div>
              <div v-else-if="item.prop=='platform'">
                <div>
                  <el-tag>{{ scope.row.createdAtStr }}</el-tag>
                </div>
                <div>
                  <el-tag v-if="scope.row.regInfo.platform !== ''" type="success">{{ scope.row.regInfo.platform }}</el-tag>
                  <el-tag v-if="scope.row.regInfo.ip !== ''" type="warning">{{ scope.row.regInfo.ip }}</el-tag>
                </div>
                <div>
                  <el-tag v-if="scope.row.regInfo.ip !== ''" type="danger">
                    {{ scope.row.regInfo.ipCountry }}|{{ scope.row.regInfo.ipProvince }}|{{ scope.row.regInfo.ipCity }}|{{
                      scope.row.regInfo.ipISP
                    }}
                  </el-tag>
                </div>
              </div>
              <div v-else-if="item.prop=='unblockTime'">
                <el-tag v-if="scope.row.unblockTime !== 0" type="danger">{{ scope.row.unblockTimeStr }}解封</el-tag>
                <el-tag v-else type="success">正常</el-tag>
              </div>

              <div v-else>
                {{scope.row[item.prop]}}
              </div>
            </template>
          </el-table-column>
        </template>

        <!-- 右侧按钮 -->
        <el-table-column align="center" :label="$i18n.t('操作')" fixed="right" :width="200">
          <template slot-scope="scope">

            <el-link type="primary"   v-perms="['user:model:edit']"  @click="handleWallet(scope.row)">{{ $i18n.t('钱包') }}</el-link>
            <el-divider direction="vertical" v-perms="['user:model:detail']"></el-divider>
            <el-link type="primary"   v-perms="['user:model:edit']"  @click="onEDit(scope.row)">{{ $i18n.t('编辑') }}</el-link>
            <el-divider direction="vertical" v-perms="['user:model:detail']"></el-divider>
            <el-link type="primary" v-perms="['user:model:detail']"   @click="onJoinedGroup(scope.row)">群列表</el-link>
            <el-divider direction="vertical" v-perms="['user:model:detail']"></el-divider>
            <el-link type="primary"  v-perms="['user:model:detail']"  @click="onChatRecord(scope.row)">好友列表</el-link>
            <el-divider direction="vertical"></el-divider>

            <el-link v-perms="['user:model:edit']" type="danger"   @click="friendConfig(scope.row,scope.row.dismissTime)">权限</el-link>
            <el-divider v-perms="['user:model:edit']" direction="vertical"></el-divider>
            <!--            <el-link type="primary"  icon="el-icon-edit" @click="onLogRecord(scope.row)">日志</el-link>-->
            <el-link  v-perms="['user:model:edit']"  :type="scope.row.unblockTime === 0 ? 'danger' : 'success'"   @click="onhandleJiefeng(scope.row)">{{ scope.row.unblockTime === 0 ? '封禁' : '解封' }}</el-link>
            <span   v-perms="['user:model:del']">
                            <el-divider direction="vertical"></el-divider>
                            <el-popconfirm
                                confirm
                                :title="$i18n.t('CONFIRM_DELETE_TIP')"
                                @confirm="onDelete([scope.row.id])"
                                :ok-text="$i18n.t('CONFIRM')"
                                :cancel-text="$i18n.t('CANCEL')"
                            >
                                <el-link slot="reference"  type="danger" >{{ $i18n.t('删除') }}</el-link>
                            </el-popconfirm>
                        </span>
          </template>
        </el-table-column>
      </el-table>



      <!-- 分页 -->
      <div class="table-pagination">
        <el-pagination
            background
            layout="total, prev, pager, next, ->, sizes"
            :page-size.sync="page.perPage"
            :total="page.total"
            :page-count="page.pageCount"
            :current-page.sync="page.currentPage"
            :page-sizes="PAGES_SIZE"
            @current-change="onCurrentPageChange"
            @size-change="onPerPageChange"
        >
        </el-pagination>
      </div>
</el-card>

    <el-drawer
      :title="mdl.id>0 ? $i18n.t('编辑') : $i18n.t('新增')"
        :visible.sync="drawer"
        destroy-on-close
        ref="drawer"
        size="400px"
    >
      <form-modal :mdl="mdl" :handle-close-drawer="handleCloseDrawer"></form-modal>
    </el-drawer>

    <el-drawer
      :title="mdl.id>0 ? $i18n.t('编辑') : $i18n.t('新增')"
      :visible.sync="drawerWallet"
      destroy-on-close
      ref="drawerWallet"
      size="400px"
    >
      <wallet-form-modal :mdl="mdl" :handle-close-drawer="handleCloseDrawer"></wallet-form-modal>
    </el-drawer>

    <el-dialog
        v-if="dialogJiefeng"
        :title="mdl.disable ? $i18n.t('启用用户') : $i18n.t('禁用用户')"
        :visible.sync="dialogJiefeng"
        destroy-on-close
        ref="dialog"
    >
      <div style="height: 40vh;overflow: auto">
        <el-form
            label-width="60px"
        >
          <el-form-item label="id" prop="id">
            <el-input class="ls-input" v-model="mdl.id" disabled/>
          </el-form-item>
          <el-form-item :label="$i18n.t('解封')" prop="unblockTime" v-if="!mdl.disable">
            <el-date-picker
                v-model="mdl.unblockTime"
                type="datetime"
                :placeholder="$i18n.t('选择解封时间')"
            />
          </el-form-item>
          <el-form-item label="ip" prop="disableIp" v-if="!mdl.disable">
            <el-select v-model="mdl.disableIp" :placeholder="$i18n.t('是否禁用上次登录ip')">
              <el-option key="0" :label="$i18n.t('不禁用')" :value="false"/>
              <el-option key="1" :label="$i18n.t('禁用')" :value="true"/>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogJiefeng = false">{{$i18n.t('取消')}}</el-button>
        <el-button type="primary" @click="dialogJiefengComfim">{{$i18n.t('确定')}}</el-button>
      </div>
    </el-dialog>
    <el-dialog
        v-if="chatRecord"
        append-to-body
        :title="$i18n.t('好友列表')"
        width="70%"
        :visible.sync="chatRecord">
      <div style="height: 60vh;overflow: auto">
        <chat-records :mdl="mdl"></chat-records>
      </div>
    </el-dialog>



    <el-dialog
        v-if="drawerLog"
        append-to-body
        :title="$i18n.t('权限配置')"
        width="70%"
        :visible.sync="drawerLog">
      <div style="height: 50vh;overflow: auto">
        <div v-for="group in Object.keys(configData)" :key="group">
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
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="drawerLog = false">{{$i18n.t('取消')}}</el-button>
        <el-button type="primary" @click="dialogComfirm">{{$i18n.t('确定')}}</el-button>
      </div>
    </el-dialog>


    <el-dialog
        v-if="joinedGroupDialog"
        append-to-body
        :title="$i18n.t('已加群组')"
        width="60%"
        :visible.sync="joinedGroupDialog">
      <div style="height: 60vh;overflow: auto">
        <joined-group :mdl="mdl"></joined-group>
      </div>
    </el-dialog>


     <el-drawer
          :title="$i18n.t('批量添加用户')"
          :visible.sync="drawerBatch"
          destroy-on-close
          ref="drawerBatch"
          size="420px"
      >
        <batch-form-modal :mdl="mdl" :handle-close-drawer="handleCloseDrawer"></batch-form-modal>
      </el-drawer>
  </div>
</template>
<script>
import SearchForm from '@/components/SearchForm'
import { PAGES_SIZE } from '@/config/constants'
import {appConfigEdit, appConfigAll,modelList, modelListDelete,modelSwitch } from '@/api/wt/system'
import FormModal from '@/components/xl/user/MermberFormModal.vue'
import WalletFormModal from '@/components/xl/user/WalletFormModal.vue'
import ChatRecords from '@/components/xl/components/ChatRecords.vue'
import LogRecords from '@/components/xl/components/LogRecords.vue'
import configs from '@/config'
import JoinedGroup from '@/components/xl/components/JoinedGroup.vue'
import BatchFormModal from '@/components/xl/user/BatchFormModal'

export default {
  name: 'AdminManage',
  components: { WalletFormModal,SearchForm, FormModal,ChatRecords,LogRecords,JoinedGroup,BatchFormModal },
  data () {
    return {
      PAGES_SIZE,
      params: {
        id: '',
        nickname: '',
        role: '',
        invitationCode: '',
        status: '',
        createTime_gte: '',
        createTime_lte: '',
      },
      data: [],
      tableColumns:[
        {
          label:"账号信息",
          prop:'id',
          isHeadShow:true,
          width: 180
        },
        {
          label:"基本信息",
          prop:'nickname',
          isHeadShow:true,
          width: 180
        },
        {
          label:"邀请码",
          prop:'invitationCode',
          isHeadShow:true,
          width: 100
        },
        {
          label:"注册信息",
          prop:'platform',
          isHeadShow:true,
          width: 180
        },
        {
          label:"状态",
          prop:'unblockTime',
          isHeadShow:true,
          width: 180
        },
        {
          label:"上次登录",
          prop:'time',
          isHeadShow:true,
          width: 180
        },


        {
          label:"后台备注",
          prop:'adminRemark',
          isHeadShow:true,
          width:150
        }
      ],
      page: {
        total: 0,
        currentPage: 1,
        perPage: PAGES_SIZE[0],
        pageCount: 1
      },
      loading: false,
      drawer: false,
       drawerBatch: false,
      dialogTableVisible: false,
      mdl: {},
      checkedIds: [],
      isShowPictures: false,
      picture: [],
      config: configs,
      dialogJiefeng:false,
      chatRecord:false,
      drawerLog:false,
      drawerWallet:false,
      joinedGroupDialog:false,
      configData:{}
    }
  },
  created () {
    this.fetch()
  },
  computed: {
    formItems () {
      // 构建搜索表单
      // 用户状态筛选
      const statusOptions = [
        { label: '全部', value: '' },
        { label: '用户', value: 1 },
        { label: '客服', value: 2 },
        { label: '游客', value: 3 },
      ]
      const statusOptions1 = [
        { label: '全部', value: '' },
        { label: '正常', value: 'normal' },
        { label: '封禁', value: 'block' },
      ]
      return [
        { title: '全部', type: 'select', key: 'role', options: statusOptions },
        { title: '账号', type: 'input', key: 'id' },
        { title: '昵称', type: 'input', key: 'nickname' },
        { title: '邀请码', type: 'input', key: 'invitationCode' },
        { title: '状态', type: 'select', key: 'status', options: statusOptions1 },
        { title: '注册时间', type: 'el-date-picker', key: 'time' },

      ]
    }
  },
  methods: {
    dialogComfirm(){
      this.drawerLog=false
      this.handleUpdate()
    },
    friendConfig(row){
      this.drawerLog=true
      this.configData={}
      appConfigAll({userId:row.id}).then((res) => {
        let data=res.data
        const configMap= {}
        for (const config of data.appMgmtConfigs) {
          if (!configMap[config.group]) {
            configMap[config.group] = []
          }
          configMap[config.group].push(config)
        }
        this.configData = configMap
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
    getXb(row){
      if (row.xb === 0) {
        return '保密'
      } else if (row.xb === 1) {
        return '男'
      } else {
        return '女'
      }
    },
    getRole(row){
      if (row.role === 0) {
        return '普通用户'
      } else if (row.role === 1) {
        return '客服'
      } else {
        return '游客'
      }
    },
    // 搜索按钮
    onSearch () {
      this.page.currentPage=1
      this.fetch()
    },
    onReset() {
      this.page.currentPage=1
      this.params={
        id: '',
        nickname: '',
        role: '',
        invitationCode: '',
        status: '',
        createTime_gte: '',
        createTime_lte: '',
      }
      this.fetch()
    },
    // 从接口拉取数据
    fetch () {
      this.loading = true
      if(this.params.time){
        this.params.createTime_gte=new Date(this.params.time[0]).getTime().toString()
        this.params.createTime_lte=new Date(this.params.time[1]).getTime().toString()
      }


      let obj={...this.params}
      delete obj.time
      modelList({ filter:obj,page: {
          page: this.page.currentPage,
          size: this.page.perPage
        }}).then((res) => {
        const { userModelList, count } = res.data
        this.data = userModelList
        this.page.total = count
        this.page.pageCount =userModelList?userModelList.length:0
      }).finally(() => {
        this.loading = false
      })
    },
    // 页数切换
    onCurrentPageChange (page) {
      this.page.currentPage = page
      this.fetch()
    },
    // 每页显示数量修改
    onPerPageChange (perPage) {
      this.page.perPage = perPage
      this.fetch()
    },
    // 关闭抽屉方法
    handleCloseDrawer () {
      this.$refs.drawer.closeDrawer()
      this.$refs.drawerBatch.closeDrawer()
      this.$refs.drawerWallet.closeDrawer()
    },
    // 选中的ID
    handleSelectionChange (rows) {
      this.checkedIds = rows.map(item => item.id)
    },
    // 删除
    onDelete (ids) {
      modelListDelete({ids:ids}).then(() => {
        this.$Message.success(this.$i18n.t('操作成功'))
        setTimeout(() => {
          this.fetch()
        }, 500)
      })
    },
    onUnbindGoogle(ids){
      this.$confirm('确定要解绑谷歌吗？','提示')
          .then(_ => {
            batchUnlockGoogle({ids:ids.join(",")}).then((res)=>{
              this.$Message.success(this.$i18n.t('操作成功'))
              this.fetch()
            }).finally(()=>{
              done();
            })
          })
          .catch(_ => {});
    },
    onhandleJiefeng(row){
      this.mdl={disableIp: false,...row,disable: row.unblockTime>0?true:false}
      this.dialogJiefeng=true
    },
    // 修改
    onEDit (row) {
      this.mdl = Object.assign({}, {...row,mode:'edit'})
      this.drawer = true
    },
    handleWallet(row){
      this.mdl = Object.assign({}, { balance: 0,
        freezeBalance: 0,amount:0,...row})
      this.drawerWallet = true
    },
    // 添加会员等级
    onAdd () {
      this.mdl = Object.assign({}, {
        id: '',
        mobile: '',
        mobileCountryCode: '',
        nickname: '',
        avatar: '',
        xb: 0,
        role: 0,
        adminRemark: '',
        password: '',
        mode:'add'
      })
      this.drawer = true
    },
      onAddBatch(){
              this.mdl = Object.assign({}, {
                id: '',
                idPrefix: '',
                nicknamePrefix: '',
                password: '',
                count: 1,
              })
              this.drawerBatch = true
            },
    dialogJiefengComfim () {
      let params = {
        id: this.mdl.id,
        unblockTime: 0,
        disableIp: false,
      }
      if (!this.mdl.disable) {
        // 禁用
        params.unblockTime = new Date().getTime();
        params.disableIp = this.mdl.disableIp
      }
      modelSwitch(params).then(() => {
        this.$Message.success(this.$i18n.t('操作成功'))
        this.fetch()
      }).catch((error) => {
      }).finally(() => {
        this.dialogJiefeng=false
      })
    },
    onChatRecord(row){
      this.mdl = Object.assign({}, row)
      this.chatRecord = true
    },
    onLogRecord(row){
      this.mdl = Object.assign({}, row)
      this.drawerLog = true
    },
    onJoinedGroup(row){
      this.mdl = Object.assign({}, row)
      this.joinedGroupDialog = true
    }
  }
}
</script>

<style lang="scss" scoped>
.top-tip{
  list-style: none;
  margin-bottom: 10px;
}
</style>
