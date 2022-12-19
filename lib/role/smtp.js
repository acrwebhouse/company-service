const config = require('../setting/config').config;
const utilsValue = require('../utils/value');
const httpRequest = require('../utils/httpRequest');
const employees = require('./employees');

function sendMail(toMail,subject,content,callback){
    const url = config['smtp-basic-server'].location+'/'+config['smtp-basic-server'].restApi.sendMail;
    const method = 'POST';
    const headers = {
        'Content-Type': 'application/json'
    };
    const doc = {
        toMail,
        subject,
        content,
    }
    httpRequest.sendJsonRequest(url, headers, doc, method, (error, body) => {
        if (error) {
          callback(false,body);
        } else {
          callback(body.status,body.data);
        }
      });
}

function getResignNotifyContent(userName,companyName,time){
    let first = '';
    if(utilsValue.isValid(userName)){
        first += '親愛的 '+userName+' 您好：<br>'
    }else{
        first += '親愛的您好：<br>'
    }

    const second = `正式通知您，【 ${companyName} 】在 ${time} 已把您從公司群組給移除。待您重新加入新公司後會再開啟公司群組功能。<br>`

    const end = `謝謝`
    const content = `<div style=color:black;>${first}<div/><br><div style=color:black;>${second}<br><div/><div style=color:black;>${end}<div/>`
    return content
}

function getResignNotifyMailData(companyId,employees){
    const result = {
        companyName : '',
        userName :'',
        toMail:''
    }
    for(let i = 0 ;i<employees.length;i++){
        if(employees[i].companyId === companyId && employees[i].companyData.length > 0 && employees[i].userData.length > 0){
            result.companyName = employees[i].companyData[0].name
            result.userName = employees[i].userData[0].name
            result.toMail = employees[i].userData[0].mail
            i = employees.length
        }
    }
    return result
}

function sendResignNotifyMail(userId,companyId,callback){
    const time = utilsValue.getCurrentTime()
    employees.getEmployeesByUserId(userId,(result,data)=>{
        const resignNotifyMailData = getResignNotifyMailData(companyId,data)
        if(result === true){
            const subject = '[退出公司群組通知] - ' + time
            const content = getResignNotifyContent(resignNotifyMailData.userName,resignNotifyMailData.companyName,time);
            sendMail(resignNotifyMailData.toMail,subject,content,callback)
        }else{
            callback(false,false)
        }
    })
}


exports.sendResignNotifyMail = sendResignNotifyMail
