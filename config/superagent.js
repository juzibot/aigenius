/**
 * @author thelosttimes
 *
 * @description https://github.com/thelosttimes/aigenius.git
 *
 */
const superagent = require('superagent')

//请求
function send(url, method, params, data, cookies) {
    return new Promise(function (resolve, reject) {
        superagent(method, url)
            .query(params)
            .send(data)
            .set('Content-Type', 'application/json;charset=utf-8')
            .end(function (err, response) {
                if (err) {
                    reject(err)
                }
                resolve(response)
            })
    })
}

module.exports = {
    send
}
