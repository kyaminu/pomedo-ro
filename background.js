let lifeline
let stopId

//初インストール時のフォームの初期値設定
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({repeat_time: 1});
    chrome.storage.local.set({work_time: 25});
    chrome.storage.local.set({interval: 5});
})

//start・stop・resetボタン押された時の処理
chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse){
    await keepAlive();

    //switchがonの時 かつ stopIdがnullの時
    if(request.switch == "on" && stopId == null){
        stopId = setInterval(pomodoro_timer, 1000);
    }

    //switchがstopかresetの時
    if(request.switch == "stop" || request.switch == "reset"){
        clearInterval(stopId);
        stopId = null;
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

                timerStatus = false          
                chrome.storage.local.set({timerStatus: timerStatus});
                
                chrome.tabs.query( {active:true, currentWindow:true}, function(tabs){
                    chrome.tabs.sendMessage(tabs[0].id, {msg: "finish"})
                })
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
    chrome.storage.local.get(['work_second','constant_work_second'],function(v){
        if(v.work_second == v.constant_work_second){
            chrome.tabs.query( {active:true, currentWindow:true}, function(tabs){
                chrome.tabs.sendMessage(tabs[0].id, {msg: "count"})
            })
        }
        v.work_second--;
        chrome.storage.local.set({work_second: v.work_second});
    })
};

// インターバル用カウントダウン
function interval_count_down() {
    chrome.storage.local.get(['interval_second','constant_interval_second'],function(v){
        if(v.interval_second == v.constant_interval_second){
            chrome.tabs.query( {active:true, currentWindow:true}, function(tabs){
                chrome.tabs.sendMessage(tabs[0].id, {msg: "rest"})
            })
        }
        v.interval_second--;
        chrome.storage.local.set({interval_second: v.interval_second});
    })
};