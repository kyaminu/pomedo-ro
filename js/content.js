//キャラ画像取得
const pome_happy_1_url = chrome.runtime.getURL('src/images/pome_happy_1.png');
const pome_happy_2_url = chrome.runtime.getURL('src/images/pome_happy_2.png');
const pome_angry_1_url = chrome.runtime.getURL('src/images/pome_angry_1.png');
const pome_angry_2_url = chrome.runtime.getURL('src/images/pome_angry_2.png');

//dialog画像取得
const start_dialog_img_url = chrome.runtime.getURL('src/images/start_dialog_img.png');
const interval_dialog_img_url = chrome.runtime.getURL('src/images/interval_dialog_img.png');
const finish_dialog_img_url = chrome.runtime.getURL('src/images/finish_dialog_img.png');

//通知音取得
const pome_work_alarm_url = chrome.runtime.getURL('src/mp3/pome_work_alarm.mp3');
const pome_interval_alarm_url = chrome.runtime.getURL('src/mp3/pome_interval_alarm.mp3');
const finish_alarm_url = chrome.runtime.getURL('src/mp3/finish_alarm.mp3');

//キャラのcss
const pome_style = "width: 100px; height: auto; bottom: 0px; left: 0px; position: fixed; z-index: 9999999;"

//HTML画像タグ
const pome_hppy1_tag = `<img src="${pome_happy_1_url}" id="imgPome" style="${pome_style}">`;
const pome_hppy2_tag = `<img src="${pome_happy_2_url}" id="imgPome" style="${pome_style}">`;
const pome_angry1_tag = `<img src="${pome_angry_1_url}" id="imgPome" style="${pome_style}">`;
const pome_angry2_tag = `<img src="${pome_angry_2_url}" id="imgPome" style="${pome_style}">`;

//HTML音声タグ
const pome_work_alarm_tag = `<audio src="${pome_work_alarm_url}" id="pome_work_alarm"></audio>`;
const pome_interval_alarm_tag = `<audio src="${pome_interval_alarm_url}" id="pome_interval_alarm"></audio>`;
const finish_alarm_tag = `<audio src="${finish_alarm_url}" id="finish_alarm"></audio>`;

//dialog個別のcss
const start_dialog_style = `"width: 300px; height: 100px; border: none; border-radius: 10px; background-image: url(${start_dialog_img_url}); background-size: 100% 100%;"`
const interval_dialog_style = `"width: 300px; height: 100px; border: none; border-radius: 10px; background-image: url(${interval_dialog_img_url}); background-size: 100% 100%;"`
const finish_dialog_style = `"width: 300px; height: 100px; border: none; border-radius: 10px; background-image: url(${finish_dialog_img_url}); background-size: 100% 100%;"`

//dialog共通css
const div_style = `"color: black; text-align: center; font-size: 30px; font-weight: bold; padding-top: 10px; color: #330000; text-shadow: 1.5px 1.5px 0 #778899; -webkit-text-stroke: 1px #888; text-stroke: 1px #888;"`
const ok_btn_style = `"color: black; padding: 3px 10px; margin-top: 10px; margin-left: 130px; background-color: #FFFFDD; border-color: #FFFFBB; border-radius: 10px;"`

//音声をhtmlに挿入
document.querySelector("body").insertAdjacentHTML("afterbegin", pome_work_alarm_tag);
document.querySelector("body").insertAdjacentHTML("afterbegin", pome_interval_alarm_tag);
document.querySelector("body").insertAdjacentHTML("afterbegin", finish_alarm_tag);

//dialogをhtmlに挿入
document.querySelector("body").insertAdjacentHTML("afterbegin", `<dialog id="start_dialog" style=${start_dialog_style}><div style=${div_style}}>START!</div><button id="start_ok_btn" style=${ok_btn_style}>OK</button></dialog>`);
const start_dialog = document.getElementById("start_dialog");

document.querySelector("body").insertAdjacentHTML("afterbegin", `<dialog id="interval_dialog" style=${interval_dialog_style}><div style=${div_style}}>Refresh time!</div><button id="interval_ok_btn" style=${ok_btn_style}>OK</button></dialog>`);
const interval_dialog = document.getElementById("interval_dialog");

document.querySelector("body").insertAdjacentHTML("afterbegin", `<dialog id="finish_dialog" style=${finish_dialog_style}><div style=${div_style}}>TIME UP!</div><button id="finish_ok_btn" style=${ok_btn_style}>OK</button></dialog>`);
const finish_dialog = document.getElementById("finish_dialog");

//スタートdialog表示
chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse){
    if(request.msg == "start"){
        start_dialog.showModal();
        document.getElementById("pome_work_alarm").play()
    }
    return true
})

//スタートdialogの閉じるボタン
document.getElementById('start_ok_btn').onclick = function(){
    start_dialog.close()
}

//休憩のdialog表示
chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse){
    if(request.msg == "interval"){
        if(start_dialog.showModal){
            start_dialog.close()
            interval_dialog.showModal();
            document.getElementById("pome_interval_alarm").play()
        }
    }
    return true
})

//休憩のdialogの閉じるボタン
document.getElementById('interval_ok_btn').onclick = function(){
    interval_dialog.close()
}

//フィニッシュのdialog表示
chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse){
    if(request.msg == "finish"){
        if(interval_dialog.showModal){
            interval_dialog.close()
            finish_dialog.showModal();
            document.getElementById("finish_alarm").play()
        }
    }
    return true
})

//フィニッシュのdialogの閉じるボタン
document.getElementById('finish_ok_btn').onclick = function(){
    finish_dialog.close()
}



//実際にコードに入れる
document.querySelector("body").insertAdjacentHTML("afterbegin", pome_hppy1_tag);