const config = require('../setting/config').config;
const utilsValue = require('../utils/value');
const httpRequest = require('../utils/httpRequest');
const user = require('./user')

function editReserveHouseExe(reserveHouse,callback){
    const url = config['reserve-house-basic-server'].location+'/'+config['reserve-house-basic-server'].restApi.editReserveHouse;
    const method = 'PUT';
    const headers = {};

    httpRequest.sendJsonRequest(url, headers, reserveHouse, method, (error, body) => {
        if (error) {
            console.log('===editHouse==error=')
            console.log(error)
            console.log('===editHouse==body=')
            console.log(body)
            callback(false,body);
        } else {
            if(body.data.nModified > 0){
                callback(true,'edit success');
            }else{
                callback(false,'no match id');
            }
        }
    });
}

function editReserveHouse(id,client,host,houseId,state,type,clientName,clientPhone,callback) {
    const reserveHouse = {}
    if (utilsValue.isValid(id)){
        reserveHouse.id = id
    }

    if (utilsValue.isValid(host)){
        reserveHouse.host = host
    }

    if (utilsValue.isValid(houseId)){
        reserveHouse.houseId = houseId
    }

    if (utilsValue.isValid(state)){
        reserveHouse.state = state
    }

    if (utilsValue.isValid(type)){
        reserveHouse.type = type
    }

    if (utilsValue.isValid(clientName)){
        reserveHouse.clientName = clientName
    }

    if (utilsValue.isValid(clientPhone)){
        reserveHouse.clientPhone = clientPhone
    }

    if (utilsValue.isValid(client)){
        reserveHouse.client = client
        user.getUserById(client,false,(result,data)=>{
            if(result == true){
                reserveHouse.clientName = data.name
                reserveHouse.clientPhone = data.phone
                editReserveHouseExe(reserveHouse,callback)
            }else{
                callback(false,data)
            }
            
        })
    }else{
        editReserveHouseExe(reserveHouse,callback)
    }
}

function getReserveHouses(start,count,host,client,states,type,timeSort,callback) {

    let url = config['reserve-house-basic-server'].location+'/'+config['reserve-house-basic-server'].restApi.getReserveHouses+'?'
    if(utilsValue.isValid(start)){
        url = url + 'skip='+start
    }else{
        url = url + 'skip='+0
    }
    
    if(utilsValue.isValid(count)){
        url = url + '&&limit='+count
    }else{
        url = url + '&&limit='+300
    }
    
    if(utilsValue.isValid(host)){
        url = url + '&&host='+host
    }

    if(utilsValue.isValid(client)){
        url = url + '&&client='+client
    }

    if(utilsValue.isValid(states)){
        url = url + '&&states='+states
    }

    if(utilsValue.isValid(type) || type === 0){
        url = url + '&&type='+type
    }

    if(utilsValue.isValid(timeSort)){
        timeSort = timeSort*1;
        const sort = {
            updateTime:timeSort
        }
        url = url + '&&sort='+JSON.stringify(sort) 
    }else{
        const sort = {
            updateTime:1
        }
        url = url + '&&sort='+JSON.stringify(sort) 
    }

    const method = 'GET';
    const headers = {};
    httpRequest.sendGetRequest(url, headers, method, (error, body) => {
        if (error) {
            console.log('===getReserveHouses==error=')
            console.log(error)
            console.log('===getReserveHouses==body=')
            console.log(body)
            callback(false,body);
        } else {
            try{
                const res = JSON.parse(body)
                if(utilsValue.isValid(client)){
                    removeReserveHousesHostData(res.data)
                }
                callback(true,res.data);
            }catch(e){
                callback(false,"data format error: "+body);
            }
        }
    });
}

function transferReserveHouse(host,newHost,companyId,callback){
    const start = 0;
    const count = 9999999;
    const states = '0,1'
    getReserveHouses(start,count,host,'',states,'',1,(result,reserveHouses)=>{
        if(result == true){
            for(let i = 0 ;i<reserveHouses.length;i++){
                if(reserveHouses[i].houseData.length > 0){
                    if(reserveHouses[i].houseData[0].belongType === 2 && reserveHouses[i].houseData[0].belongId === companyId){
                        editReserveHouse(reserveHouses[i]._id,reserveHouses[i].client,newHost,reserveHouses[i].houseId,reserveHouses[i].state,reserveHouses[i].type,reserveHouses[i].clientName,reserveHouses[i].clientPhone,()=>{})
                    }
                }
            }
            callback(true,'edit reserve house ing')
        }else{
            callback(result,reserveHouses)
        }
    })
}

exports.transferReserveHouse = transferReserveHouse