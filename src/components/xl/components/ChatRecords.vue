<template>
    <div class="body">
      <!-- 搜索组件 -->
      <search-form :items="formItems" :params="params" :on-reset="onReset" :on-submit="onSearch" :btn-loading="loading" />
      <!-- 表格区域 -->
      <div class="table-body">
        <!-- 左上角按钮 -->
<!--        <div class="table-left-top">
          <el-button size="mini"  type="primary" icon="el-icon-plus"  @click="onAdd()">添加好友</el-button>
        </div>-->
        <!-- 表格 -->
        <el-table border style="width: 100%;" stripe :data="data" v-loading="loading" >

          <template   v-for="(item,index) in tableColumns">
            <el-table-column
                v-if="item.isHeadShow"
                :key="index"
                :type="item.type?item.type:''"
                align="center"
                show-overflow-tooltip
                :prop="item.props" :label="item.label" :width="item.width" >
              <template slot-scope="scope" >
                <img v-if="item.prop=='avatar'" :src="scope.row[item.prop]" width="30" height="30">
                <div v-else>
                  {{scope.row[item.prop]}}
                </div>
              </template>
            </el-table-column>
          </template>


          <!-- 右侧按钮 -->
          <el-table-column align="center" :label="$i18n.t('ACTION')" fixed="right" :width="300">
            <template slot-scope="scope">
              <el-link type="primary"  icon="el-icon-check" @click="onShowChatRecord(scope.row)">{{$i18n.t('查看聊天记录')}}</el-link>

<!--              <span v-if="!hideClear">
                <el-divider direction="vertical"></el-divider>
              <el-link type="warning"  icon="el-icon-check" @click="onClearChatRecord(scope.row)">清空聊天记录</el-link>
              </span>-->

              <span>
                <el-divider direction="vertical"></el-divider>
              <el-popconfirm
                :title="$i18n.t('确定删除')"
                  @confirm="onDelete(scope.row.id)"
                :ok-text="$i18n.t('确定')"
                :cancel-text="$i18n.t('取消')"
              >
                <el-link slot="reference" type="danger" icon="el-icon-delete">{{$i18n.t('删除好友')}}</el-link>
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
      </div>


      <el-dialog
          class="chat-record"
          append-to-body
          :title="$i18n.t('聊天记录')"
          width="60%"
          :destroy-on-close="true"
          :visible.sync="chatRecord">
        <div style="height: 50vh">
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
          class="chat-record"
          append-to-body
          :title="$i18n.t('添加好友')"

          width="60%"
          :destroy-on-close="true"
          :visible.sync="friendDialog">
        <div style="height: 45vh;overflow: auto">
          <el-form :model="friendForm"  ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="类型">
              <el-radio v-model="friendForm.type" :label="0">{{$i18n.t('个人好友')}}</el-radio>
              <el-radio v-model="friendForm.type" :label="1">{{$i18n.t('群')}}</el-radio>
            </el-form-item>
            <el-form-item label="用户ID/群ID">
              <el-input v-model="friendForm.id" :placeholder="$i18n.t('PLEASE_INPUT', { value: $i18n.t('用户ID/群ID')})"></el-input>
            </el-form-item>
          </el-form>

        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="friendDialogComfirm">{{$i18n.t('确定')}}</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
    import { PAGES_SIZE } from '@/config/constants'
    import SearchForm from '@/components/SearchForm'
    import { friendList,msgList,memberFriendDelete,InsertMemberFriend ,clearChatMessage} from '@/api/wt/system'
    import wxChat from './wxChatcomponents/wxChat.vue'
    export default {
        name: 'formModal',
      components:{
        SearchForm,
        wxChat
      },
        props: {
            mdl: {
                type: Object,
                required: true
            },
          hideClear:{
            type:Boolean,
            default:false
          },
          hideDelete:{
            type:Boolean,
            default:false
          }
        },
        watch: {
            mdl: {
                handler (newVal) {
                    this.btnDisable = false
                },
                deep: true
            }
        },
        data () {
        return {
          PAGES_SIZE,
          params:{},
          loading:false,
          data:[],
          key:new Date().getTime(),
          friendForm:{
            type:0,
            id:''
          },
          page: {
            total: 0,
            currentPage: 1,
            perPage: 5,
            pageCount: 1
          },
          pageChatRecord: {
            currentPage: 1,
            perPage: 10
          },
          tableColumns:[
            {
              label:this.$i18n.t('头像'),
              prop:'avatar',
              isHeadShow:true
            },
            {
              label:this.$i18n.t('登录账号'),
              prop:'userId',
              isHeadShow:true
            },
            {
              label:this.$i18n.t('昵称'),
              prop:'nickname',
              isHeadShow:true
            },
            {
              label:this.$i18n.t('角色'),
              prop:'role',
              isHeadShow:true
            }
          ],
          chatRecord:false,
          friendDialog:false,
          wxChatData: []
        }
      },
        computed: {
        formItems () {
          // 构建搜索表单
          return [
            { title: this.$i18n.t('账号'), type: 'input', key: 'id' },
            { title: this.$i18n.t('昵称'), type: 'input', key: 'nickname' }
          ]
        }
      },
        created () {
          this.fetch()
        },
        methods: {
          friendDialogComfirm () {
            InsertMemberFriend({
              add_type: this.friendForm.type,
              id: this.friendForm.id,
              friendIds: [this.mdl.id]
            }).then((res) => {
              this.$Message.success(this.$i18n.t('操作成功'))
              this.fetch()
            })
            this.friendDialog = false
          },
          onAdd () {
            this.friendDialog = true
          },

          //向上滚动加载数据
          getUpperData () {
            var me = this;

            // 这里为模拟异步加载数据
            // 实际上你可能要这么写:
            // return axios.get('xxx').then(function(result){
            //     return result;  //result的格式需要类似下面resolve里面的数组
            // })
            return new Promise(function (resolve) {
              setTimeout(function () {
                //模拟加载完毕
                if (me.upperTimes > 3) {
                  return resolve([]);
                }

                //加载数据
                resolve([{
                      direction: 2,
                      id: me.upperId - 1,
                      type: 1,
                      content: '向上滚动加载第 ' + me.upperTimes + ' 条！',
                      ctime: new Date().toLocaleString()
                    },
                      {
                        direction: 1,
                        id: me.upperId - 2,
                        type: 1,
                        content: '向上滚动加载第 ' + me.upperTimes + ' 条！',
                        ctime: new Date().toLocaleString()
                      }]
                )
              }, 1000);
              me.upperId = me.upperId + 2;
              me.upperTimes++;
            })
          },

          getUnderData () {
            var me = this;

            //意义同getUpperData()
            return new Promise(function (resolve) {
              setTimeout(function () {
                //模拟加载完毕
                if (me.underTimes > 3) {
                  return resolve([]);
                }

                //加载数据
                resolve(
                    [{
                      direction: 1,
                      id: me.underId + 1,
                      type: 1,
                      content: '向下滚动加载第 ' + me.underTimes + ' 条！',
                      ctime: new Date().toLocaleString()
                    },
                      {
                        direction: 2,
                        id: me.underId + 2,
                        type: 1,
                        content: '向下滚动加载第 ' + me.underTimes + ' 条！',
                        ctime: new Date().toLocaleString()
                      }]
                )
              }, 1000);

              me.underId = me.underId + 2;
              me.underTimes++;
            })
          },

          onShowChatRecord (row) {
            this.from_id = this.mdl.id
            this.recv_id=row.userId
            this.getChatData(row.userId)
          },
          getChatData (toId) {
            let convId = "single:";
            console.log("===xx",this.mdl.id,toId)
            if (this.mdl.id > toId) {
              convId += (toId + '-' + this.mdl.id);
            } else {
              convId += this.mdl.id + "-" + toId;
            }

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

              }
              this.$nextTick(() => {
                this.chatRecord = true
              })
            })
          },
          onClearChatRecord (row) {
            this.from_id = this.mdl.id
            this.to_id = row.id;
            clearChatMessage({
              from_id: this.from_id,
              to_id: this.to_id,
            }).then((res) => {
              this.$Message.success(this.$i18n.t('操作成功'))
            })
          },
          prePage () {
            if(this.pageChatRecord.currentPage==1)return
            if (this.pageChatRecord.currentPage > 1) {
              this.pageChatRecord.currentPage--
            }
            this.getChatData(this.recv_id)
          },
          nextPage () {
            this.pageChatRecord.currentPage++
            this.getChatData(this.recv_id)
          },
          onSearch () {
            this.page.currentPage=1
            this.fetch()
          },
          onReset () {
            this.page.currentPage=1
            this.params = {}
            this.fetch()
          },
          // 从接口拉取数据
          fetch () {
            this.loading = true
            friendList({
              filter: this.params,
              userId: this.mdl.id,
              page: {
                page: this.page.currentPage,
                size: this.page.perPage
              }
            }).then((res) => {
              const {
                friendList,
                total
              } = res.data
              this.data = friendList
              this.page.total = total
              this.page.pageCount = friendList ? friendList.length : 0
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
          submitForm () {
            // 先清空表单错误提示
            this.errors = {}
            this.submitLogin = true
            // 设置手动接管message提示
            this.$store.dispatch('MessageTake', true)
            this.errorMessage = ''
            if (this.mdl.id === 0) {
              createUserLevel(this.mdl).then(() => {
                // 关闭抽屉
                this.handleCloseDrawer()
                this.$Message.success(this.$i18n.t('操作成功'))
                // 调用爷爷组件刷新数据
                this.$parent.$parent.fetch()
              }).catch((error) => {
                // 后端过来的表单错误回显
                this.errors = Object.assign({}, { ...this.errors, ...error.errors })
                // 手动处理错误
                if (!error.errors) {
                  this.errorMessage = error.message
                }
              }).finally(() => {
                this.submitLogin = false
              })
            } else {
              editUserlevel(this.mdl.id, this.mdl).then(() => {
                // 关闭抽屉
                this.handleCloseDrawer()
                this.$Message.success(this.$i18n.t('操作成功'))
                // 调用爷爷组件刷新数据
                this.$parent.$parent.fetch()
              }).catch((error) => {
                // 后端过来的表单错误回显
                this.errors = Object.assign({}, { ...this.errors, ...error.errors })
                // 手动处理错误
                if (!error.errors) {
                  this.errorMessage = error.message
                }
              }).finally(() => {
                this.submitLogin = false
              })
            }
          },
          onDelete (id) {
            memberFriendDelete({friendId: id, userId: this.mdl.id}).then(() => {
              this.$Message.success(this.$i18n.t('操作成功'))
              this.fetch()
            })
          }
        }
    }
</script>
<style lang="scss" scoped>
    .body {
        padding-right: 25px;
        width: 100%;
    }
    ::v-deep.el-checkbox__label {
        font-size: 12px;
    }
    .pic-select{
       ::v-deep.el-upload--picture-card{
        width:100px;
        height:100px;
        line-height: 100px;
      }
       ::v-deep.el-upload-list--picture-card .el-upload-list__item{
        width:100px;
        height:100px;
        line-height: 100px;
      }
    }
</style>
<style lang="scss">

.chat-record{
  .dialog-footer{

  }
}
</style>
