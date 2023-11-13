/**
 * @description 导出网络配置
 **/
module.exports = {
  // 默认的接口地址，开发环境和生产环境都会走/vab-mock-server
  // 正式项目可以选择自己配置成需要的接口地址，如"https://api.xxx.com"
  // 问号后边代表开发环境，冒号后边代表生产环境
  baseURL:
    process.env.NODE_ENV === 'development'
      ? process.env.VUE_APP_API_BASE_API
     // ? 'https://api.cherish.chat'
      : process.env.VUE_APP_API_BASE_API,
      //: '/vab-mock-server',
  // 配后端数据的接收方式application/json;charset=UTF-8 或 application/x-www-form-urlencoded;charset=UTF-8
  //contentType: 'application/json;charset=UTF-8',
  contentType: 'text/plain',
  // 最长请求时间
  requestTimeout: 10000,
  // 操作正常code，支持String、Array、int多种类型
  successCode: [200, 0, '200', '0'],
  // 数据状态的字段名称
  statusName: 'code',
  // 状态信息的字段名称
  messageName: 'msg',
}
