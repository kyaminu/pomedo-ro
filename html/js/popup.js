// 変数定義
const timerPage = document.getElementById('timerPage');
const characterPage = document.getElementById('characterPage');
const otherPage = document.getElementById('otherPage');
const makeTimerBtn = document.getElementById('makeTimerBtn');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');


// タイマーを作成したらホームに表示する箇所 
makeTimerBtn.onclick = function () {
    let repeat_time = document.forms.timerForm.repeat_time.value;
    let work_time = document.forms.timerForm.work_time.value;
    let interval = document.forms.timerForm.interval.value;

    document.getElementById("work_time").innerHTML = `${work_time}:00`;
    if (repeat_time > 0) {
        document.getElementById("timerDetails").innerHTML = `${repeat_time}時間の間<br>${work_time}分集中 / ${interval}分休憩を繰り返す`;
    }else{
        document.getElementById("timerDetails").innerHTML = `${work_time}分集中 / ${interval}分休憩を繰り返す`;
    }

    startBtn.innerHTML = "<button class='btn btn-outline-info d-flex flex-column align-items-center m-2'>START</button>";
    stopBtn.innerHTML = "<button class='btn btn-outline-warning d-flex flex-column align-items-center m-2'>STOP</button>";
    resetBtn.innerHTML = "<button class='btn btn-outline-secondary d-flex flex-column align-items-center m-2'>RESET</button>";

    document.getElementById("noTimerImage").style.display ="none";
    document.getElementById("noTimer").style.display ="none";
};

//スタートボタンを押した時
startBtn.addEventListener('click', function() {
    setInterval(count_down, 1000);

    let work_time = parseInt(document.forms.timerForm.work_time.value, 10);
    let time = work_time * 60
    let min = 0;
    let sec = 0;

    let timer = document.getElementById("work_time");
    timer.innerHTML = `${work_time}:00`;

    function count_down() {
        if (time > 0) {
            let min = Math.floor(time / 60);
            let sec = time % 60;   
            time--;
            timer.textContent = String(min).padStart(2,"0") + ":" + String(sec).padStart(2,"0");
        }else if (time === 0) {
            timer.innerHTML = "TIME UP!";
        }
    }
});
