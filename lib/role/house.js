const config = require('../setting/config').config;
const httpRequest = require('../utils/httpRequest');
const employees = require('./employees');
const utilsValue = require('../utils/value');

function transferExEmployeeCompanyHouse(userId,companyId,newOwnerId,callback) {
    const employee = {
        'searchDoc': {
          'owner': userId,
          'belongType': 2,
          'belongId': companyId
        },
        'updateData': {
          'owner': newOwnerId
        }
      }
    const url = config['house-basic-server'].location+'/'+config['house-basic-server'].restApi.editHousesNoCheckUniqueAddress;
    const method = 'PUT';
    const headers = {};
    httpRequest.sendJsonRequest(url, headers, employee, method, (error, body) => {
        if (error) {
            console.log('===transferExEmployeeCompanyHouse==error=')
            console.log(error)
            console.log('===transferExEmployeeCompanyHouse==body=')
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

function getHousesByBody(isDelete,skip,limit,minPrice,maxPrice,minPing,maxPing,floor,floor2,minRoom,maxRoom,minFloor,maxFloor,buildingType,city,area,parking,pet,manager,garbage,smoke,cook,textQuery,ownerArray,typeOfRental,belongType,belongId,sort,minCreateTime,maxCreateTime,callback){
    const house = {}
    if(utilsValue.isValid(isDelete)){
        house.isDelete = isDelete;
    }
    if(utilsValue.isValid(skip)){
        house.skip = skip;
    }else{
        house.skip = 0
    }
    if(utilsValue.isValid(limit)){
        house.limit = limit;
    }else{
        house.limit = 9999999;
    }
    if(utilsValue.isValid(minPrice)){
        house.minPrice = minPrice;
    }
    if(utilsValue.isValid(maxPrice)){
        house.maxPrice = maxPrice;
    }
    if(utilsValue.isValid(minPing)){
        house.minPing = minPing;
    }
    if(utilsValue.isValid(maxPing)){
        house.maxPing = maxPing;
    }
    if(utilsValue.isValid(floor)){
        house.floor = floor;
    }
    if(utilsValue.isValid(floor2)){
        house.floor2 = floor2;
    }
    if(utilsValue.isValid(minRoom)){
        house.minRoom = minRoom;
    }
    if(utilsValue.isValid(maxRoom)){
        house.maxRoom = maxRoom;
    }
    if(utilsValue.isValid(minFloor)){
        house.minFloor = minFloor;
    }
    if(utilsValue.isValid(maxFloor)){
        house.maxFloor = maxFloor;
    }
    if(utilsValue.isValid(city)){
        house.city = city;
    }
    if(utilsValue.isValid(area)){
        house.area = area;
    }
    if(utilsValue.isValid(buildingType)){
        house.buildingType = buildingType;
    }
    if(utilsValue.isValid(parking)){
        house.parking = parking;
    }
    if(utilsValue.isValid(pet)){
        house.pet = pet;
    }
    if(utilsValue.isValid(manager)){
        house.manager = manager;
    }
    if(utilsValue.isValid(garbage)){
        house.garbage = garbage;
    }
    if(utilsValue.isValid(smoke)){
        house.smoke = smoke;
    }
    if(utilsValue.isValid(cook)){
        house.cook = cook;
    }
    if(utilsValue.isValid(textQuery)){
        house.textQuery = textQuery;
    }
    if(utilsValue.isValid(ownerArray)){
        house.ownerArray = ownerArray;
    }
    if(utilsValue.isValid(typeOfRental)){
        house.typeOfRental = typeOfRental;
    }
    if(utilsValue.isValid(belongType)){
        house.belongType = belongType;
    }
    if(utilsValue.isValid(belongId)){
        house.belongId = belongId;
    }
    if(utilsValue.isValid(minCreateTime)){
        house.minCreateTime = minCreateTime;
    }
    if(utilsValue.isValid(maxCreateTime)){
        house.maxCreateTime = maxCreateTime;
    }
    const url = config['house-basic-server'].location+'/'+config['house-basic-server'].restApi.getHousesByBody;
    const method = 'POST';
    const headers = {};
    httpRequest.sendJsonRequest(url, headers, house, method, (error, body) => {
        if (error) {
            console.log('===getHousesByBody==error=')
            console.log(error)
            console.log('===getHousesByBody==body=')
            console.log(body)
            callback(false,body);
        } else {
            if(body.status === true){
                callback(true,body.data)
            }else{
                callback(false,body.data)
            }
        }
    });

}
function getTeamUploadHouseCountsResult(teamHouseList,priceRange){
    const result = [];
    for(let i = 0 ;i<priceRange.length;i++){
        result.push(0)
    }
    for(let i = 0 ;i<teamHouseList.length;i++){
        for(let j = 0 ;j<priceRange.length; j++){
            if(teamHouseList[i].price>=priceRange[j].min && teamHouseList[i].price<priceRange[j].max){
                result[j]++
            }
        }
    }
    return result;
}

function getTeamUploadHouseCounts(managerId,companyId,priceRange,minCreateTime,maxCreateTime,callback) {
    employees.getTeamMembers(managerId,companyId,(result,data)=> {
        if(result === true){
            const ownerArray = []
            for(let i = 0 ;i < data.length;i++){
                ownerArray.push(data[i].userId)
            }
            getHousesByBody(false,0,9999999,'','','','','','','','','','','','','','','','','','','','',ownerArray,'','','','',minCreateTime,maxCreateTime,(result,data)=>{
                if(result === true){
                    callback(true,getTeamUploadHouseCountsResult(data,priceRange))
                }else{
                    callback(false,data)
                }
            })
        }else{
            callback(false,data)
        }
    }) 
}

function getTeamHouses(managerId,companyId,callback) {
    employees.getTeamMembers(managerId,companyId,(result,data)=> {
        if(result === true){
            const ownerArray = []
            for(let i = 0 ;i < data.length;i++){
                ownerArray.push(data[i].userId)
            }
            getHousesByBody(false,0,9999999,'','','','','','','','','','','','','','','','','','','','',ownerArray,'','','','','','',(result,data)=>{
                if(result === true){
                    callback(true,data)
                }else{
                    callback(false,data)
                }
            })
        }else{
            callback(false,data)
        }
    }) 
}


exports.transferExEmployeeCompanyHouse = transferExEmployeeCompanyHouse
exports.getTeamUploadHouseCounts = getTeamUploadHouseCounts
exports.getTeamHouses = getTeamHouses