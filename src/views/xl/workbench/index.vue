<template>

<div class="index-container">
<el-card class="content-container" shadow="never">
   <div class="dashboard-body">
    <div class="item">
      <div class="item-content">
          <div class="item-content-img">
             <i class="el-icon-user-solid"></i>
          </div>
          <div>
            <h3>{{ data.newUser }}</h3>
            <span>{{$i18n.t('新注册')}}</span>
          </div>
        </div>
      <div class="item-content">
        <div class="item-content-img green">
          <i class="el-icon-user-solid"></i>
        </div>
        <div>
          <h3>{{ data.newGroup }}</h3>
          <span>{{$i18n.t('新增群聊')}}</span>
        </div>
      </div>
      <div class="item-content">
        <div class="item-content-img red">
          <i class="el-icon-user-solid"></i>
        </div>
        <div>
          <h3>{{ data.todayMsg }}</h3>
          <span>{{$i18n.t('消息数量')}}</span>
        </div>
      </div>
    </div>
    <div class="item">
      <div class="item-content">
        <div class="item-content-img qunzu">
          <i class="el-icon-user-solid"></i>
        </div>
        <div>
          <h3>{{ data.todayMsgUser }}</h3>
          <span>{{$i18n.t('发消息人数')}}</span>
        </div>
      </div>
      <div class="item-content">
        <div class="item-content-img green qunzu">
          <i class="el-icon-user-solid"></i>
        </div>
        <div>
          <h3>{{ data.todayAliveSingle }}</h3>
          <span>{{$i18n.t('活跃单聊')}}</span>
        </div>
      </div>
      <div class="item-content">
        <div class="item-content-img red qunzu">
          <i class="el-icon-user-solid"></i>
        </div>
        <div>
          <h3>{{ data.todayAliveUser }}</h3>
          <span>{{$i18n.t('活跃用户')}}</span>
        </div>
      </div>
    </div>
    <div class="item">
      <div class="item-content">
        <div class="item-content-img">
          <i class="el-icon-user-solid"></i>
        </div>
        <div>
          <h3>{{ data.todayNewFriend }}</h3>
          <span>{{$i18n.t('新增好友')}}</span>
        </div>
      </div>

      <div class="item-content">
        <div class="item-content-img green">
          <i class="el-icon-user-solid"></i>
        </div>
        <div>
          <h3>{{ data.todayAliveGroup }}</h3>
          <span>{{$i18n.t('活跃群聊')}}</span>
        </div>
      </div>

      <div class="item-content" style="visibility:hidden">
        <div class="item-content-img green">
          <i class="el-icon-user-solid"></i>
        </div>
        <div>
          <h3>{{ data.todayAliveGroup }}</h3>
          <span>{{$i18n.t('活跃群聊')}}</span>
        </div>
      </div>
      <!-- <div class="item-content">
        <div class="item-content-img green">
          <i class="el-icon-user-solid"></i>
        </div>
        <div>
          <h3>{{ data.yesterdayGuestCount }}</h3>
          <span>昨日新增</span>
        </div>
      </div>
      <div class="item-content">
        <div class="item-content-img red">
          <i class="el-icon-user-solid"></i>
        </div>
        <div>
          <h3>{{ data.todayGuestCount }}</h3>
          <span>今日新增</span>
        </div>
      </div> -->
    </div>
  </div>
</el-card>


</div>

</template>

<script>
import { getDashBoard } from '@/api/wt/system.js'
export default {
  name: "index",
  data(){
    return {
      loading:false,
      data:{
      "time": "",
      "newUser": 0,
      "newGroup": 0,
      "todayMsg": 0,
      "todayMsgUser": 0,
      "todayAliveGroup": 0,
      "todayAliveSingle": 0,
      "todayAliveUser": 0,
      "todayNewFriend": 0
      }
    }
  },
  created() {
    this.fetch()
  },
  methods:{
    // 从接口拉取数据
    fetch () {
      this.loading = true
      getDashBoard({ }).then((res) => {
        this.data=res.data.today
      }).finally(() => {
        this.loading = false
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.dashboard-body{
  padding-top: 20px;
  .item{
    display: flex;
    margin-bottom:25px;
    .item-content{
      flex:1;
      display: flex;
      align-items: center;
      &-img{
        width: 60px;
        height: 60px;
        background: #00a1ea;
        border-radius: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 30px;
        color:#fff;
        margin-right: 10px;
      }
      h3{
        font-size: 18px;
      }
      span{
        font-size: 14px;
        color: #666;
      }
    }
  }

  .green{
    background: #2aca42 !important;
  }
  .red{
    background: #fd4c4c !important;
  }
  .qunzu i{
    font-size: 25px !important;
  }

}
</style>
