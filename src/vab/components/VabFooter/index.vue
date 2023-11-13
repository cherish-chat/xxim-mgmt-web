<template>
  <footer class="vab-footer">
    Copyright
    <vab-icon icon="copyright-line" />
    {{ fullYear }} {{ title }}
  </footer>
</template>

<script>
  import { title } from '@/config'

  export default {
    name: 'VabFooter',
    data() {
      return {
        fullYear: new Date().getFullYear(),
        title,
      }
    },
  }
</script>

<style lang="scss" scoped>
  .vab-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 55px;
    padding: 0 $base-padding 0 $base-padding;
    color: rgba(0, 0, 0, 0.45);
    background: $base-color-white;
    border-top: 1px dashed $base-border-color;
    font-size: $base-font-size-small;
    i {
      margin: 0 5px;
    }
  }
</style>
