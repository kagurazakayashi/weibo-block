const nURL: string[] = window.location.pathname.split("/");
const uid: string = nURL[nURL.length - 1];
const isFans: boolean = window.location.search.indexOf("fans") >= 0;
const isFansStr: string = isFans ? "粉丝" : "关注";
const dogs: number[] = [];
const dogsName: number[] = [];
let i: number = 0;
let timer: number | null = null;
let fail: number = 0;

function jsonParse(t: string): any {
  try {
    return JSON.parse(t);
  } catch (e) {
    console.error(e);
    return null;
  }
}

function hasdog(did: number): boolean {
  for (const dog of dogs) {
    if (did == dog) {
      return true;
    }
  }
  return false;
}

function list() {
  console.log(`正在列出 ${isFansStr} 列表第 ${i + 1} 页：`);
  const url: string =
    `https://weibo.com/ajax/friendships/friends?page=${i}&uid=${uid}` +
    (isFans ? "&relate=fans" : "");
  console.log(url);

  const http: XMLHttpRequest = new XMLHttpRequest();
  http.open("GET", url, true);
  http.onreadystatechange = function () {
    if (http.readyState != 4) {
      return;
    }
    if (http.status != 200) {
      console.error("发生错误", http.status.toString(), http.responseText);
      return;
    }
    const data: any = jsonParse(http.responseText);
    if (data) {
      const users: any[] = data.users;
      if (users.length > 0) {
        for (const user of users) {
          const did: number = parseInt(user.id);
          if (did != 2671109275 && !hasdog(did)) {
            dogs.push(did);
            dogsName.push(user.name);
          }
        }
        console.log(`已加入准备拉黑名单 ${dogs.length} 人。`);
        setTimeout(() => {
          i++;
          list();
        }, Math.round(Math.random() * 1000) + 1000);
      } else {
        let infos: string[] = [];
        for (let j = 0; j < dogs.length; j++) {
          infos.push(`${dogs[j]}(${dogsName[j]})`);
        }
        console.log(infos.join(", "));
        console.warn(
          `名单收集完成，以上为准备被拉黑名单的 ${dogs.length} 人。10 秒后开始拉黑，要中断请刷新页面。`
        );
        setTimeout(() => {
          i = 0;
          timer = window.setInterval(
            kill,
            Math.round(Math.random() * 1000) + 1000
          );
        }, 10000);
      }
    } else {
      console.error("发生错误", http.status.toString(), http.responseText);
    }
  };
  http.send();
}

function kill() {
  if (i >= dogs.length) {
    console.log(
      `操作结束。 发现 ${dogs.length} , 成功 ${
        dogs.length - fail
      } , 失败 ${fail} 。请刷新页面以卸载脚本。`
    );
    if (timer) {
      clearInterval(timer);
    }
    return;
  }
  const dogId: number = dogs[i];
  const dogName: number = dogsName[i];
  const url = "https://weibo.com/aj/filter/block?ajwvr=6";
  const http: XMLHttpRequest = new XMLHttpRequest();
  http.open("POST", url, true);
  http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  http.send("uid=" + dogId + "&filter_type=1&status=1&interact=1&follow=1");
  http.onreadystatechange = function () {
    if (http.readyState != 4) {
      return;
    }
    if (http.status != 200) {
      console.error("发生错误", http.status.toString(), http.responseText);
      return;
    }
    let data: any = {
      msg: "解析失败",
    };
    try {
      data = JSON.parse(http.responseText);
    } catch (err) {}
    if (data.code == 100000) {
      console.log(
        `[${i}/${dogs.length}] 屏蔽 ${dogId}(${dogName}) 成功，状态码 ${http.status}，返回值 ${http.responseText}`
      );
    } else {
      fail++;
      console.error(
        `[${i}/${dogs.length}] 屏蔽 ${dogId}(${dogName}) 失败！状态码 ${http.status}，返回值 ${http.responseText}`
      );
    }
  };
  i++;
}

console.log(`任务：屏蔽 UID ${uid} 的 ${isFansStr} 。`);
list();
