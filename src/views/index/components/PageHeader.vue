<template>
  <el-col :span="24">
    <el-card class="page-header" shadow="never">
      <el-avatar class="page-header-avatar" :src="avatar" />
      <div class="page-header-tip">
        <p class="page-header-tip-title">
          {{ handleTips() }}
        </p>
        <p class="page-header-tip-description" v-html="description"></p>
      </div>
      <div class="page-header-avatar-list">
        <vab-avatar-list :avatar-list="avatatList" />
        <p>participants</p>
      </div>
    </el-card>
  </el-col>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { getList } from '@/api/description'
  import VabAvatarList from '@/extra/VabAvatarList'

  export default {
    components: { VabAvatarList },
    data() {
      return {
        description: '',
        avatatList: [
          {
            avatar: 'https://i.gtimg.cn/club/item/face/img/2/15922_100.gif',
            username: 'good luck',
          },
          {
            avatar:
              'https://fastly.jsdelivr.net/gh/chuzhixin/image/user/fwfmiao.gif',
            username: 'LiufengFish',
          },
          {
            avatar: 'https://i.gtimg.cn/club/item/face/img/3/15643_100.gif',
            username: '嘻嘻',
          },
        ],
      }
    },
    computed: {
      ...mapGetters({
        avatar: 'user/avatar',
        username: 'user/username',
      }),
    },
    created() {
      this.fetchData()
    },
    methods: {
      handleTips() {
        const hour = new Date().getHours()
        return hour < 8
          ? `${this.$i18n.t('早上好')} ${this.username}，${this.$i18n.t('又是元气满满的一天')}。`
          : hour <= 11
          ? `${this.$i18n.t('上午好')} ${this.username}，${this.$i18n.t('看到你我好开心')}。`
          : hour <= 13
          ? `${this.$i18n.t('中午好')} ${this.username}，${this.$i18n.t('忙碌了一上午，记得吃午饭哦')}。`
          : hour < 18
          ? `${this.$i18n.t('下午好')} ${this.username}，${this.$i18n.t('你一定有些累了，喝杯咖啡提提神')}。`
          : `${this.$i18n.t('晚上好')} ${this.username}，${this.$i18n.t('愿你天黑有灯，下雨有伞')}。`
      },
      async fetchData() {
        const {
          data: { description },
        } = await getList()
        this.description = description
      },
    },
  }
</script>

<style lang="scss" scoped>
  .page-header {
    min-height: 125px;
    transition: none;

    :deep() {
      * {
        transition: none;
      }

      .el-card__body {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
      }
    }

    &-avatar {
      width: 60px;
      height: 60px;
      margin-right: 20px;
      border-radius: 50%;
    }

    &-tip {
      flex: auto;
      width: calc(100% - 200px);
      min-width: 200px;

      &-title {
        margin-bottom: 12px;
        font-size: 20px;
        font-weight: bold;
        color: #3c4a54;
      }

      &-description {
        min-height: 20px;
        font-size: $base-font-size-default;
        color: #808695;
      }
    }

    &-avatar-list {
      flex: 1;
      min-width: 100px;
      margin-left: 20px;
      text-align: right;

      p {
        margin-right: 9px;
        line-height: 0;
      }
    }
  }
</style>
