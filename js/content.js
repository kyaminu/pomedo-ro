//キャラ画像取得
const pome_happy_url = chrome.runtime.getURL('src/images/pome_happy_2.png');
const pome_angry_url = chrome.runtime.getURL('src/images/pome_angry.png');

//dialog画像取得
const start_dialog_img_url = chrome.runtime.getURL('src/images/start_dialog_img.png');
const interval_dialog_img_url = chrome.runtime.getURL('src/images/interval_dialog_img.png');
const finish_dialog_img_url = chrome.runtime.getURL('src/images/finish_dialog_img.png');

//通知音取得
const pome_work_alarm_url = chrome.runtime.getURL('src/mp3/pome_work_alarm.mp3#t=0,2.5');
const pome_interval_alarm_url = chrome.runtime.getURL('src/mp3/pome_interval_alarm.mp3');
const finish_alarm_url = chrome.runtime.getURL('src/mp3/finish_alarm.mp3');

//HTML画像タグ
const pome_hppy_tag = `<img src="${pome_happy_url}" id="pome_happy_img">`;
const pome_angry_tag = `<img src="${pome_angry_url}" id="pome_angry_img">`;

//キャラのcssを挿入
document.querySelector("head").insertAdjacentHTML("afterbegin", '<style>#pome_happy_img {width: 100px; height: auto; bottom: 0px; left: 0px; position: fixed; z-index: 9999999; border-style: none; animation: pome_happy_move 5s linear 1s 12;} @keyframes pome_happy_move {0%   { transform: scale(1.0, 1.0) translate(0%, 0%); }10%  { transform: scale(1.1, 0.9) translate(0%, 5%); } 40%  { transform: scale(1.2, 0.8) translate(0%, 15%); } 50%  { transform: scale(1.0, 1.0) translate(0%, 0%); } 60%  { transform: scale(0.9, 1.2) translate(0%, -100%); } 75%  { transform: scale(0.9, 1.2) translate(0%, -20%); } 85%  { transform: scale(1.2, 0.8) translate(0%, 15%); } 100% { transform: scale(1.0, 1.0) translate(0%, 0%); }}}</style>');

document.querySelector("head").insertAdjacentHTML("afterbegin", '<style>#pome_angry_img {width: 100px; height: auto; bottom: 0px; left: 0px; position: fixed; z-index: 9999999; border-style: none; animation: pome_angry_move 10s linear 1s 12;} @keyframes pome_angry_move {0% { transform: scale(1.0, 1.0) translate(0%, 0%); }15%  { transform: scale(0.9, 0.9) translate(0%, 5%); }30%  { transform: scale(1.3, 0.8) translate(0%, 10%); }50%  { transform: scale(0.8, 1.3) translate(0%, -10%); }70%  { transform: scale(1.1, 0.9) translate(0%, 5%); }100% { transform: scale(1.0, 1.0) translate(0%, 0%); }}</style>');

//HTML音声タグ
const pome_work_alarm_tag = `<audio src="${pome_work_alarm_url}" id="pome_work_alarm"></audio>`;
const pome_interval_alarm_tag = `<audio src="${pome_interval_alarm_url}" id="pome_interval_alarm"></audio>`;
const finish_alarm_tag = `<audio src="${finish_alarm_url}" id="finish_alarm"></audio>`;


//dialogの共通css
const dialog_style = `width: 300px; height: 110px; border: none; border-radius: 10px; background-size: 100% 100%; position: fixed; inset: 0; margin:auto; display: none;`
const dialog_text_style = `"color: black; text-align: center; font-size: 30px; font-weight: bold; padding-top: 10px; color: #330000; text-shadow: 1.5px 1.5px 0 #778899; -webkit-text-stroke: 1px #888; text-stroke: 1px #888;"`
const ok_btn_style = `"color: black; padding: 3px 10px; margin-top: 10px; margin-left: 130px; background-color: #FFFFDD; border-color: #FFFFBB; border-radius: 10px;"`

//dialog個別のcss
const start_dialog_style = `"${dialog_style} background-image: url(${start_dialog_img_url});"`
const interval_dialog_style = `"${dialog_style} background-image: url(${interval_dialog_img_url});"`
const finish_dialog_style = `"${dialog_style} background-image: url(${finish_dialog_img_url});"`

//音声をhtmlに挿入
document.querySelector("body").insertAdjacentHTML("afterbegin", pome_work_alarm_tag);
document.querySelector("body").insertAdjacentHTML("afterbegin", pome_interval_alarm_tag);
document.querySelector("body").insertAdjacentHTML("afterbegin", finish_alarm_tag);

// dialogをhtmlに挿入
document.querySelector("body").insertAdjacentHTML("afterbegin", 
    `<dialog id="start_dialog" style=${start_dialog_style}>
        <div id="close_dialog" style=${dialog_text_style}}>START!</div>
        <button id="start_ok_btn" style=${ok_btn_style}>OK</button>
    </dialog>`
);

document.querySelector("body").insertAdjacentHTML("afterbegin",
    `<dialog id="interval_dialog" style=${interval_dialog_style}>
        <div id="close_dialog" style=${dialog_text_style}}>Refresh time!</div>
        <button id="interval_ok_btn" style=${ok_btn_style}>OK</button>
    </dialog>`
);

document.querySelector("body").insertAdjacentHTML("afterbegin", 
    `<dialog id="finish_dialog" style=${finish_dialog_style}>
        <div id="close_dialog" style=${dialog_text_style}}>TIME UP!</div>
        <button id="finish_ok_btn" style=${ok_btn_style}>OK</button>
    </dialog>`
);

//htmlにdialogを挿入したことで取得可能になる
const start_dialog = document.getElementById("start_dialog");
const interval_dialog = document.getElementById("interval_dialog");
const finish_dialog = document.getElementById("finish_dialog");

//スタートdialog表示
chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse){
    //bgから
    if(request.msg == "start"){
        if(interval_dialog.showModal){
            interval_dialog.close()
            interval_dialog.style.display = "none";
        }

        if(document.getElementById("pome_happy_img")){
            document.getElementById("pome_happy_img").remove();
        }

        start_dialog.style.display = "block";
        start_dialog.showModal();
        document.getElementById("pome_work_alarm").play()
        document.querySelector("body").insertAdjacentHTML("afterbegin", pome_angry_tag);
    }
    return true
})

//休憩のdialog表示
chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse){
    //bgから
    if(request.msg == "interval"){
        start_dialog.close()
        start_dialog.style.display = "none";
        interval_dialog.style.display = "block";
        interval_dialog.showModal();
        document.getElementById("pome_interval_alarm").play()
        document.getElementById("pome_angry_img").remove();
        document.querySelector("body").insertAdjacentHTML("afterbegin", pome_hppy_tag);
    }
    return true
})

//フィニッシュのdialog表示
chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse){
    //bgから
    if(request.msg == "finish"){
        interval_dialog.close()
        interval_dialog.style.display = "none";
        finish_dialog.style.display = "block";
        finish_dialog.showModal();
        document.getElementById("finish_alarm").play()
        document.getElementById("pome_happy_img").remove();
    }
    return true
})

//各dialogの閉じるボタン
document.getElementById('start_ok_btn').onclick = function(){
    start_dialog.close()
    start_dialog.style.display = "none";
}

document.getElementById('interval_ok_btn').onclick = function(){
    interval_dialog.close()
    interval_dialog.style.display = "none";
}

document.getElementById('finish_ok_btn').onclick = function(){
    finish_dialog.close()
    finish_dialog.style.display = "none";
}

//ダイアログの外側クリックで閉じる処理 
// https://zenn.dev/de_teiu_tkg/articles/96a46374655e56
start_dialog.addEventListener('click', (event) => {
    if(event.target.closest('#close_dialog') === null) {
        start_dialog.close()
        start_dialog.style.display = "none";
    }
});

interval_dialog.addEventListener('click', (event) => {
    if(event.target.closest('#close_dialog') === null) {
        interval_dialog.close()
        interval_dialog.style.display = "none";
    }
});

finish_dialog.addEventListener('click', (event) => {
    if(event.target.closest('#close_dialog') === null) {
        finish_dialog.close()
        finish_dialog.style.display = "none";
    }
});

//リセットボタン押したらキャラが消える
chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse){
    //popupから
    if(request.msg == "reset"){
        if(document.getElementById("pome_angry_img")){
            document.getElementById("pome_angry_img").remove();
        }else if(document.getElementById("pome_happy_img")){
            document.getElementById("pome_happy_img").remove();
        }
    }
})