<template>
  <div class="group-container">

    <el-card class="query-container" shadow="never">
        <vab-query-form>
        <vab-query-form-left-panel :span="24">
          <!-- 搜索组件 -->
          <search-form ref="searchForm" :items="formItems" :params="params" :on-reset="onReset" :on-submit="onSearch" :btn-loading="loading" />
        </vab-query-form-left-panel>
        </vab-query-form>
    </el-card>


    <el-card class="content-container" shadow="never">

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

              <div v-if="item.prop=='avatar'">
                <el-image :src="scope.row.avatar" style="width: 30px;height:30px"  class="w-10 h-10 rounded-full"/>
              </div>
              <div v-else-if="item.prop=='dismissTime'">
                <el-tag v-if="scope.row.dismissTime !== 0" type="danger">{{$i18n.t('于')}}{{ scope.row.dismissTimeStr }}{{$i18n.t('解散')}}</el-tag>
                <el-tag v-if="scope.row.allMute" type="warning">{{$i18n.t('全员禁言')}}</el-tag>
                <el-tag v-if="scope.row.dismissTime === 0 && !scope.row.allMute" type="success">{{$i18n.t('正常')}}</el-tag>
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
            <el-link  v-perms="['group:model:edit']" type="primary"   @click="onEDit(scope.row)">{{$i18n.t('编辑群')}}</el-link>
            <el-divider  v-perms="['group:model:edit']" direction="vertical"></el-divider>
            <el-link  v-perms="['group:model:edit']" type="primary"   @click="onShowChatRecord(scope.row)">{{$i18n.t('聊天记录')}}</el-link>
              <el-divider direction="vertical"></el-divider>
                        <el-link type="primary"   @click="onAddChatMechine(scope.row)">{{$i18n.t('加入僵尸号')}}</el-link>
                      <el-divider direction="vertical"></el-divider>
                      <el-link type="danger"  @click="removeMechine(scope.row)">{{$i18n.t('移除僵尸号')}}</el-link>
            <el-divider  v-perms="['group:model:del']" direction="vertical"></el-divider>
            <el-link  v-perms="['group:model:del']" type="danger"   @click="deleteGroup(scope.row,scope.row.dismissTime)">{{$i18n.t('解散')}}</el-link>
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
        :title="mdl.id > 0 ? $i18n.t('编辑') : $i18n.t('新增')"
        :visible.sync="drawer"
        destroy-on-close
        ref="drawer"
        size="400px"
    >
      <form-modal :mdl="mdl" :handle-close-drawer="handleCloseDrawer"></form-modal>
    </el-drawer>
    <el-dialog
        append-to-body
        :title="$i18n.t('聊天记录')"
        width="60%"
        v-if="chatRecord"
        :destroy-on-close="true"
        :visible.sync="chatRecord">
      <div style="min-height: 50vh;overflow: auto">
        <wxChat
            :key="key"
            :data="wxChatData"
            :showShade="false"
        >
        </wxChat>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="prePage">{{$i18n.t('上一页')}}</el-button>
        <el-button type="primary" @click="nextPage" >{{$i18n.t('下一页')}}</el-button>
      </div>
    </el-dialog>
    <el-dialog
        append-to-body
        :title="$i18n.t('加入僵尸号')"
        width="60%"
        v-if="mechineDialog"
        :visible.sync="mechineDialog">
      <div style="min-height: 50vh">
        <el-form>
          <el-form-item :label="$i18n.t('加入数量')" :label-width="100">
            <el-input-number v-model="mdl.count" autocomplete="off"></el-input-number>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="mechineDialog = false">{{$i18n.t('取消')}}</el-button>
        <el-button type="primary" @click="mechineComfirm">{{$i18n.t('确定')}}</el-button>
      </div>
    </el-dialog>


  </div>
</template>
<script>
    import SearchForm from '@/components/SearchForm'
    import { PAGES_SIZE } from '@/config/constants'
    import { groupList ,msgList,groupAddRobot,remoteGroupRobot,groupDismiss} from '@/api/wt/system'
    import FormModal from '@/components/xl/group/FormModal'
    import configs from '@/config'
    import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
    import wxChat from '@/components/xl/components/wxChatcomponents/wxChat.vue'

    export default {
        name: 'ServiceRegister',
        components: { SearchForm, FormModal, ElImageViewer,wxChat },
        data () {
            return {
                PAGES_SIZE,
                params: {},
                data: [],
                tableColumns:[
                  {
                    label:this.$i18n.t('头像'),
                    prop:'avatar',
                    isHeadShow:true,
                    width:100
                  },
                    {
                  label:this.$i18n.t('群ID'),
                  prop:'id',
                  isHeadShow:true,
                  width:150
                },
                {
                  label:this.$i18n.t('群名称'),
                  prop:'name',
                  isHeadShow:true,
                  width: 150,
                },
                {
                  label:this.$i18n.t('群主'),
                  prop:'owner',
                  isHeadShow:true,
                  width:150
                },
                {
                  label:this.$i18n.t('描述'),
                  prop:'description',
                  isHeadShow:true,
                  width:150
                },
                {
                  label:this.$i18n.t('群人数'),
                  prop:'memberCount',
                  isHeadShow:true,
                  width:80
                },
                {
                  label:this.$i18n.t('状态'),
                  prop:'dismissTime',
                  isHeadShow:true,
                  width: 150,
                },
                {
                  label:this.$i18n.t('创建时间'),
                  prop:'createTimeStr',
                  isHeadShow:true,
                  width: 150,
                },
                {
                  label:this.$i18n.t('后台备注'),
                  prop:'adminRemark',
                  isHeadShow:true,
                   width: 150,
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
                chatRecord:false,
                mechineDialog:false,
                dialogTableVisible: false,
                mdl: {},
                checkedIds: [],
                isShowPictures: false,
                picture: [],
                config: configs,
                pageChatRecord: {
                  currentPage: 1,
                  perPage: 10
                },
              wxChatData:[],
              key:new Date().getTime()
            }
        },
        created () {
            this.fetch()
        },
        computed: {
            formItems () {
              const statusOptions = [
                { label: this.$i18n.t('全部'), value: '' },
                { label: this.$i18n.t('正常'), value: 'normal' },
                { label: this.$i18n.t('解散'), value: 'dismiss' },
                { label: this.$i18n.t('禁言全部用户'), value: 'mute' },
                { label: this.$i18n.t('禁言普通用户'), value: 'muteNormal' },

              ]

                // 构建搜索表单
                return [
                    { title: this.$i18n.t('群ID'), type: 'input', key: 'id' },
                  { title: this.$i18n.t('群名称'), type: 'input', key: 'name' },
                  { title: this.$i18n.t('群主'), type: 'input', key: 'owner' },
                  { title:this.$i18n.t('注册时间'), type: 'el-date-picker', key: 'time' },
                  { title: this.$i18n.t('状态'), type: 'select', key: 'status', options: statusOptions }
                ]
            },
            isShowDivider () {
                const { meta } = this.$store.getters.router
                return meta.actions.indexOf('update') > -1 && meta.actions.indexOf('delete') > -1
            }
        },
        methods: {
          prePage(){
            if(this.pageChatRecord.currentPage==1)return
            if(this.pageChatRecord.currentPage>1){
              this.pageChatRecord.currentPage--
            }
            this.getChatData(this.recv_id)
          },
          nextPage(){
            this.pageChatRecord.currentPage++
            this.getChatData(this.recv_id)
          },
          onShowChatRecord (row) {
            this.wxChatData = []
            this.recv_id=row.id
            this.getChatData(row.id)
            this.chatRecord = true
          },
          getChatData (toId) {
            let convId = "group:"+toId;
            msgList({
              filter: {},
              convId: convId,
              page: {
                page: this.pageChatRecord.currentPage,
                size: this.pageChatRecord.perPage
              }
            }).then((res) => {
              this.wxChatData = []
              this.key = new Date().getTime()
              if (res.data && res.data.msgDataList) {
                for (let i = 0; i < res.data.msgDataList.length; i++) {
                  let item = res.data.msgDataList[i]
                  let userInfo = res.data.userMap[item.senderId]
                  item.nickname = ""
                  item.avatar = ""
                  item.serverTime = res.data.msgDataList[i].serverTime

                  if (userInfo) {
                    userInfo = JSON.parse(userInfo)
                    item.nickname = userInfo.nickname
                    item.avatar = userInfo.avatar
                  }

                  if (item.senderId == this.mdl.id) {
                    item.direction = 1
                  } else {
                    item.direction = 2
                  }
                }
                this.wxChatData = res.data.msgDataList
                this.$nextTick(() => {
                  this.chatRecord = true
                })
              }
            })
          },
            // 搜索按钮
            onSearch () {
              this.page.currentPage=1
              this.fetch()
            },
          onReset() {
            this.page.currentPage=1
            this.params={}
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
                groupList({filter:obj,
                  page: {
                    page: this.page.currentPage,
                    size: this.page.perPage
                  }
                }).then((res) => {
                    // eslint-disable-next-line camelcase
                    const { groupModels, total } = res.data
                    this.data = groupModels
                    this.page.total = total
                    // eslint-disable-next-line camelcase
                    this.page.pageCount = groupModels?groupModels.length:0
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
            },
            // 选中的ID
            handleSelectionChange (rows) {
                this.checkedIds = rows.map(item => item.id)
            },
            // 删除
            onDelete (ids) {
               /* deleteUserLevel(ids.join(',')).then(() => {
                    this.$Message.success(this.$i18n.t('操作成功'))
                    setTimeout(() => {
                        this.fetch()
                    }, 500)
                })*/
            },
            // 修改
            onEDit (row) {
                this.mdl = Object.assign({}, {...row,mode:'edit'})
                this.drawer = true
            },
            onAddChatMechine(row){
              this.mdl = Object.assign({}, {
                groupId:row.id,
                count:1
              })
              this.mechineDialog = true
            },
             mechineComfirm(){
               groupAddRobot(this.mdl).then((res)=>{
                 this.$Message.success(this.$i18n.t('操作成功'))
                 this.fetch()
               })
               this.mechineDialog = false
             },
            removeMechine(row){
              this.$confirm('确认移除所有机器人？','提示')
                  .then(_ => {
                    remoteGroupRobot({groupId:row.id}).then(()=>{
                      this.$Message.success(this.$i18n.t('操作成功'))
                      this.fetch()
                    })
                    done();
                  })
                  .catch(_ => {});
            },
            deleteGroup(row,time){
              this.$confirm('确认解散群？','提示')
                  .then(_ => {
                    groupDismiss({ids:[row.id]}).then(()=>{
                      this.$Message.success(this.$i18n.t('操作成功'))
                      this.fetch()
                    })
                    done();
                  })
                  .catch(_ => {});
            },
            // 添加会员等级
            onAdd () {
                this.mdl = Object.assign({}, {
                    id: 0,
                    name: '',
                    icon: '',
                    day: 0,
                    hour: 0,
                    minute: 0,
                    type: 0,
                    price: 0
                })
                this.drawer = true
            },
            checkPicture (picture) {
                this.isShowPictures = true

                this.picture[0] = this.config.staticUrl + picture
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
