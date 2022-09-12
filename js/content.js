//画像取得
const pome_happy_1_url = chrome.runtime.getURL('src/images/pome_happy_1.png');
const pome_happy_2_url = chrome.runtime.getURL('src/images/pome_happy_2.png');
const pome_angry_1_url = chrome.runtime.getURL('src/images/pome_angry_1.png');
const pome_angry_2_url = chrome.runtime.getURL('src/images/pome_angry_2.png');

//通知音取得
const pome_work_alarm_url = chrome.runtime.getURL('src/mp3/pome_work_alarm.mp3');
const pome_interval_alarm_url = chrome.runtime.getURL('src/mp3/pome_interval_alarm.mp3');
const finish_alarm_url = chrome.runtime.getURL('src/mp3/finish_alarm.mp3');

//css
const style = "width: 100px; height: auto; bottom: 0px; left: 0px; position: fixed; z-index: 9999999;"

//HTMLタグ
const pome_hppy1_tag = `<img src="${pome_happy_1_url}" id="imgPome" style="${style}">`;
const pome_hppy2_tag = `<img src="${pome_happy_2_url}" id="imgPome" style="${style}">`;
const pome_angry1_tag = `<img src="${pome_angry_1_url}" id="imgPome" style="${style}">`;
const pome_angry2_tag = `<img src="${pome_angry_2_url}" id="imgPome" style="${style}">`;

const pome_work_alarm_tag = `<audio src="${pome_work_alarm_url}" id="alarmPome"></audio>`;
const pome_interval_alarm_tag = `<audio src="${pome_interval_alarm_url}" id="alarmPome"></audio>`;
const finish_alarm_tag = `<audio src="${finish_alarm_url}" id="alarmPome"></audio>`;

//dialog個別css
const finish_dialog_img = chrome.runtime.getURL('src/images/finish_dialog_img.png');
const finish_dialog_style = `"width: 300px; height: 100px; border: none; border-radius: 10px; background-image: url(${finish_dialog_img}); background-size: 100% 100%;"`

//dialog共通
const div_style = `"text-align: center; font-size: 30px; font-weight: bold; padding-top: 10px;"`
const ok_btn_style = `"padding: 3px 10px; margin-top: 10px; margin-left: 130px; background-color: #FFFFDD; border-color: #FFFFBB; border-radius: 10px;"`

//htmlに挿入
document.querySelector("body").insertAdjacentHTML("afterbegin", `<dialog id="finish_dialog" style=${finish_dialog_style}><div style=${div_style}}>TIME UP!</div><button id="ok_btn" style=${ok_btn_style}>OK</button></dialog>`);
const finish_dialog = document.getElementById("finish_dialog");

chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse){
    if(request.msg == "finish"){
        finish_dialog.showModal();
    }
    return true
})

const ok_btn = document.getElementById('ok_btn')
ok_btn.onclick = function(){
    finish_dialog.close()
}



//実際にコードに入れる
document.querySelector("body").insertAdjacentHTML("afterbegin", pome_hppy1_tag);
document.querySelector("body").insertAdjacentHTML("afterbegin", pome_work_alarm_tag);

document.getElementById("imgPome").onclick = function(){
    document.getElementById("alarmPome").play()
}