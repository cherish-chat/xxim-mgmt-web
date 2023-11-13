import  {axios}  from '@/utils/wtrequest'


export function rechargeWallet(data) {
  return axios({
    url: '/api/usermgmt/recharge/wallet',
    data: data,
    method: 'post',
  })
}

export function walletDetail(data) {
  return axios({url: '/api/usermgmt/get/wallet/detail',
    data: data,
    method: 'post',
  })
}



export function getAddressBook(data) {
  return axios({
    url: '/api/appmgmt/get/addressbook',
    method: 'post',
    data
  })
}


export function editAddressBook(data) {
  return axios({
    url: '/api/appmgmt/update/addressbook',
    method: 'post',
    data
  })
}

export function richarticleLists(data) {
  return axios({
    url: '/api/appmgmt/get/richArticle/list/all',
    method: 'post',
    data
  })
}


export function richarticleAdd(data) {
  return axios({
    url: '/api/appmgmt/add/richArticle',
    method: 'post',
    data
  })
}


export function richarticleEdit(data) {
  return axios({
    url: '/api/appmgmt/update/richArticle',
    method: 'post',
    data
  })
}


export function richarticleDelete(data) {
  return axios({
    url: '/api/appmgmt/delete/richArticle',
    method: 'post',
    data
  })
}


// 角色列表
export function noticeLists(data) {
  return axios({
    url: '/api/appmgmt/get/notice/list/all',
    method: 'post',
    data
  })
}


// 添加角色
export function noticeAdd(data) {
  return axios({
    url: '/api/appmgmt/add/notice',
    method: 'post',
    data
  })
}

// 编辑角色
export function noticeEdit(data) {
  return axios({
    url: '/api/appmgmt/update/notice',
    method: 'post',
    data
  })
}

// 删除角色
export function noticeDelete(data) {
  return axios({
    url: '/api/appmgmt/delete/notice',
    method: 'post',
    data
  })
}


//屏蔽词列表
export function shieldwordLists(data) {
  return axios({
    url: '/api/appmgmt/get/shieldword/list/all',
    method: 'post',
    data
  })
}

//屏蔽词新增
export function shieldwordAdd(data) {
  return axios({
    url: '/api/appmgmt/add/shieldword',
    method: 'post',
    data
  })
}
//屏蔽词修改
export function shieldwordEdit(data) {
  return axios({
    url: '/api/appmgmt/update/shieldword',
    method: 'post',
    data
  })
}

//屏蔽词删除
export function shieldwordDelete(data) {
  return axios({
    url: '/api/appmgmt/delete/shieldword',
    method: 'post',
    data
  })
}


// 链接列表
export function linkLists(data) {
  return axios({
    url: '/api/appmgmt/get/link/list/all',
    method: 'post',
    data
  })
}

// 链接详情
export function linkDetail(data) {
  return axios({
    url: '/api/appmgmt/get/link/detail',
    method: 'post',
    data
  })
}

// 链接添加
export function linkAdd(data) {
  return axios({
    url: '/api/appmgmt/add/link',
    method: 'post',
    data
  })
}

//链接编辑
export function linkEdit(data) {
  return axios({
    url: '/api/appmgmt/update/link',
    method: 'post',
    data
  })
}

// 删除角色
export function linkDelete(data) {
  return axios({
    url: '/api/appmgmt/delete/link',
    method: 'post',
    data
  })
}


//获取验证码
export function captcha(data) {
  return axios({
    url: '/api/ms/login/captcha',
    method: 'post',
    data
  })
}


// 添加角色
export function luaconfigAdd(data) {
  return axios({
    url: '/api/ms/add/luaconfig',
    method: 'post',
    data
  })
}

// 编辑角色
export function luaconfigEdit(data) {
  return axios({
    url: '/api/ms/update/luaconfig',
    method: 'post',
    data
  })
}

export function luaconfigDelete(data) {
  return axios({
    url: '/api/ms/delete/luaconfig',
    method: 'post',
    data
  })
}
export function luaconfigList(data){
  return axios({
    url: '/api/ms/get/luaconfig/list/all',
    method: 'post',
    data
  })
}

export function modelBatchInsertZombie(data){
    return axios({
        url: '/api/usermgmt/batch/create/zombie',
        method: 'post',
        data
    })
}

export function getMenuTableList(data) {
    return axios({
        url: '/api/ms/get/menu/list/all',
        method: 'post',
        data
    })
}

export function deleteMenu(data) {
    return axios({
        url: '/api/ms/delete/menu',
        method: 'post',
        data
    })
}

/*添加菜单*/
export function addMenu(data) {
    return axios({
        url: '/api/ms/add/menu',
        method: 'post',
        data
    })
}

/*菜单详情*/
export function menuDetail(data) {
    return axios({
        url: '/api/ms/get/menu/detail',
        method: 'post',
        data
    })
}
/*菜单编辑*/
export function menuUpdate(data) {
    return axios({
        url: '/api/ms/update/menu',
        method: 'post',
        data
    })
}

/*api列表*/
export function apipathList(data) {
    return axios({
        url: '/api/ms/get/apipath/list/all',
        method: 'post',
        data
    })
}


export function addApi(data) {
    return axios({
        url: '/api/ms/add/apipath',
        method: 'post',
        data
    })
}

export function  apiPathEdit(data) {
    return axios({
        url: '/api/ms/update/apipath',
        method: 'post',
        data
    })
}

export function  apiPathDelete(data) {
    return axios({
        url: '/api/ms/delete/apipath',
        method: 'post',
        data
    })
}

export function  ipwhitelist(data) {
    return axios({
        url: '/api/ms/get/ipwhitelist/list/all',
        method: 'post',
        data
    })
}

export function  ipwhitelistAdd(data) {
    return axios({
        url: '/api/ms/add/ipwhitelist',
        method: 'post',
        data
    })
}

export function  ipwhitelistUpdate(data) {
    return axios({
        url: '/api/ms/update/ipwhitelist',
        method: 'post',
        data
    })
}

export function  ipwhitelistDelete(data) {
    return axios({
        url: '/api/ms/delete/ipwhitelist',
        method: 'post',
        data
    })
}

export function  operationlogList(data) {
    return axios({
        url: '/api/ms/get/operationlog/list/all',
        method: 'post',
        data
    })
}

export function  logDetail(data) {
    return axios({
        url: '/api/ms/get/operationlog/detail',
        method: 'post',
        data
    })
}

export function  loginlogList(data) {
    return axios({
        url: '/api/ms/get/loginlog/list/all',
        method: 'post',
        data
    })
}

export function  devopConfigAll(data) {
    return axios({
        url: '/api/server/get/config/all',
        method: 'post',
        data
    })
}

export function  updateDevopConfigAll(data) {
    return axios({
        url: '/api/server/update/config',
        method: 'post',
        data
    })
}

export function appConfigAll(data) {
    return axios({
        url: '/api/appmgmt/get/config/list/all',
        method: 'post',
        data
    })
}


export function appConfigEdit(data) {
    return axios({
        url: '/api/appmgmt/update/config',
        method: 'post',
        data
    })
}

export function invitationcodeList(data) {
    return axios({
        url: '/api/usermgmt/get/invitationcode/list/all',
        method: 'post',
        data
    })
}


export function invitationcodeAdd(data) {
    return axios({
        url: '/api/usermgmt/add/invitationcode',
        method: 'post',
        data
    })
}
export function invitationcodeDetail(data) {
    return axios({
        url: '/api/usermgmt/get/invitationcode/detail',
        method: 'post',
        data
    })
}
export function invitationcodeUpdate(data) {
    return axios({
        url: '/api/usermgmt/update/invitationcode',
        method: 'post',
        data
    })
}

export function invitationcodeDelete(data) {
    return axios({
        url: '/api/usermgmt/delete/invitationcode',
        method: 'post',
        data
    })
}


/**会员管理*/
export function modelList(data) {
    return axios({
        url: '/api/usermgmt/get/model/list/all',
        method: 'post',
        data
    })
}

/**会员管理-添加*/
export function modelListAdd(data) {
    return axios({
        url: '/api/usermgmt/add/model',
        method: 'post',
        data
    })
}

/**会员管理-更新*/
export function modelListUpdate(data) {
    return axios({
        url: '/api/usermgmt/update/model',
        method: 'post',
        data
    })
}

/**会员管理-删除*/
export function modelListDelete(data) {
    return axios({
        url: '/api/usermgmt/delete/model',
        method: 'post',
        data
    })
}

/**会员管理-解封*/
export function modelSwitch(data) {
    return axios({
        url: '/api/usermgmt/switch/model',
        method: 'post',
        data
    })
}

/*会员-好友列表*/
export function friendList(data) {
    return axios({
        url: '/api/usermgmt/get/friend/list/all',
        method: 'post',
        data
    })
}




/*会员-好友聊天记录*/
export function msgList(data) {
    return axios({
        url: '/api/msgmgmt/get/msg/list/all',
        method: 'post',
        data
    })
}
/*会员-群好友*/
export function friendGroupList(data) {
    return axios({
        url: '/api/usermgmt/get/group/list/all',
        method: 'post',
        data
    })
}



/*会员-好友删除*/
export function memberFriendDelete(data) {
    return axios({
        url: '/api/usermgmt/delete/friend',
        method: 'post',
        data
    })
}

/*登录日志管理*/
export function loginrecordList(data) {
    return axios({
        url: '/api/usermgmt/get/loginrecord/list/all',
        method: 'post',
        data
    })
}

/*app线路*/
export function appLineList(data) {
    return axios({
        url: '/api/server/get/app/line',
        method: 'post',
        data
    })
}

export function updateAppList(data) {
    return axios({
        url: '/api/server/update/app/line',
        method: 'post',
        data
    })
}

export function groupList(data) {
    return axios({
        url: '/api/groupmgmt/get/model/list/all',
        method: 'post',
        data
    })
}

export function groupDismiss(data) {
    return axios({
        url: '/api/groupmgmt/dismiss/model',
        method: 'post',
        data
    })
}

export function groupUpdate(data) {
    return axios({
        url: '/api/groupmgmt/update/model',
        method: 'post',
        data
    })
}
export function defaultconvList(data) {
    return axios({
        url: '/api/usermgmt/get/defaultconv/list/all',
        method: 'post',
        data
    })
}

export function defaultconvDelete(data) {
    return axios({
        url: '/api/usermgmt/delete/defaultconv',
        method: 'post',
        data
    })
}

export function defaultconvAdd(data) {
    return axios({
        url: '/api/usermgmt/add/defaultconv',
        method: 'post',
        data
    })
}


export function defaultconvEdit(data) {
    return axios({
        url: '/api/usermgmt/update/defaultconv',
        method: 'post',
        data
    })
}


export function usermgmtipwhitelist(data) {
    return axios({
        url: '/api/usermgmt/get/ipwhitelist/list/all',
        method: 'post',
        data
    })
}

export function addusermgmtipwhitelist(data) {
    return axios({
        url: '/api/usermgmt/add/ipwhitelist',
        method: 'post',
        data
    })
}

export function updateusermgmtipwhitelist(data) {
    return axios({
        url: '/api/usermgmt/update/ipwhitelist',
        method: 'post',
        data
    })
}
export function deleteusermgmtipwhitelist(data) {
    return axios({
        url: '/api/usermgmt/delete/ipwhitelist',
        method: 'post',
        data
    })
}

export function deleteoperationlog(data) {
    return axios({
        url: '/api/ms/delete/operationlog',
        method: 'post',
        data
    })
}

export function ipblacklist(data) {
    return axios({
        url: '/api/usermgmt/get/ipblacklist/list/all',
        method: 'post',
        data
    })
}

export function deleteipblacklist(data) {
    return axios({
        url: '/api/usermgmt/delete/ipblacklist',
        method: 'post',
        data
    })
}

export function addipblacklist(data) {
    return axios({
        url: '/api/usermgmt/add/ipblacklist',
        method: 'post',
        data
    })
}

export function updateipblacklist(data) {
    return axios({
        url: '/api/usermgmt/update/ipblacklist',
        method: 'post',
        data
    })
}

export function upload(data,type="image") {
    return axios({
        url: `/api/ms/upload/${type}`,
        method: 'post',
        data,
        isFilterInterface:true
    })
}

export function adminStatus(data) {
    return axios({
        url: '/api/ms/switch/admin/status',
        method: 'post',
        data
    })
}





















































































export function getUserOnline (data) {
    return axios({
        url: '/Other/GetOnlineCount',
        method: 'post',
        data
    })
}

export function deleteUserLevel (data) {
    return axios({
        url: '/Home/Login',
        method: 'post',
        data
    })
}


/**控制台*/
export function getDashBoard (data) {
    return axios({
        url: '/api/ms/stats',
        method: 'post',
        data
    })
}

/**获取表情列表*/
export function getEmojiList (data) {
    return axios({
        url: '/Other/GetEmojiList',
        method: 'post',
        data
    })
}

/**更新表情*/
export function updateEmoj(data) {
    return axios({
        url: '/Other/UpdateEmoji',
        method: 'post',
        data
    })
}

/**删除表情*/
export function deleteEmojiList (data) {
    return axios({
        url: '/Other/DeleteEmoji',
        method: 'post',
        data
    })
}

/**添加表情*/
export function AddEmoji (data) {
    return axios({
        url: '/Other/AddEmoji',
        method: 'post',
        data
    })
}


export function getQudaoList (data) {
    return axios({
        url: '/System/GetSpreadList',
        method: 'post',
        data
    })
}
export function onAddQudao (data) {
    return axios({
        url: '/System/InsertSpread',
        method: 'post',
        data
    })
}

export function onEditQudao (data) {
    return axios({
        url: '/System/UpdateSpread',
        method: 'post',
        data
    })
}

export function deleteQudao(data){
    return axios({
        url: '/System/BatchDeleteSpread',
        method: 'post',
        data
    })
}

//游客
export function GetGuestList(data){
    return axios({
        url: '/Member/GetGuestList',
        method: 'post',
        data
    })
}
export function deleteGuestList(data){
    return axios({
        url: '/Member/DeleteMember',
        method: 'post',
        data
    })
}
export function ipBlackGuest(data){
    return axios({
        url: '/Member/InsertMemberIPBlack',
        method: 'post',
        data
    })
}

/*升级会员*/
export function UpgradeMember(data){
    return axios({
        url: '/Member/UpgradeMember',
        method: 'post',
        data
    })
}

/*禁用会员*/
export function DisableMember(data){
    return axios({
        url: '/Member/DisableMember',
        method: 'post',
        data
    })
}

/*获取会员的好友列表*/
export function getMemberFriendList(data){
    return axios({
        url: '/Member/GetMemberFriendList',
        method: 'post',
        data
    })
}

/**添加好友或群*/
export function InsertMemberFriend(data){
    return axios({
        url: '/Member/InsertMemberFriend',
        method: 'post',
        data
    })
}

/**查看聊天记录*/
export function ServiceChatMessage(data){
    return axios({
        url: '/Service/ServiceChatMessage',
        method: 'post',
        data
    })
}
/**清空聊天接口*/
export function clearChatMessage(data){
    return axios({
        url: '/Member/ClearMemberFriendChatLog',
        method: 'post',
        data
    })
}

/**删除会员好友*/
export function deleteMemberFriend(data){
    return axios({
        url: '/Member/DeleteMemberFriend',
        method: 'post',
        data
    })
}

export function getMemberActionLogList(data){
    return axios({
        url: '/Member/GetMemberActionLogList',
        method: 'post',
        data
    })
}

export function getServiceList(data){
    return axios({
        url: '/Service/GetServiceList',
        method: 'post',
        data
    })
}

/*删除客服*/
export function deleteServiceMember(data){
    return axios({
        url: '/Service/DeleteMember',
        method: 'post',
        data
    })
}

/*添加客服*/
export function insertServiceMember(data){
    return axios({
        url: '/Service/InsertService',
        method: 'post',
        data
    })
}

/**更新客服*/
export function updateServiceMember(data){
    return axios({
        url: '/Service/UpdateService',
        method: 'post',
        data
    })
}


/**批量添加客服*/
export function batchInsertService(data){
    return axios({
        url: '/Service/BatchInsertService',
        method: 'post',
        data
    })
}

/**批量添加好友*/
export function batchAddFriend(data){
    return axios({
        url: '/Service/BatchAddFriend',
        method: 'post',
        data
    })
}

/**获取客服IP白名单*/
export function getServiceIPWhiteList(data){
    return axios({
        url: '/Service/GetServiceIPWhiteList',
        method: 'post',
        data
    })
}

/**删除客服IP白名单*/
export function batchDeleteServiceIPWhite(data){
    return axios({
        url: '/Service/BatchDeleteServiceIPWhite',
        method: 'post',
        data
    })
}


/**添加客服IP白名单*/
export function insertServiceIPWhite(data){
    return axios({
        url: '/Service/InsertServiceIPWhite',
        method: 'post',
        data
    })
}


/**修改客服IP白名单*/
export function updateServiceIPWhite(data){
    return axios({
        url: '/Service/UpdateServiceIPWhite',
        method: 'post',
        data
    })
}





/**获取会员列表*/
export function getMemberList(data){
    return axios({
        url: '/Member/GetMemberList',
        method: 'post',
        data
    })
}

/**删除会员*/
export function deleteMember(data){
    return axios({
        url: '/Member/DeleteMember',
        method: 'post',
        data
    })
}

/**添加会员*/
export function insertMember(data){
    return axios({
        url: '/Member/InsertMember',
        method: 'post',
        data
    })
}

/**添加会员*/
export function updateMember(data){
    return axios({
        url: '/Member/UpdateMember',
        method: 'post',
        data
    })
}


/*获取会员已加群组列表*/
export function getMemberJoinGroupList(data){
    return axios({
        url: '/Member/GetMemberJoinGroupList',
        method: 'post',
        data
    })
}

/*批量添加会员*/
export function batchInsertMember(data){
    return axios({
        url: '/Member/BatchInsertMember',
        method: 'post',
        data
    })
}


/*邀请码列表*/
export function getInvitationCode(data){
    return axios({
        url: '/Member/GetInvitationCode',
        method: 'post',
        data
    })
}

/**新增邀请码*/
export function insertInvitationCode(data){
    return axios({
        url: '/Member/InsertInvitationCode',
        method: 'post',
        data
    })
}


/**修改邀请码*/
export function updateInvitationCode(data){
    return axios({
        url: '/Member/UpdateInvitationCode',
        method: 'post',
        data
    })
}


/**修改邀请码*/
export function deleteInvitationCode(data){
    return axios({
        url: '/Member/DeleteInvitationCode',
        method: 'post',
        data
    })
}

/**获取默认好友/群列表*/
export function getMemberDefaultList(data){
    return axios({
        url: '/Member/GetDefaultList',
        method: 'post',
        data
    })
}

/**获取默认好友/群列表*/
export function batchDeleteFriendOrGroupInfo(data){
    return axios({
        url: '/Member/BatchDeleteFriendOrGroupInfo',
        method: 'post',
        data
    })
}

/**添加默认好友/群列表*/
export function insertFriendOrGroup(data){
    return axios({
        url: '/Member/InsertFriendOrGroup',
        method: 'post',
        data
    })
}


/**修改默认好友/群列表*/
export function updateFriendOrGroup(data){
    return axios({
        url: '/Member/UpdateFriendOrGroup',
        method: 'post',
        data
    })
}


/*获取僵尸号列表*/
export function getZombieList(data){
    return axios({
        url: '/Member/GetZombieList',
        method: 'post',
        data
    })
}

/*新增僵尸号*/
export function insertZombie(data){
    return axios({
        url: '/Member/InsertZombie',
        method: 'post',
        data
    })
}


/**Ip黑名单列表*/
export function getIPBlackList(data){
    return axios({
        url: '/System/GetIPBlackList',
        method: 'post',
        data
    })
}

/**添加IP黑名单*/
export function insertIPBlack(data){
    return axios({
        url: '/System/InsertIPBlack',
        method: 'post',
        data
    })
}


/**修改IP黑名单*/
export function updateIPBlack(data){
    return axios({
        url: '/System/UpdateIPBlack',
        method: 'post',
        data
    })
}


/**批量删除IP黑名单*/
export function batchDeleteIPBlack(data){
    return axios({
        url: '/System/BatchDeleteIPBlack',
        method: 'post',
        data
    })
}

/**获取群列表*/
export function getGroupList(data){
    return axios({
        url: '/Group/GetGroupList',
        method: 'post',
        data
    })
}

/**修改群列表*/
export function updateGroupInfo(data){
    return axios({
        url: '/Group/UpdateGroupInfo',
        method: 'post',
        data
    })
}


/*获取群聊天记录*/
export function getGroupChatlogs(data){
    return axios({
        url: '/Group/GetGroupChatlogs',
        method: 'post',
        data
    })
}

/*给群添加机器人*/
export function groupAddRobot(data){
    return axios({
        url: '/api/groupmgmt/insert/member/zombie',
        method: 'post',
        data
    })
}


/*移除群机器人*/
export function remoteGroupRobot(data){
    return axios({
        url: '/Group/RemoteGroupRobot',
        method: 'post',
        data
    })
}


/*解散群*/
export function groupDissolution(data){
    return axios({
        url: '/Group/GroupDissolution',
        method: 'post',
        data
    })
}


/*角色列表*/
export function getRoleList(data){
    return axios({
        url: '/api/ms/get/role/list/all',
        method: 'post',
        data
    })
}


/*添加角色*/
export function insertRole(data){
    return axios({
        url: '/api/ms/add/role',
        method: 'post',
        data
    })
}
/*获取菜单权限**/
export function getAllMenus(data){
    return axios({
        url: '/api/ms/get/menu/list/all',
        method: 'post',
        data
    })
}





/*获取所有API**/
export function getAllAPI(data){
    return axios({
        url: '/api/ms/get/apipath/list/all',
        method: 'post',
        data
    })
}




/*修改角色*/
export function updateRole(data){
    return axios({
        url: '/api/ms/update/role',
        method: 'post',
        data
    })
}


/*删除角色*/
export function batchDeleteRole(data){
    return axios({
        url: '/api/ms/delete/role',
        method: 'post',
        data
    })
}


/*管理员列表获取*/
export function getAdminList(data){
    return axios({
        url: '/api/ms/get/admin/list/all',
        method: 'post',
        data
    })
}

/*新增管理员*/
export function insertAdmin(data){
    return axios({
        url: '/api/ms/add/admin',
        method: 'post',
        data
    })
}

/*删除管理员*/
export function batchDeleteAdmin(data){
    return axios({
        url: '/api/ms/delete/admin',
        method: 'post',
        data
    })
}


/*更新管理员信息*/
export function updateAdmin(data){
    return axios({
        url: '/api/ms/update/admin',
        method: 'post',
        data
    })
}




/*解绑谷歌*/
export function batchUnlockGoogle(data){
    return axios({
        url: '/Admin/BatchUnlockGoogle',
        method: 'post',
        data
    })
}

/*获取IP白名单列表*/
export function getIPWhiteList(data){
    return axios({
        url: '/Admin/GetIPWhiteList',
        method: 'post',
        data
    })
}

/**更新IP白名单*/
export function updateIPWhiteList(data){
    return axios({
        url: '/Admin/UpdateIPWhiteList',
        method: 'post',
        data
    })
}

/**删除IP白名单*/
export function batchDeleteIPWhiteList(data){
    return axios({
        url: '/Admin/BatchDeleteIPWhiteList',
        method: 'post',
        data
    })
}

/**添加IP白名单*/
export function iPAdd(data){
    return axios({
        url: '/Admin/IPAdd',
        method: 'post',
        data
    })
}

/*修改个人资料*/
export function updateAccountInfo(data){
    return axios({
        url: '/System/UpdateAccountInfo',
        method: 'post',
        data
    })
}
/*修改头像*/
export function updateAccountAvatar(data){
    return axios({
        url: '/System/UpdateAccountAvatar',
        method: 'post',
        data
    })
}


/**操作日志*/
export function getActionHistory(data){
    return axios({
        url: '/System/GetActionHistory',
        method: 'post',
        data
    })
}


/**获取参数配置*/
export function getConfig(data){
    return axios({
        url: '/System/GetConfig',
        method: 'post',
        data
    })
}
/**修改参数配置*/
export function updateConfig(data){
    return axios({
        url: '/System/UpdateConfig',
        method: 'post',
        data
    })
}


/*获取系统通知*/
export function getSystemNoticeList(data){
    return axios({
        url: '/System/GetSystemNoticeList',
        method: 'post',
        data
    })
}

/**修改系统通知*/
export function updateSystemNotice(data){
    return axios({
        url: '/System/UpdateSystemNotice',
        method: 'post',
        data
    })
}


/**添加系统通知*/
export function insertSystemNotice(data){
    return axios({
        url: '/System/InsertSystemNotice',
        method: 'post',
        data
    })
}

/**删除系统通知*/
export function batchDeleteSystemNotice(data){
    return axios({
        url: '/System/BatchDeleteSystemNotice',
        method: 'post',
        data
    })
}

/**获取敏感词*/
export function getSensitiveWordList(data){
    return axios({
        url: '/System/GetSensitiveWordList',
        method: 'post',
        data
    })
}
/**删除敏感词*/
export function batchDeleteSensitiveWord(data){
    return axios({
        url: '/System/BatchDeleteSensitiveWord',
        method: 'post',
        data
    })
}

/**添加敏感词*/
export function insertSensitiveWord(data){
    return axios({
        url: '/System/InsertSensitiveWord',
        method: 'post',
        data
    })
}


/**获取外部链接*/
export function getOutlinkList(data){
    return axios({
        url: '/System/GetOutlinkList',
        method: 'post',
        data
    })
}

/**删除外部链接*/
export function batchDeleteOutlink(data){
    return axios({
        url: '/System/BatchDeleteOutlink',
        method: 'post',
        data
    })
}

/**添加外部链接*/
export function insertOutlink(data){
    return axios({
        url: '/System/InsertOutlink',
        method: 'post',
        data
    })
}

/*修改外部链接*/
export function updateOutlink(data){
    return axios({
        url: '/System/UpdateOutlink',
        method: 'post',
        data
    })
}


/*获取版本信息列表*/
export function getVersionList(data){
    return axios({
        url: '/System/GetVersionList',
        method: 'post',
        data
    })
}

/**删除版本信息*/
export function batchDeleteVersion(data){
    return axios({
        url: '/System/BatchDeleteVersion',
        method: 'post',
        data
    })
}


/**新增版本信息*/
export function insertVersion(data){
    return axios({
        url: '/System/InsertVersion',
        method: 'post',
        data
    })
}

/**修改版本信息*/
export function updateVersionInfo(data){
    return axios({
        url: '/System/UpdateVersionInfo',
        method: 'post',
        data
    })
}


/**获取vpn列表*/
export function getProxyList(data){
    return axios({
        url: '/Other/GetProxyList',
        method: 'post',
        data
    })
}

/**获取vpn列表*/
export function AddProxy(data){
    return axios({
        url: '/Other/AddProxy',
        method: 'post',
        data
    })
}

/**删除vpn列表*/
export function deleteProxy(data){
    return axios({
        url: '/Other/DeleteProxy',
        method: 'post',
        data
    })
}
































































































/*今日活跃*/
export function GetTodayOnlineCount(data) {
    return axios({
        url: '/Other/GetTodayOnlineCount',
        method: 'post',
        data
    })
}

/*检查IP是否在IP白名单中*/
export function CheckIP(data) {
    return axios({
        url: '/Home/CheckIP',
        method: 'post',
        data
    })
}

/*检查IP是否在IP白名单中*/
export function IPAdd(data) {
    return axios({
        url: '/Home/IPAdd',
        method: 'post',
        data
    })
}



/*在线列表*/
export function userPlatforms(data) {
    return axios({
        url: '/userPlatforms',
        method: 'post',
        data
    })
}









