const config = require('../setting/config').config;
const httpRequest = require('../utils/httpRequest');
const utilsValue = require('../utils/value');
const house = require('./house');

function addTransaction(houseId,userId,actualPrice,serviceCharge,startRentDate,endRentDate,companyId,callback){
    const transaction = {
        houseId,
        userId,
        actualPrice,
        serviceCharge,
        startRentDate,
        endRentDate,
        companyId,
        state : 1,
    }
    const url = config['transaction-basic-server'].location+'/'+config['transaction-basic-server'].restApi.addTransaction;
    const method = 'POST';
    const headers = {};
    httpRequest.sendJsonRequest(url, headers, transaction, method, (error, body) => {
        if (error) {
            console.log('===addTransaction==error=')
            console.log(error)
            console.log('===addTransaction==body=')
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

function applyTransaction(houseId,userId,actualPrice,serviceCharge,startRentDate,endRentDate,companyId,callback){
    console.log('=applyTransaction====houseId===',houseId)
    console.log('=applyTransaction====userId===',userId)
    console.log('=applyTransaction====actualPrice===',actualPrice)
    console.log('=applyTransaction====serviceCharge===',serviceCharge)
    console.log('=applyTransaction====startRentDate===',startRentDate)
    console.log('=applyTransaction====endRentDate===',endRentDate)
    console.log('=applyTransaction====companyId===',companyId)
    house.getHouse(houseId,(result,data)=>{
        console.log('=getHouse====result===',result)
        // console.log('=getHouse====data===',data)
        const transactionId = data.transactionId
        console.log('=getHouse====transactionId===',transactionId)
        console.log(utilsValue.isValid(transactionId))
        if(utilsValue.isValid(transactionId) === false){
            console.log('=applyTransaction===addTransaction=')
            addTransaction(houseId,userId,actualPrice,serviceCharge,startRentDate,endRentDate,companyId,(result,data)=>{
                console.log('=addTransaction====result===',result)
                console.log('=addTransaction====data===',data)
                callback(true,'pending')
            })
        }else{
            console.log('=applyTransaction===editTransaction=')
            callback(true,'pending')
        }
        
    })
    

}

function removeUserData(data){
    for(let i = 0 ;i< data.length; i++){
        for(let j = 0 ;j<data[i].userData.length;j++){
            const item = {
                account : data[i].userData[j].account,
                name : data[i].userData[j].name,
                gender : data[i].userData[j].gender,
                mail : data[i].userData[j].mail,
                phone : data[i].userData[j].phone,
            }
            data[i].userData[j] = item;
        }
    }
    return data
}

function getTransactionList(userId,companyId,minPrice,maxPrice,startTransactionDate,endTransactionDate,city,area,minServiceCharge,maxServiceCharge,minActualPrice,maxActualPrice,typeOfRental,isDelete,skip,limit,callback) {
    let url = config['transaction-basic-server'].location+'/'+config['transaction-basic-server'].restApi.getTransactionList
    let preStr = '?'
    if(utilsValue.isValid(userId)){
        url = url + preStr + 'userId=' + userId
        preStr = '&&'
    }
    if(utilsValue.isValid(companyId)){
        url = url + preStr + 'companyId=' + companyId
        preStr = '&&'
    }
    if(utilsValue.isValid(minPrice)){
        url = url + preStr + 'minPrice=' + minPrice
        preStr = '&&'
    }
    if(utilsValue.isValid(maxPrice)){
        url = url + preStr + 'maxPrice=' + maxPrice
        preStr = '&&'
    }
    if(utilsValue.isValid(minServiceCharge)){
        url = url + preStr + 'minServiceCharge=' + minServiceCharge
        preStr = '&&'
    }
    if(utilsValue.isValid(maxServiceCharge)){
        url = url + preStr + 'maxServiceCharge=' + maxServiceCharge
        preStr = '&&'
    }
    if(utilsValue.isValid(minActualPrice)){
        url = url + preStr + 'minActualPrice=' + minActualPrice
        preStr = '&&'
    }
    if(utilsValue.isValid(maxActualPrice)){
        url = url + preStr + 'maxActualPrice=' + maxActualPrice
        preStr = '&&'
    }
    if(utilsValue.isValid(startTransactionDate)){
        url = url + preStr + 'startTransactionDate=' + startTransactionDate
        preStr = '&&'
    }
    if(utilsValue.isValid(endTransactionDate)){
        url = url + preStr + 'endTransactionDate=' + endTransactionDate
        preStr = '&&'
    }
    if(utilsValue.isValid(area)){
        url = url + preStr + 'area=' + encodeURIComponent(area)
        preStr = '&&'
    }
    if(utilsValue.isValid(city)){
        url = url + preStr + 'city=' + encodeURIComponent(city)
        preStr = '&&'
    }
    if(utilsValue.isValid(typeOfRental)){
        url = url + preStr + 'typeOfRental=' + typeOfRental
        preStr = '&&'
    }
    if(utilsValue.isValid(isDelete)){
        url = url + preStr + 'isDelete=' + isDelete
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
            console.log('===getTransactionList==url=')
            console.log(url)
            console.log('===getTransactionList==error=')
            console.log(error)
            console.log('===getTransactionList==body=')
            console.log(body)
            callback(false,body);
        } else {
            try{
                const res = JSON.parse(body)
                const data = removeUserData(res.data)
                callback(true,data);
            }catch(e){
                console.log(e)
                callback(false,"data format error: "+e);
            }
        }
    });
}

function editTransactionNoIncludeCompany(id,houseId,userId,actualPrice,serviceCharge,transactionDate,startRentDate,endRentDate,callback) {
    const transaction = {}
    if (utilsValue.isValid(id)){
        transaction.id = id
    }
    if (utilsValue.isValid(houseId)){
        transaction.houseId = houseId
    }
    if (utilsValue.isValid(userId)){
        transaction.userId = userId
    }
    if (utilsValue.isValid(actualPrice)){
        transaction.actualPrice = actualPrice
    }
    if (utilsValue.isValid(serviceCharge)){
        transaction.serviceCharge = serviceCharge
    }
    if (utilsValue.isValid(transactionDate)){
        transaction.transactionDate = transactionDate
    }
    if (utilsValue.isValid(startRentDate)){
        transaction.startRentDate = startRentDate
    }
    if (utilsValue.isValid(endRentDate)){
        transaction.endRentDate = endRentDate
    }
    
    const url = config['transaction-basic-server'].location+'/'+config['transaction-basic-server'].restApi.editTransaction
    const method = 'PUT';
    const headers = {};

    httpRequest.sendJsonRequest(url, headers, transaction, method, (error, body) => {
        if (error) {
            console.log('===editTransactionNoIncludeCompany==error=')
            console.log(error)
            console.log('===editTransactionNoIncludeCompany==body=')
            console.log(body)
            callback(false,body);
        } else {
            if(body.data.nModified > 0){
                const result = body.data.updateData
                callback(true,result);
            }else{
                callback(false,'no match id');
            }
        }
    });
}

function removeTransaction(ids,callback) {
    if (utilsValue.isValid(ids)){
        const url = config['transaction-basic-server'].location+'/'+config['transaction-basic-server'].restApi.removeTransaction;
        const method = 'DELETE';
        const headers = {};
        const json = {
            ids:ids
        }
        httpRequest.sendJsonRequest(url, headers, json, method, (error, body) => {
            if (error) {
              console.log('===removeTransaction==error=')
              console.log(error)
              console.log('===removeTransaction==body=')
              console.log(body)
              callback(false,body);
            } else {
              if(body.data.nModified > 0){
                callback(true,'remove '+body.data.nModified+' transaction');
              }else{
                callback(false,'no match id');
              }
            }
          });
    }else {
        callback(false, 'id invalid')
    }
}

exports.applyTransaction = applyTransaction
exports.getTransactionList = getTransactionList
exports.editTransactionNoIncludeCompany = editTransactionNoIncludeCompany
exports.removeTransaction = removeTransaction