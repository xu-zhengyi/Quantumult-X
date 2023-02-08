
var log = true; //是否开启日志, false则关闭
var stop = 0; //自定义延迟签到,单位毫秒,(如填200则每个接口延迟0.2秒执行),默认无延迟
var $nobyda = nobyda();
var KEY = $nobyda.read("CookieJD");

if ($nobyda.isRequest) {
  GetCookie()
  $nobyda.end()
} else {
  all()
  $nobyda.end()
}

function GetCookie() {
  var CookieName = "京东";
  if ($request.headers) {
    var CookieKey = "CookieJD";
    var CookieValue = $request.headers['Cookie'];
    if ($nobyda.read(CookieKey) != (undefined || null)) {
      if ($nobyda.read(CookieKey) != CookieValue) {
        var cookie = $nobyda.write(CookieValue, CookieKey);
        if (!cookie) {
          $nobyda.notify("更新" + CookieName + "Cookie失败‼️", "", "");
        } else {
          $nobyda.notify("更新" + CookieName + "Cookie成功 🎉", "", "");
        }
      }
    } else {
      var cookie = $nobyda.write(CookieValue, CookieKey);
      if (!cookie) {
        $nobyda.notify("首次写入" + CookieName + "Cookie失败‼️", "", "");
      } else {
        $nobyda.notify("首次写入" + CookieName + "Cookie成功 🎉", "", "");
      }
    }
  } else {
    $nobyda.notify("写入" + CookieName + "Cookie失败‼️", "", "配置错误, 无法读取请求头, ");
  }
}


function nobyda() {
    const isRequest = typeof $request != "undefined"
    const isSurge = typeof $httpClient != "undefined"
    const isQuanX = typeof $task != "undefined"
    const notify = (title, subtitle, message) => {
        if (isQuanX) $notify(title, subtitle, message)
        if (isSurge) $notification.post(title, subtitle, message)
    }
    const write = (value, key) => {
        if (isQuanX) return $prefs.setValueForKey(value, key)
        if (isSurge) return $persistentStore.write(value, key)
    }
    const read = (key) => {
        if (isQuanX) return $prefs.valueForKey(key)
        if (isSurge) return $persistentStore.read(key)
    }
    const get = (options, callback) => {
        if (isQuanX) {
            if (typeof options == "string") options = { url: options }
            options["method"] = "GET"
            $task.fetch(options).then(response => {
                response["status"] = response.statusCode
                callback(null, response, response.body)
            }, reason => callback(reason.error, null, null))
        }
        if (isSurge) $httpClient.get(options, callback)
    }
    const post = (options, callback) => {
        if (isQuanX) {
            if (typeof options == "string") options = { url: options }
            options["method"] = "POST"
            $task.fetch(options).then(response => {
                response["status"] = response.statusCode
                callback(null, response, response.body)
            }, reason => callback(reason.error, null, null))
        }
        if (isSurge) $httpClient.post(options, callback)
    }
    const end = () => {
        if (isQuanX) isRequest ? $done({}) : ""
        if (isSurge) isRequest ? $done({}) : $done()
    }
    return { isRequest, isQuanX, isSurge, notify, write, read, get, post, end }
};
