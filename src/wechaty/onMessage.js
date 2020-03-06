/**
 * @author thelosttimes
 *
 * @description https://github.com/thelosttimes/aigenius.git
 *
 */
const {Message} = require("wechaty");
const untils = require('./utils/index');
const superagent = require('./superagent/index');
// 配置文件
const config = require("/config");
// 机器人名字
const robotName = config.ROBOT_NAME;
//群id
const ids = config.ROOM.IDS;


async function isAddRoom(bot, msg) {
    // 关键字 加群 处理
    if (msg.text() == "加群") {
        // 通过群聊id获取到该群聊实例
        const room = await bot.Room.find({id: ids[0]});
        // 判断是否在房间中 在-提示并结束
        if (await room.has(msg.from())) {
            untils.delay(2000);
            await msg.say("请勿重复添加！");
            return true;
        }
        // 发送群邀请
        untils.delay(2000);
        await room.add(msg.from());
        return true;
    }
    return false;
}

// 消息监听回调
module.exports = bot => {
    return async function onMessage(msg) {
        if (msg.self()) {
            return;
        }
        console.log("=============================");
        console.log(`msg : ${msg}`);
        console.log("=============================");
        // 判断此消息类型是否为文本
        if (msg.type() == Message.Type.Text) {
            // 判断消息类型来自群聊
            if (msg.room()) {
                // 获取群聊
                const room = await msg.room();
                if (msg.text().endsWith('-T') && ids.includes(msg.from().id)) {
                    let tName = msg.text().replace('T-@', "");
                    try {
                        untils.delay(2000);
                        const contact = await bot.Contact.find({name: tName});
                        await room.del(contact);
                    } catch (e) {
                        console.error(e)
                    }
                    return;
                }
                // 收到消息，提到自己
                if (await msg.mentionSelf()) {
                    // 获取提到自己的名字
                    let self = await msg.to();
                    self = "@" + self.name();
                    // 获取消息内容，拿到整个消息文本，去掉 @+名字
                    let sendText = msg.text().replace(self, "");
                    // 请求机器人接口回复
                    let res = await superagent.getTXTLReply(sendText);
                    // 返回消息，并@来自人
                    untils.delay(2000);
                    room.say(res, msg.from());
                    return;
                }
            } else {
                // 回复信息是关键字 “加群”
                if (await isAddRoom(msg)) return;
                // 请求机器人聊天接口
                let res = await superagent.getTXTLReply(msg.text());
                // 返回聊天接口内容
                untils.delay(2000);
                await msg.say(res);
            }
        } else {
            let logMsg = "不支持的消息 ===>>> " + msg.Type;
            console.log(logMsg);
        }
    }
}


