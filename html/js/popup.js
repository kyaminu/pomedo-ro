/* 変数定義 */
const timerPage = document.getElementById('timerPage');
const characterPage = document.getElementById('characterPage');
const otherPage = document.getElementById('otherPage');
const makeTimerBtn = document.getElementById('makeTimerBtn');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');

/* タイマーを作成したらホームに表示する箇所 */
makeTimerBtn.onclick = function () {
    let repeat_time = document.forms.timerForm.repeat_time.value;
    let work_time = document.forms.timerForm.work_time.value;
    let interval = document.forms.timerForm.interval.value;

    document.getElementById("renderWork").innerHTML = work_time;
    document.getElementById("timerDetails").innerHTML = repeat_time + "の間" + "<br>" + work_time + "集中" + "/" + interval + "休憩を繰り返す";
};