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
    let timerDetails = document.getElementById("timerDetails")
    let working_time = work_time * 60
    let interval_time = interval * 60

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
    startBtn.onclick = async function() {
        // for(let i = 0; i < repeat_time; i++){
        //     await start();
        //     alert("test")
        // };
        // view_timer.innerHTML = "TIME UP!";
        start();
        start();
        //2回連続関数で入力しても反応なし
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
        };
    };
    
    function interval_count_down() {
        if (interval_time >= 0) {
            let min = Math.floor(interval_time / 60);
            let sec = interval_time % 60;   
            interval_time--;
            view_timer.innerHTML = String(min).padStart(2,"0") + ":" + String(sec).padStart(2,"0");
        // }else if (interval_time === 0) {
        //     view_timer.innerHTML = "TIME UP!";
        };
    };
};

// for(let i = 0; i < repeat_time; i++){
// };
// if (i === repeat_time){
//     view_timer.innerHTML = "TIME UP!";
// };