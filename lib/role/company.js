const config = require('../setting/config').config;
const utilsValue = require('../utils/value');
const httpRequest = require('../utils/httpRequest');
const employees = require('./employees');

function getCompanyList(name,unifiedBusinessNo,state,skip,limit,timeSort,callback) {
    let url = config['company-basic-server'].location+'/'+config['company-basic-server'].restApi.getCompanyList
    let preStr = '?';
    if(utilsValue.isValid(name)){
        url = url + preStr + 'name='+encodeURIComponent(name)
        preStr = '&&'
    }
    if(utilsValue.isValid(unifiedBusinessNo)){
        url = url + preStr + 'unifiedBusinessNo='+unifiedBusinessNo
        preStr = '&&'
    }
    if(utilsValue.isValid(state)){
        url = url + preStr + 'state='+state
        preStr = '&&'
    }
    if(utilsValue.isValid(skip)){
        url = url + preStr + 'skip='+skip
        preStr = '&&'
    }
    if(utilsValue.isValid(limit)){
        url = url + preStr + 'limit='+limit
        preStr = '&&'
    }

    if(utilsValue.isValid(timeSort)){
        timeSort = timeSort*1;
        const sort = {
            updateTime:timeSort
        }
        url = url + preStr + 'sort='+JSON.stringify(sort) 
    }
    const method = 'GET';
    const headers = {};
    httpRequest.sendGetRequest(url, headers, method, (error, body) => {
        if (error) {
            console.log('===getCompanyList==url=')
            console.log(url)
            console.log('===getCompanyList==error=')
            console.log(error)
            console.log('===getCompanyList==body=')
            console.log(body)
            callback(false,body);
        } else {
            try{
                const res = JSON.parse(body)
                callback(true,res.data);
            }catch(e){
                callback(false,"data format error: "+body);
            }
        }
    });
}

function getCompanyById(id,callback) {
    const url = config['company-basic-server'].location+'/'+config['company-basic-server'].restApi.getCompanyById + '?id=' + id
    const method = 'GET';
    const headers = {};
    httpRequest.sendGetRequest(url, headers, method, (error, body) => {
        if (error) {
            console.log('===getCompanyList==url=')
            console.log(url)
            console.log('===getCompanyList==error=')
            console.log(error)
            console.log('===getCompanyList==body=')
            console.log(body)
            callback(false,body);
        } else {
            try{
                const res = JSON.parse(body)
                callback(true,res.data);
            }catch(e){
                callback(false,"data format error: "+body);
            }
        }
    });
}

function getCompanyAdmin(companyId,callback){
    const admin = ''
    employees.getEmployeesByUserId(companyId,(result,data)=>{
        if(result == true){
            for(let i = 0 ;i<data.length; i++){
                if(data[i].state == 2 && data[i].rank == 0){
                    admin = data[i]
                    i = data.length
                }
            }
        }
        callback(admin)
    })
}

exports.getCompanyById = getCompanyById
exports.getCompanyList = getCompanyList
exports.getCompanyAdmin = getCompanyAdmin