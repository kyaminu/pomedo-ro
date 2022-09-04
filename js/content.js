//キャラ取得
const pome_happy_1_url = chrome.runtime.getURL('src/images/pome_happy_1.png');
const pome_happy_2_url = chrome.runtime.getURL('src/images/pome_happy_2.png');
const pome_angry_1_url = chrome.runtime.getURL('src/images/pome_angry_1.png');
const pome_angry_2_url = chrome.runtime.getURL('src/images/pome_angry_2.png');

//通知音取得
const pome_work_alarm_url = chrome.runtime.getURL('src/mp3/pome_work_alarm.mp3');
const pome_interval_alarm_url = chrome.runtime.getURL('src/mp3/pome_interval_alarm.mp3');
const finish_alarm_url = chrome.runtime.getURL('src/mp3/finish_alarm.mp3');

//cssの中身
const style = "width: 100px; height: auto; bottom: 0px; left: 0px; position: fixed; z-index: 9999999;"

//HTMLタグ
const pome_hppy1_tag = `<img src="${pome_happy_1_url}" id="imgPome" style="${style}">`;
const pome_hppy2_tag = `<img src="${pome_happy_2_url}" id="imgPome" style="${style}">`;
const pome_angry1_tag = `<img src="${pome_angry_1_url}" id="imgPome" style="${style}">`;
const pome_angry2_tag = `<img src="${pome_angry_2_url}" id="imgPome" style="${style}">`;

const pome_work_alarm_tag = `<audio src="${pome_work_alarm_url}" id="alarmPome"></audio>`;
const pome_interval_alarm_tag = `<audio src="${pome_interval_alarm_url}" id="alarmPome"></audio>`;
const finish_alarm_tag = `<audio src="${finish_alarm_url}" id="alarmPome"></audio>`;

//実際にコードに入れる
document.querySelector("body").insertAdjacentHTML("afterbegin", pome_hppy1_tag);
document.querySelector("body").insertAdjacentHTML("afterbegin", pome_work_alarm_tag);

document.getElementById("imgPome").onclick = function(){
    document.getElementById("alarmPome").play()
}