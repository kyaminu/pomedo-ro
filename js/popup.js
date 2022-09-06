const openModalBtn = document.getElementById('openModalBtn');
const makeTimerBtn = document.getElementById('makeTimerBtn');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');
const noTimer = document.getElementById('noTimer');
const pome_work_sound_test_btn = document.getElementById("pome_work_sound_test_btn")
const pome_interval_sound_test_btn = document.getElementById("pome_interval_sound_test_btn")

let view_timer = document.getElementById("view_timer");//実際に時間表示させる箇所
let timerDetails = document.getElementById("timerDetails");//タイマー詳細
let work_or_interval = document.getElementById("work_or_interval");//集中or休憩
let timerStatus;//タイマーが活動中か否かで,経過時間を表示の有無を決める
let btnStatus;//ボタンがstart・stopでpopupを再度開いた時の分岐点

//音声
const pomeWorkAlarm = document.getElementById("pomeWorkAlarm")
const pomeIntervalAlarm = document.getElementById("pomeIntervalAlarm")
const finishAlarm = document.getElementById("finishAlarm")

//タブの切り替え
document.addEventListener('DOMContentLoaded', function(){
    // タブに対してクリックイベントを適用
    const tabs = document.getElementsByClassName('tab');
    for(let i = 0; i < tabs.length; i++) {
        tabs[i].addEventListener('click', tabSwitch, false);
    }
    // タブをクリックすると実行する関数
    function tabSwitch(){
        // タブのclassの値を変更
        document.getElementsByClassName('is-active')[0].classList.remove('is-active');
        this.classList.add('is-active');
        // コンテンツのclassの値を変更
        document.getElementsByClassName('is-show')[0].classList.remove('is-show');
        const arrayTabs = Array.prototype.slice.call(tabs);
        const index = arrayTabs.indexOf(this);
        document.getElementsByClassName('content')[index].classList.add('is-show');
    };
}, false);

//「タイマーを設定する▷」を押した時
makeTimerBtn.onclick = function() {
    get_timer_form();

    //タイマーを作成したら、タイマーとボタンを表示
    timer_display();

    //各ボタンを押した時の動作
    startBtn.onclick = function() {
        start();
    };
    
    stopBtn.onclick = function() {
        stop();
    };
    
    resetBtn.onclick = function() {
        reset();
    };
};

//フォームから時間内容を取得
function get_timer_form(){
    let repeat_time = parseInt(document.forms.timerForm.repeat_time.value, 10);//くり返し回数
    chrome.storage.local.set({repeat_time: repeat_time});

    let work_time = parseInt(document.forms.timerForm.work_time.value, 10);//集中時間(分)
    chrome.storage.local.set({work_time: work_time});

    let interval = parseInt(document.forms.timerForm.interval.value, 10);//休憩時間(分)
    chrome.storage.local.set({interval: interval});

    let work_second = work_time * 60; //ONタイムの秒換算
    chrome.storage.local.set({work_second: work_second});

    let interval_second = interval * 60; //OFFタイムの秒換算
    chrome.storage.local.set({interval_second: interval_second});

    let one_roop_second  =  work_second + interval_second; //１ループあたりの秒数
    chrome.storage.local.set({one_roop_second: one_roop_second});

    let total_second = one_roop_second * repeat_time; //総ループの合計秒数
    chrome.storage.local.set({total_second: total_second});

    let elapsed_time = 0; //秒数を入れる経過時間
    chrome.storage.local.set({elapsed_time: elapsed_time});
}
//タイマーを作成したら、タイマーとボタンを表示
function timer_display(){
    chrome.storage.local.get(['repeat_time', 'work_time','interval','work_second'], function(v){
        let min = Math.floor(v.work_second / 60);
        let sec = v.work_second % 60;
        view_timer.innerHTML = String(min).padStart(2,"0") + ":" + String(sec).padStart(2,"0");

        if (v.repeat_time > 1) {
            timerDetails.innerHTML = `${v.repeat_time}回 ${v.work_time}分集中 / ${v.interval}分休憩を繰り返す`;
        }else{
            timerDetails.innerHTML = `${v.work_time}分集中 / ${v.interval}分休憩`;
        }

        startBtn.innerHTML = "<button class='btn btn-outline-info d-flex flex-column align-items-center m-2'>START</button>";
        stopBtn.innerHTML = "<button class='btn btn-outline-warning d-flex flex-column align-items-center m-2'>STOP</button>";
        resetBtn.innerHTML = "<button class='btn btn-outline-secondary d-flex flex-column align-items-center m-2'>RESET</button>";

        noTimer.style.display = 'none';
    })
}

function start() {
    chrome.runtime.sendMessage({switch: "on"});

    openModalBtn.setAttribute("disabled", true);

    timerStatus = true
    chrome.storage.local.set({timerStatus: timerStatus});

    btnStatus = "start"
    chrome.storage.local.set({btnStatus: btnStatus});

    popup_pomodoro_timer()
};

function stop() {
    chrome.runtime.sendMessage({switch: "stop"});

    btnStatus = "stop"
    chrome.storage.local.set({btnStatus: btnStatus});
};

function reset() {
    chrome.runtime.sendMessage({switch: "reset"});

    openModalBtn.removeAttribute("disabled")
    work_or_interval.innerHTML = "";

    timerStatus = false          
    chrome.storage.local.set({timerStatus: timerStatus});

    get_timer_form()
    
    chrome.storage.local.get(['work_time'],function(v){
        work_second = v.work_time * 60
        chrome.storage.local.set({work_second: work_second});

        let min = Math.floor(work_second / 60);
        let sec = work_second % 60;
        view_timer.innerHTML = String(min).padStart(2,"0") + ":" + String(sec).padStart(2,"0");
    })
};

//タイマーが稼働中(timerStatus = true)であれば、その経過時間を表示
chrome.storage.local.get(['timerStatus','btnStatus'], function(v) {
    if(v.timerStatus == true){
        timer_display();
        if(v.btnStatus == "start"){
            start();
        }else if(v.btnStatus == "stop"){
            stop();
        }

        startBtn.onclick = function() {
            start();
        };
        
        stopBtn.onclick = function() {
            stop();
        };
        
        resetBtn.onclick = function() {
            reset();
        };
    }
});

function popup_pomodoro_timer() {
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
        if (request.work_second >= 0) {
            popup_count_down()
        }else if(request.interval_second > 0){
            popup_interval_count_down()
        }else if(request.interval_second == 0){
            if(request.elapsed_time == request.total_second){
                view_timer.innerHTML = "TIME UP!";
                work_or_interval.innerHTML = "";
                get_timer_form()
            };
        };

        function popup_count_down() {
            let min = Math.floor(request.work_second / 60);
            let sec = request.work_second % 60;
            work_or_interval.innerHTML = "<div class='working pt-3'>集中タイム！</div>";
            view_timer.innerHTML = String(min).padStart(2,"0") + ":" + String(sec).padStart(2,"0");
        }

        function popup_interval_count_down() {
            let min = Math.floor(request.interval_second / 60);
            let sec = request.interval_second % 60;
            work_or_interval.innerHTML = "<div class='intervaling pt-3'>休憩タイム！</div>";
            view_timer.innerHTML = String(min).padStart(2,"0") + ":" + String(sec).padStart(2,"0");
        }

        return true
    })
};

pome_work_sound_test_btn.onclick = function() {
    pomeWorkAlarm.play();
}

pome_interval_sound_test_btn.onclick = function() {
    pomeIntervalAlarm.play();
}