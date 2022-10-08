const config = require('../setting/config').config;
const utilsValue = require('../utils/value');
const httpRequest = require('../utils/httpRequest');

function getPersonalInfo(id,callback) {
    if (utilsValue.isValid(id)){
        const url = config['user-basic-server'].location+'/'+config['user-basic-server'].restApi.getUser + '?id='+id+'&&isDelete=false';
        const method = 'GET';
        const headers = {};
        httpRequest.sendGetRequest(url, headers, method, (error, body) => {
            if (error) {
                console.log('===getPersonalInfo==error=')
                console.log(error)
                console.log('===getPersonalInfo==body=')
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
    }else {
        callback(false, 'id invalid')
    }
}

function removeUser(ids,callback) {
    if (utilsValue.isValid(ids)){
        const url = config['user-basic-server'].location+'/'+config['user-basic-server'].restApi.removeUser;
        const method = 'DELETE';
        const headers = {};
        const json = {
            ids:ids
        }
        httpRequest.sendJsonRequest(url, headers, json, method, (error, body) => {
            if (error) {
              console.log('===removeUser==error=')
              console.log(error)
              console.log('===removeUser==body=')
              console.log(body)
              callback(false,body);
            } else {
              if(body.data.nModified > 0){
                callback(true,'remove '+body.data.nModified+' account');
              }else{
                callback(false,'no match id');
              }
            }
          });
    }else {
        callback(false, 'id invalid')
    }
}

function editUser(id,account,password,name,gender,roles,rolesInfo,houseIds,phone,mail,address,bornDate,callback) {
    const user = {}
    if (utilsValue.isValid(id)){
        user.id = id
    }
    if (utilsValue.isValid(account)){
        user.account = account
    }
    if (utilsValue.isValid(password)){
        user.password = password
    }
    if (utilsValue.isValid(name)){
        user.name = name
    }
    if (utilsValue.isValid(gender) || gender === false){
        user.gender = gender
    }
    if (utilsValue.isValid(roles)){
        user.roles = roles
    }
    if (utilsValue.isValid(rolesInfo)){
        user.rolesInfo = rolesInfo
    }
    if (utilsValue.isValid(houseIds)){
        user.houseIds = houseIds
    }
    if (utilsValue.isValid(phone)){
        user.phone = phone
    }
    if (utilsValue.isValid(mail)){
        user.mail = mail
    }
    if (utilsValue.isValid(address)){
        user.address = address
    }

    if (utilsValue.isValid(bornDate)){
        user.bornDate = bornDate
    }

    const url = config['user-basic-server'].location+'/'+config['user-basic-server'].restApi.editUser;
    const method = 'PUT';
    const headers = {};

    httpRequest.sendJsonRequest(url, headers, user, method, (error, body) => {
        if (error) {
            console.log('===editUser==error=')
            console.log(error)
            console.log('===editUser==body=')
            console.log(body)
            callback(false,body);
        } else {
            if(body.data.nModified > 0){
                const result = body.data.updateData
                result.token = generateToken(result)
                callback(true,result);
            }else{
                callback(false,'no match id');
            }
        }
    });
}

function generateToken(user){
    const data = {
        id:user._id,
        roles:user.roles,
        iat:new Date()
    }
    const token = utilsValue.jwtEncode(data)
    return token;
}

function getUsers(start,count,timeSort,roles,name,salesCity,salesArea,callback) {
    let url = config['user-basic-server'].location+'/'+config['user-basic-server'].restApi.getUsers + '?isDelete=false'

    if(utilsValue.isValid(start)){
        url = url + '&&skip='+start
    }
    if(utilsValue.isValid(count)){
        url = url + '&&limit='+count
    }
    if(utilsValue.isValid(roles)){
        url = url + '&&roles='+roles
    }
    if(utilsValue.isValid(name)){
        url = url + '&&name='+encodeURIComponent(name)
    }

    if(utilsValue.isValid(timeSort)){
        timeSort = timeSort*1;
        const sort = {
            updateTime:timeSort
        }
        url = url + '&&sort='+JSON.stringify(sort) 
    }
    let haveSalesInfo = false;
    const salesInfo = {}
    if(utilsValue.isValid(salesCity)){
        haveSalesInfo = true
        salesInfo.city = encodeURIComponent(salesCity)
    }
    if(utilsValue.isValid(salesArea)){
        haveSalesInfo = true
        salesInfo.area = encodeURIComponent(salesArea)
    }
    if(haveSalesInfo == true){
        url = url + '&&salesInfo='+JSON.stringify(salesInfo) 
    }
    const method = 'GET';
    const headers = {};
    httpRequest.sendGetRequest(url, headers, method, (error, body) => {
        if (error) {
            console.log('===getUsers==url=')
            console.log(url)
            console.log('===getUsers==error=')
            console.log(error)
            console.log('===getUsers==body=')
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

exports.getPersonalInfo = getPersonalInfo
exports.removeUser = removeUser
exports.editUser = editUser
exports.getUsers = getUsers