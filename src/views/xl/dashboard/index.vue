<template>
  <div class="dashboard-body">
    <div class="item">
      <div class="item-content">
          <div class="item-content-img">
             <i class="el-icon-user-solid"></i>
          </div>
          <div>
            <h3>{{ data.totalMemberCount }}</h3>
            <span>会员总数</span>
          </div>
        </div>
      <div class="item-content">
        <div class="item-content-img green">
          <i class="el-icon-user-solid"></i>
        </div>
        <div>
          <h3>{{ data.yesterdayMemberCount }}</h3>
          <span>昨日新增</span>
        </div>
      </div>
      <div class="item-content">
        <div class="item-content-img red">
          <i class="el-icon-user-solid"></i>
        </div>
        <div>
          <h3>{{ data.todayMemberCount }}</h3>
          <span>今日新增</span>
        </div>
      </div>
    </div>
    <div class="item">
      <div class="item-content">
        <div class="item-content-img qunzu">
          <i class="iconfont icon-qunzu"></i>
        </div>
        <div>
          <h3>{{ data.totalGroupCount }}</h3>
          <span>群总数</span>
        </div>
      </div>
      <div class="item-content">
        <div class="item-content-img green qunzu">
          <i class="iconfont icon-qunzu"></i>
        </div>
        <div>
          <h3>{{ data.yesterdayGroupCount }}</h3>
          <span>昨日新增</span>
        </div>
      </div>
      <div class="item-content">
        <div class="item-content-img red qunzu">
          <i class="iconfont icon-qunzu"></i>
        </div>
        <div>
          <h3>{{ data.todayGroupCount }}</h3>
          <span>今日新增</span>
        </div>
      </div>
    </div>
    <div class="item">
      <div class="item-content">
        <div class="item-content-img">
          <i class="el-icon-user-solid"></i>
        </div>
        <div>
          <h3>{{ data.totalGuestCount }}</h3>
          <span>游客总数</span>
        </div>
      </div>
      <div class="item-content">
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
      </div>
    </div>
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
      "todayGroupCount": 0,
      "todayGuestCount": 0,
      "todayMemberCount": 0,
      "totalGroupCount": 1,
      "totalGuestCount": 3,
      "totalMemberCount": 4,
      "yesterdayGroupCount": 0,
      "yesterdayGuestCount": 0,
      "yesterdayMemberCount": 0
    }
    }
  },
  created() {
    //this.fetch()
  },
  methods:{
    // 从接口拉取数据
    fetch () {
      this.loading = true
      getDashBoard({ }).then((res) => {
        this.data=res.data
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
