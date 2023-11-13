<template>
  <vab-icon
    v-if="theme.showRefresh"
    icon="refresh-line"
    @click="refreshRoute"
  />
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'VabRefresh',
    computed: {
      ...mapGetters({
        theme: 'settings/theme',
        extra: 'settings/extra',
        visitedRoutes: 'tabs/visitedRoutes',
      }),
    },
    methods: {
      async refreshRoute() {
        this.$baseEventBus.$emit('reload-router-view')
      },
    },
  }
</script>
