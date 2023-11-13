<template>
  <el-dropdown v-if="theme.showLanguage" @command="handleCommand">
    <vab-icon icon="translate" />
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="zh">中文简体</el-dropdown-item>
        <el-dropdown-item command="zh-TW">zh-TW</el-dropdown-item>
        <el-dropdown-item command="hi">hi</el-dropdown-item>
        <el-dropdown-item command="id">id</el-dropdown-item>
        <el-dropdown-item command="ja">ja</el-dropdown-item>
        <el-dropdown-item command="ko">ko</el-dropdown-item>
        <el-dropdown-item command="pt">pt</el-dropdown-item>
        <el-dropdown-item command="ru">ru</el-dropdown-item>
        <el-dropdown-item command="th">th</el-dropdown-item>
        <el-dropdown-item command="ur">ur</el-dropdown-item>
        <el-dropdown-item command="vi">vi</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import getPageTitle from '@/utils/pageTitle'

  export default {
    name: 'VabLanguage',
    computed: {
      ...mapGetters({
        theme: 'settings/theme',
      }),
    },
    methods: {
      ...mapActions({
        changeLanguage: 'settings/changeLanguage',
      }),
      handleCommand(command) {
        this.changeLanguage(command)
        this.$i18n.locale = command
        document.title = getPageTitle(this.$route.meta.title)
      },
    },
  }
</script>
