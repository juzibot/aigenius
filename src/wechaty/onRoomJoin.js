/**
 * @author thelosttimes
 *
 * @description https://github.com/thelosttimes/aigenius.git
 *
 */
// 配置文件
const config = require("/config/index");
// 加入房间回复
const welcome = config.ROOM.WELCOME;
// 群id
const ids = config.ROOM.IDS;

async function onRoomJoin(room, inviteeList, inviter) {
  // 判断配置项群组id数组中是否存在该群聊id
  for (let id of ids) {
    if (id == room.id) {
      inviteeList.map(c => {
        // 发送消息并@
        room.say(welcome, c)
      });
    }
  }
}

module.exports ={
  onRoomJoin
}