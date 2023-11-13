import  {axios}  from '@/utils/wtrequest'
export function login (data) {
    return axios({
        url: '/api/ms/login',
        method: 'post',
        data
    })
}

export function getUserInfo (data) {
    return axios({
        url: '/api/ms/get/admin/detail/self',
        method: 'post',
        data
    })
}



// 获取菜单接口
export function getMenu (data) {
    return axios({
        url: '/api/ms/get/menu/list',
        method: 'post',
        data
    })
}


