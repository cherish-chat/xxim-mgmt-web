/**
 * perm 操作权限处理
 * 指令用法：
 *  <el-button v-perms="['auth.menu/edit']">编辑</el-button>
 */

import store from '@/store/modules/user'
export default {
    inserted(el, binding){
        const { value } = binding
        const permissions = store.state.perms
        //console.log("====permissions",permissions)
        const all_permission = '*'
        if (Array.isArray(value)) {
            if (value.length > 0) {
                const hasPermission = permissions.some((key) => {
                    return all_permission == key || value.includes(key)
                })

                if (!hasPermission) {
                    el.parentNode && el.parentNode.removeChild(el)
                }
            }
        } else {
            throw new Error('like v-perms="[\'auth.menu/edit\']"')
        }
    }
}
