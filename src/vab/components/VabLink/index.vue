<template>
  <component :is="type(to)" v-bind="linkProps(to)">
    <slot />
  </component>
</template>

<script>
  import { isExternal } from '@/utils/validate'

  export default {
    name: 'VabLink',
    props: {
      to: {
        type: String,
        required: true,
      },
    },
    methods: {
      type(to) {
        return isExternal(to) ? 'a' : 'router-link'
      },
      linkProps(to) {
        return isExternal(to)
          ? {
              href: to,
              target: '_blank',
              rel: 'noopener',
            }
          : {
              to: to,
            }
      },
    },
  }
</script>
