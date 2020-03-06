/**
 * @author thelosttimes
 *
 * @description https://github.com/thelosttimes/aigenius.git
 *
 */
const {Wechaty} = require("wechaty") // Wechaty核心包
const {PuppetPadplus} = require("wechaty-puppet-padplus") // padplus协议包
const config = require("./config/index") // 配置文件
const schedule = require('./src/schedule/index');

const onRoomJoin = require("./src/wechaty/onRoomJoin") // 加入房间监听回调
const onMessage = require("./src/wechaty/onMessage") // 消息监听回调
const onFriendShip = require("./src/wechaty/onFriendShip") // 好友添加监听回调
const untils = require('./utils/index');
const superagent = require('./superagent/index');

//生成二维码
function onScan(qrcode, status) {
    require('qrcode-terminal').generate(qrcode); // 在console端显示二维码
    const qrcodeImageUrl = [
        'https://api.qrserver.com/v1/create-qr-code/?data=',
        encodeURIComponent(qrcode)
    ].join('');
    console.log(qrcodeImageUrl);
}

// 登录
async function onLogin(user) {
    console.log(`机器人 [${user}] 登录成功`);
    if (config.AUTO_REPLY) {
        console.log(`自动聊天已开启`);
    }
    // 登陆后创建定时任务
    await initDay();
}

//登出
function onLogout(user) {
    console.log(`机器人 [${user}] 登出`);
}

// 创建微信定时任务
async function initDay() {

    schedule.setSchedule(config.CORN_EXPRESS, async () => {
        await sayLove();
    });
    console.log(`定时任务开启成功`);
}

async function sayLove() {
    let logMsg;
    let contact =
        (await bot.Contact.find({name: config.NICKNAME})) ||
        (await bot.Contact.find({alias: config.NAME})); // 获取你要发送的联系人
    let one = await superagent.getOne(); //获取每日一句
    let weather = await superagent.getTXweather(); //获取天气信息
    let today = await untils.formatDate(new Date().toLocaleString()); //获取今天的日期
    let memorialDay = untils.getDay(config.MEMORIAL_DAY); //获取纪念日天数
    let sweetWord = await superagent.getSweetWord();
    let str = `${today}\r\n我们在一起的第${memorialDay}天\r\n\r\n元气满满的一天开始啦,要开心噢^_^\r\n\r\n今日天气\r\n${
        weather.weatherTips
    }\r\n${
        weather.todayWeather
    }\r\n每日一句:\r\n${one}\r\n\r\n每日土味情话：\r\n${sweetWord}\r\n\r\n————————最爱你的我`;
    str = str.replace(/<br>/g, '\r\n');
    try {
        logMsg = str;
        await untils.delay(2000);
        await contact.say(str); // 发送消息
    } catch (e) {
        logMsg = e.message;
    }
    console.log(logMsg);
}

// 初始化
const bot = new Wechaty({
    puppet: new PuppetPadplus({
        token: config.TOKEN
    }),
    name: config.ROBOT_NAME
})

bot
    .on("scan", onScan)
    .on("login", onLogin)
    .on("logout", onLogout)
    .on("room-join", onRoomJoin)
    .on("message", onMessage(bot))
    .on("friendship", onFriendShip)
    .start()
    .then(() => console.log('开始登录'))
    .catch(e => console.error(e));
