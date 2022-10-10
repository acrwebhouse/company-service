const config = require('../setting/config').config;
const utilsValue = require('../utils/value');
const httpRequest = require('../utils/httpRequest');

function removeManageData(data){
    for(let i = 0 ;i< data.length; i++){
        for(let j = 0 ;j<data[i].managerData.length;j++){
            const item = {
                account : data[i].managerData[j].account,
                name : data[i].managerData[j].name,
                gender : data[i].managerData[j].gender,
                mail : data[i].managerData[j].mail,
                phone : data[i].managerData[j].phone,
            }
            data[i].managerData[j] = item;
        }
    }
    return data
}

function getEmployeesByUserId(id,callback) {
    const url = config['employees-basic-server'].location+'/'+config['employees-basic-server'].restApi.getEmployeesByUserId + '?id=' + id
    const method = 'GET';
    const headers = {};
    httpRequest.sendGetRequest(url, headers, method, (error, body) => {
        if (error) {
            console.log('===getEmployeesByUserId==url=')
            console.log(url)
            console.log('===getEmployeesByUserId==error=')
            console.log(error)
            console.log('===getEmployeesByUserId==body=')
            console.log(body)
            callback(false,body);
        } else {
            try{
                const res = JSON.parse(body)
                const data = removeManageData(res.data)
                callback(true,data);
            }catch(e){
                console.log(e)
                callback(false,"data format error: "+e);
            }
        }
    });
}

function getEmployeesListByCompanyId(companyId,skip,limit,callback) {
    let url = config['employees-basic-server'].location+'/'+config['employees-basic-server'].restApi.getEmployeesListByCompanyId ;
    let preStr = '?'
    if(utilsValue.isValid(companyId)){
        url = url + preStr + 'companyId=' + companyId
        preStr = '&&'
    }
    if(utilsValue.isValid(skip)){
        url = url + preStr + 'skip=' + skip
        preStr = '&&'
    }
    if(utilsValue.isValid(limit)){
        url = url + preStr + 'limit=' + limit
        preStr = '&&'
    }
    const method = 'GET';
    const headers = {};
    httpRequest.sendGetRequest(url, headers, method, (error, body) => {
        if (error) {
            console.log('===getEmployeesListByCompanyId==url=')
            console.log(url)
            console.log('===getEmployeesListByCompanyId==error=')
            console.log(error)
            console.log('===getEmployeesListByCompanyId==body=')
            console.log(body)
            callback(false,body);
        } else {
            try{
                const res = JSON.parse(body)
                const data = removeManageData(res.data)
                callback(true,data);
            }catch(e){
                console.log(e)
                callback(false,"data format error: "+e);
            }
        }
    });
}

function isEmployeeExist(companyId,userId,callback){
    getEmployeesByUserId(userId,(result,data)=>{
        if(result == true){
            let isExist = false;
            let id = ''
            for(let i = 0 ;i<data.length; i++){
                if(companyId == data[i].companyId){
                    isExist = true
                    id = data[i]._id
                }
            }
            if(isExist == true){
                callback(isExist,id)
            }else{
                callback(isExist,'employee is not exist')
            }
        }else{
            callback(result,data)
        }
    })
}

function applyEmployees(companyId,userId,callback) {
    const rank = 100;
    const managerId = '' ;
    const state = 1;
    isEmployeeExist(companyId,userId,(result,data)=>{
        if(result == true){
            const id = data
            editEmployees(id,companyId,userId,rank,managerId,state,callback)
        }else if(data == 'employee is not exist'){
            addEmployees(companyId,userId,rank,managerId,state,callback)
        }else{
            callback(result,data)
        }
    })
}

function editEmployees(id,companyId,userId,rank,managerId,state,callback) {
    const employee = {
        id,
        companyId,
        userId,
        rank,
        managerId,
        state
    }
    const url = config['employees-basic-server'].location+'/'+config['employees-basic-server'].restApi.editEmployees;
    const method = 'PUT';
    const headers = {};
    httpRequest.sendJsonRequest(url, headers, employee, method, (error, body) => {
        if (error) {
            console.log('===editEmployees==error=')
            console.log(error)
            console.log('===editEmployees==body=')
            console.log(body)
            callback(false,body);
        } else {
            if (body.data.ok > 0){
                callback(true,body.data.updateData);
            }else{
                callback(false,body.data);
            }
        }
    });
}

function addEmployees(companyId,userId,rank,managerId,state,callback) {
    const employee = {
        companyId,
        userId,
        rank,
        managerId,
        state
    }
    const url = config['employees-basic-server'].location+'/'+config['employees-basic-server'].restApi.addEmployees;
    const method = 'POST';
    const headers = {};
    httpRequest.sendJsonRequest(url, headers, employee, method, (error, body) => {
        if (error) {
            console.log('===addEmployees==error=')
            console.log(error)
            console.log('===addEmployees==body=')
            console.log(body)
            callback(false,body);
        } else {
            if (utilsValue.isValid(body.data.result)){
                if(body.data.result.ok == 1){
                    callback(true,body.data.ops[0]);
                }else{
                    callback(true,'insert fail');
                }
            }else{
                callback(false,body.data);
            }
        }
    });
}

exports.getEmployeesByUserId = getEmployeesByUserId
exports.getEmployeesListByCompanyId = getEmployeesListByCompanyId
exports.applyEmployees = applyEmployees
exports.editEmployees = editEmployees

