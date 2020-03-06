/**
 * @author thelosttimes
 *
 * @description https://github.com/thelosttimes/aigenius.git
 *
 */
const {Friendship} = require("wechaty");
const untils = require('./utils/index');
// 好友添加监听回调
module.exports = async function onFriendShip(friendship) {
    let logMsg;
    try {
        logMsg = "新的好友 ===>>> " + friendship.contact().name();
        console.log(logMsg);
        switch (friendship.type()) {
            case Friendship.Type.Receive:
                untils.delay(3000);
                //自动通过好友
                await friendship.accept();
                break;
            case Friendship.Type.Confirm:
                logMsg = "验证新好友完成 ===>>> " + friendship.contact().name();
                console.log(logMsg);
                break;
        }
    } catch (e) {
        logMsg = "好友添加异常 ===>>> " + e.message;
        console.log(logMsg)
    }
}
