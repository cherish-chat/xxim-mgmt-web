<template>
  <vab-icon
    class="fold-unfold"
    :icon="collapse ? 'menu-unfold-line' : 'menu-fold-line'"
    :style="classObject"
    @click="toggleCollapse"
  />
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'

  export default {
    name: 'VabFold',
    data() {
      return {}
    },
    computed: {
      ...mapGetters({
        theme: 'settings/theme',
        collapse: 'settings/collapse',
      }),
      classObject() {
        return {
          display:
            ['column'].indexOf(this.theme.layout) + 1 &&
            this.$route.meta.noColumn
              ? 'none'
              : '',
        }
      },
    },
    watch: {
      classObject: {
        handler({ display }) {
          if (display === 'none') this.foldSideBar()
          else this.openSideBar()
        },
        immediate: true,
      },
    },
    methods: {
      ...mapActions({
        openSideBar: 'settings/openSideBar',
        foldSideBar: 'settings/foldSideBar',
        toggleCollapse: 'settings/toggleCollapse',
      }),
    },
  }
</script>

<style lang="scss" scoped>
  .fold-unfold {
    color: $base-color-grey;
    cursor: pointer;
  }
</style>
