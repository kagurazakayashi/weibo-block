const listbox = document.getElementsByClassName('vue-recycle-scroller__item-wrapper')[0];
const alist = listbox.getElementsByTagName('a');
var dogs = [];
for (const as of alist) {
    if (as.href && as.href.length > 20) {
        const uid = as.href.replace('https://weibo.com/u/', '');
        dogs.push(parseInt(uid));
    }
}
console.log('总计可屏蔽人数:', dogs.length, '用户列表:', dogs.join(','));
var http = new XMLHttpRequest();
var i = 0;
var timer = null;
function kill() {
    if (i >= dogs.length) {
        return clearInterval(timer);
    }
    const dogId = dogs[i]
    const url = 'https://weibo.com/aj/filter/block?ajwvr=6';
    http.open('POST', url, true);
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    http.send('uid=' + dogId + '&filter_type=1&status=1&interact=1&follow=1');
    http.onreadystatechange = function () {
        if (http.readyState != 4 || http.status != 200) {
            return;
        }
        let data = {
            msg: '解析失败'
        }
        try {
            data = JSON.parse(http.responseText);
        } catch (err) {
        }
        if (data.code == 100000) {
            console.log(i + ' : 屏蔽 UID ' + dogId + ' 成功: ' + data.msg + ', 状态码:' + http.status + ', 返回值:' + http.responseText);
        } else {
            console.error(i + ' : 屏蔽 UID ' + dogId + ' 失败: ' + data.msg + ', 状态码:' + http.status + ', 返回值:' + http.responseText);
        }
    }
    i++;
}
timer = setInterval(kill, 2000);