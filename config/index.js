/**
 * @author thelosttimes
 *
 * @description https://github.com/thelosttimes/aigenius.git
 *
 */
module.exports = {

    TOKEN: '',
    ROBOT_NAME: '',//机器人名称
    AUTO_REPLY: true,  //是否开启自动回复
    AUTO_ADD_ROOM: true,
    MEMORIAL_DAY: '',
    CORN_EXPRESS: '0 0 10 * * *', //每天的上午10点0分0秒触发

    ROOM: {
        IDS: ['', ''],//群id
        KEYWORD: ['T-'],//T-代表踢人 A- 代表自动回复
        WELCOME: '又来了一位大佬，速来围观。'
    }
}