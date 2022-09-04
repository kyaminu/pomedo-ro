let lifeline;
let stopId

//start・stop・resetボタン押された時の処理
chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse){
    await keepAlive();

    //switchがonの時 かつ stopIdがnullの時
    if(request.switch == "on" && stopId == null){
        stopId = setInterval(pomodoro_timer, 1000);
    }

    //switchがstopかresetの時
    if(request.switch == "stop"){
        clearInterval(stopId);
        stopId = null;
    }

    if(request.switch == "reset"){
        clearInterval(stopId);
        stopId = null;
        // chrome.storage.local.clear()
    }

    return true
})

//5分間の再接続処理
chrome.runtime.onConnect.addListener(port => {
    if (port.name === 'keepAlive') {
        lifeline = port;
        setTimeout(keepAliveForced, 295e3); //4分55秒
        port.onDisconnect.addListener(keepAliveForced);
    }
});

function keepAliveForced() {
    lifeline?.disconnect();
    lifeline = null;
    keepAlive();
}

async function keepAlive() {
    if (lifeline) return;
    chrome.runtime.connect({ name: 'keepAlive' })
}

//ポモドーロタイマー
function pomodoro_timer() {
    console.log("bgでのポモドロカウント確認用")

    chrome.storage.local.get([
        'work_time',
        'work_second',
        'interval',
        'interval_second',
        'elapsed_time',
        'one_roop_second',
        'total_second'
    ],function(v){
        if (v.work_second >= 0) {
            count_down()
        }else if(v.interval_second > 0){
            interval_count_down()
        }else if(v.interval_second == 0){
            v.elapsed_time += v.one_roop_second;
            chrome.storage.local.set({elapsed_time: v.elapsed_time});

            if(v.elapsed_time < v.total_second){
                v.work_second = v.work_time * 60;
                v.interval_second = v.interval * 60;
                chrome.storage.local.set({work_second: v.work_second});
                chrome.storage.local.set({interval_second: v.interval_second});
            }else{
                clearInterval(stopId);
                // chrome.storage.local.clear()
            };
        };

        //popupへ
        chrome.runtime.sendMessage({
            work_time: `${v.work_time}`,
            work_second: `${v.work_second}`,
            interval: `${v.interval}`,
            interval_second: `${v.interval_second}`,
            elapsed_time: `${v.elapsed_time}`,
            total_second: `${v.total_second}`
        });
    });
};

// 集中時間用カウントダウン
function count_down() {
    chrome.storage.local.get(['work_second'],function(v){
        v.work_second--;
        // chrome.runtime.sendMessage({work_second: `${v.work_second}`});
        chrome.storage.local.set({work_second: v.work_second});
    })
};

// インターバル用カウントダウン
function interval_count_down() {
    chrome.storage.local.get(['interval_second'],function(v){
        v.interval_second--;
        // chrome.runtime.sendMessage({work_second: `${v.interval_second}`});
        chrome.storage.local.set({interval_second: v.interval_second});
    })
};