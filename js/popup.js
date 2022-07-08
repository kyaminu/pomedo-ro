const openModalBtn = document.getElementById('openModalBtn');
const makeTimerBtn = document.getElementById('makeTimerBtn');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');
const noTimer = document.getElementById('noTimer');
let haveTimer = document.getElementById('haveTimer')
// const noTimerImage = document.getElementById("noTimerImage")
// const noTimerText = document.getElementById("noTimerText")

const pome_work_sound_test_btn = document.getElementById("pome_work_sound_test_btn")
const pome_interval_sound_test_btn = document.getElementById("pome_interval_sound_test_btn")

const pomeWorkAlerm = document.getElementById("pomeWorkAlerm")
const pomeIntervalAlerm = document.getElementById("pomeIntervalAlerm")
const finishAlerm = document.getElementById("finishAlerm")

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

makeTimerBtn.onclick = function () {
    makeTimer();
};

//タイマー作成ボタンを押した時
function  makeTimer() {
    let view_timer = document.getElementById("view_timer");//実際に時間表示させる箇所
    let timerDetails = document.getElementById("timerDetails");//タイマー詳細
    let status = document.getElementById("status");
    status.innerHTML = "";

    //フォームから取得した内容
    let repeat_time = parseInt(document.forms.timerForm.repeat_time.value, 10);//くり返し回数
    chrome.storage.local.set({repeat_time: repeat_time});

    let work_time = parseInt(document.forms.timerForm.work_time.value, 10);//集中時間
    chrome.storage.local.set({work_time: work_time});

    let interval = parseInt(document.forms.timerForm.interval.value, 10);//休憩時間
    chrome.storage.local.set({interval: interval});

    let stopId;// タイマー停止用ID
    let work_second = work_time * 60; //ONタイムの秒換算
    let interval_second = interval * 60; //OFFタイムの秒換算
    let one_roop_second  =  work_second + interval_second; //１ループあたりの秒数

    let total_second = one_roop_second * repeat_time; //総ループの合計秒数
    chrome.storage.local.set({total_second: total_second});

    let elapsed_time = 0; //秒数を入れる経過時間
    chrome.storage.local.set({elapsed_time: elapsed_time});

    let timerStatus = false

    //タイマーを作成したら、タイマーとボタンを表示
    view_timer.innerHTML = String(work_time).padStart(2,"0") + ":00";
    if (repeat_time > 1) {
        timerDetails.innerHTML = `${repeat_time}回 ${work_time}分集中 / ${interval}分休憩を繰り返す`;
    }else{
        timerDetails.innerHTML = `${work_time}分集中 / ${interval}分休憩`;
    }

    startBtn.innerHTML = "<button class='btn btn-outline-info d-flex flex-column align-items-center m-2'>START</button>";
    stopBtn.innerHTML = "<button class='btn btn-outline-warning d-flex flex-column align-items-center m-2'>STOP</button>";
    resetBtn.innerHTML = "<button class='btn btn-outline-secondary d-flex flex-column align-items-center m-2'>RESET</button>";

    noTimer.style.display = 'none';

    //各ボタンを押した時の動作
    startBtn.onclick = function() {
        start();
        openModalBtn.setAttribute("disabled", true);
    };
    
    stopBtn.onclick = function() {
        stop();
    };
    
    resetBtn.onclick = function() {
        reset();
        openModalBtn.removeAttribute("disabled")
    };
    
    function start() {
        chrome.storage.local.get(['stopId'])
        timerStatus = true            
        chrome.storage.local.set({timerStatus: timerStatus});
        if (stopId == null) {
            stopId = setInterval(pomodoro_timer, 1000);
            chrome.storage.local.set({stopId: stopId});
        }
    };
    
    function stop() {
        clearInterval(stopId);
        stopId = null;
        chrome.storage.local.set({stopId: stopId});
    };
    
    function reset() {
        clearInterval(stopId);
        stopId = null;
        chrome.storage.local.set({stopId: stopId});
        timerStatus = false          
        chrome.storage.local.set({timerStatus: timerStatus});

        work_second = work_time * 60
        chrome.storage.local.set({work_second: work_second});

        let min = Math.floor(work_second / 60);
        let sec = work_second % 60;
        status.innerHTML = ""; 
        view_timer.innerHTML = String(min).padStart(2,"0") + ":" + String(sec).padStart(2,"0");
    };

    function pomodoro_timer() {
        chrome.storage.local.get(['work_second']);
        chrome.storage.local.get(['interval_second']);

        if (work_second == work_time * 60){
            pomeWorkAlerm.play();
        }

        if (work_second == 0 && interval_second == interval * 60){
            pomeIntervalAlerm.play();
        }
        
        if (work_second >= 0) {
            count_down()
            status.innerHTML = "<div class='working pt-3'>集中タイム！</div>";
        }else if(interval_second > 0){
            interval_count_down()
            status.innerHTML = "<div class='intervaling pt-3'>休憩タイム！</div>";
        }else if(interval_second == 0){
            elapsed_time += one_roop_second;
            if(elapsed_time < total_second){
                work_second = work_time * 60;
                interval_second = interval * 60;
            }else{
                view_timer.innerHTML = "TIME UP!";
                status.innerHTML = "";
                finishAlerm.play();
                clearInterval(stopId);
                chrome.storage.local.clear()
            };
        };
    };

    //集中時間用カウントダウン
    function count_down() {
        let min = Math.floor(work_second / 60);
        let sec = work_second % 60;
        chrome.storage.local.get(['work_second']);
        work_second--;
        chrome.storage.local.set({work_second: work_second});
        view_timer.innerHTML = String(min).padStart(2,"0") + ":" + String(sec).padStart(2,"0");
    }

    //インターバル用カウントダウン
    function interval_count_down() {
        let min = Math.floor(interval_second / 60);
        let sec = interval_second % 60;
        chrome.storage.local.get(['interval_second']);
        interval_second--;
        chrome.storage.local.set({interval_second: interval_second});
        view_timer.innerHTML = String(min).padStart(2,"0") + ":" + String(sec).padStart(2,"0");
    };
};

pome_work_sound_test_btn.onclick = function() {
    pomeWorkAlerm.play();
}

pome_interval_sound_test_btn.onclick = function() {
    pomeIntervalAlerm.play();
}
// let value = "aaaaaaaaa"
// // chrome.storage.local.set({key: value}, function() {
// //     console.log('Value is set to ' + value);
// //   });

//   chrome.storage.local.get(['key'], function(result) {
//     console.log('Value currently is ' + result.key);
//   });

    chrome.storage.local.get(['timerStatus'], function(result) {
        console.log(result.timerStatus);
    });

    // if(chrome.storage.local.get(['work_second'])){
    //     noTimerText.innerHTML = "a"
    // }

    chrome.storage.local.get(['timerStatus'], function(result) {
        if(result.timerStatus == true){
            noTimer.style.display = 'none';
        }else if(result.timerStatus == false){
            console.log("yぐjbh")
        }
    });

    // chrome.storage.local.clear()