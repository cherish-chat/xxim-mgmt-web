<template>
  <div style="font-size: 30px;color: #f00">添加IP {{ip}} 成功</div>
</template>

<script>
import { IPAdd} from '@/api/wt/system'
export default {
  name: "ipadd",
  data(){
    return {
      ip:''
    }
  },
  created() {
    IPAdd({}).then((res)=>{
      this.ip=res.data.ip
    })
  }
}
</script>

<style scoped>

</style>
