<template>
  <div class="iframe-container">
    <iframe frameborder="0" :src="url" />
  </div>
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    name: 'Iframe',
    data() {
      return { url: '' }
    },
    created() {
      this.handleIframe()
    },
    methods: {
      ...mapActions({
        changeTabsMeta: 'tabs/changeTabsMeta',
      }),
      handleIframe() {
        this.url = `https://${this.$route.query.url}`

        const meta = { ...this.$route.meta, ...this.$route.query }
        this.$nextTick(() => {
          this.changeTabsMeta({
            title: 'Iframe',
            meta,
          })
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  .iframe-container {
    iframe {
      width: 100%;
      height: $base-keep-alive-height;
    }
  }
</style>
