import Vue from 'vue'

const apis = {
    setDailyBackground : 'daily/setDailyBackground', //设置日历接口
    setDailyBackgroundLike : 'daily/setDailyBackgroundLike', //日历背景图点赞接口
    findDailyBackground : 'webapp/findDailyBackground', //查看日历背景图片
    addNewMessage : 'message/addNewMessage',//增加留言
    addNewMusicType : 'music/addNewMusicType' , //新增音乐类型
    findMusicTypes : 'music/findMusicTypes', //查询音乐类型
    deleteMusicType : 'music/deleteMusicType', //删除音乐类型
    signin : '/signin' , //登录
    checkDynamicCode  : '/checkDynamicCode' , //验证码
    uploadMusic : 'music/uploadMusic', // 新增音频
    findMusic : 'music/findMusic', //查询音频列表
    deleteMusic : 'music/deleteMusic', //删除音频
    updateMusicInfo : 'music/updateMusicInfo',//更新音频信息
    checkFile : 'music/checkFile' , //校验文件
    
}

Vue.prototype.$apis = apis

export default apis
