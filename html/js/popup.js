const timerPage = document.getElementById('timerPage');
const characterPage = document.getElementById('characterPage');
const otherPage = document.getElementById('otherPage');
const makeTimerBtn = document.getElementById('makeTimerBtn');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');

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

//タイマー作成ボタンを押した時
makeTimerBtn.onclick = function () {
    let repeat_time = parseInt(document.forms.timerForm.repeat_time.value, 10);
    let work_time = parseInt(document.forms.timerForm.work_time.value, 10);
    let interval = parseInt(document.forms.timerForm.interval.value, 10);

    let stopId;// タイマー停止用ID
    let view_timer = document.getElementById("view_timer");
    let timerDetails = document.getElementById("timerDetails");
    let working_time = work_time * 60; //オンタイムの分換算
    let interval_time = interval * 60; //オフタイムの分換算
    let one_roop_minutes  =  working_time + interval_time; //１ループあたりの秒数
    let total_minutes = one_roop_minutes * repeat_time; //総ループの合計秒数
    let elapsed_time = 0; //秒数を入れる経過時間

    //タイマーを作成したら、タイマーとボタンを表示
    view_timer.innerHTML = String(work_time).padStart(2,"0") + ":00";
    if (repeat_time > 1) {
        timerDetails.innerHTML = `${repeat_time}回<br>${work_time}分集中 / ${interval}分休憩を繰り返す`;
    }else{
        timerDetails.innerHTML = `${work_time}分集中 / ${interval}分休憩を繰り返す`;
    }

    startBtn.innerHTML = "<button class='btn btn-outline-info d-flex flex-column align-items-center m-2'>START</button>";
    stopBtn.innerHTML = "<button class='btn btn-outline-warning d-flex flex-column align-items-center m-2'>STOP</button>";
    resetBtn.innerHTML = "<button class='btn btn-outline-secondary d-flex flex-column align-items-center m-2'>RESET</button>";

    document.getElementById("noTimerImage").style.display ="none";
    document.getElementById("noTimer").style.display ="none";

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
    
    function start() {
        if (stopId == null) {
            stopId = setInterval(count_down, 1000);
        }
    };
    
    function stop() {
        clearInterval(stopId);
        stopId = null;
    };
    
    function reset() {
        clearInterval(stopId);
        stopId = null;
        working_time = work_time * 60
        let min = Math.floor(working_time / 60);
        let sec = working_time % 60;   
        view_timer.innerHTML = String(min).padStart(2,"0") + ":" + String(sec).padStart(2,"0");
    };

    function count_down() {
        if (working_time >= 0) {
            let min = Math.floor(working_time / 60);
            let sec = working_time % 60;   
            working_time--;
            view_timer.innerHTML = String(min).padStart(2,"0") + ":" + String(sec).padStart(2,"0");
        }else{
            interval_count_down()
            elapsed_time += one_roop_minutes;
            if(elapsed_time <= total_minutes){
                working_time = work_time * 60;
                interval_time = interval * 60;
            }else{
                view_timer.innerHTML = "TIME UP!";
            };
        };
    };
    
    function interval_count_down() {
        if (interval_time >= 0) {
            let min = Math.floor(interval_time / 60);
            let sec = interval_time % 60;   
            interval_time--;
            view_timer.innerHTML = String(min).padStart(2,"0") + ":" + String(sec).padStart(2,"0");
        };
    };
};