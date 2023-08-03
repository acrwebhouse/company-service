const config = require('../setting/config').config;
const utilsValue = require('../utils/value');
const httpRequest = require('../utils/httpRequest');
const house = require('./house');
const smtp = require('./smtp');
const user = require('./user');
const company = require('./company');

function removeManageData(data){
    for(let i = 0 ;i< data.length; i++){
        for(let j = 0 ;j<data[i].managerData.length;j++){
            const item = {
                account : data[i].managerData[j].account,
                name : data[i].managerData[j].name,
                gender : data[i].managerData[j].gender,
                mail : data[i].managerData[j].mail,
                phone : data[i].managerData[j].phone,
                lineId : data[i].userData[j].lineId,
            }
            data[i].managerData[j] = item;
        }
    }
    return data
}

function removeEmployeesListUserData(data){
    for(let i = 0 ;i< data.length; i++){
        for(let j = 0 ;j<data[i].userData.length;j++){
            const item = {
                account : data[i].userData[j].account,
                name : data[i].userData[j].name,
                gender : data[i].userData[j].gender,
                mail : data[i].userData[j].mail,
                phone : data[i].userData[j].phone,
                lineId : data[i].userData[j].lineId,
            }
            data[i].userData[j] = item;
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

function getCurrentEmployeeByUserId(id,callback) {
    user.getPersonalInfo(id,(result,data)=>{
        if(result === true){
            const companyId = data.companyId
            getEmployeesByUserId(id,(result,data)=>{
                if(result === true){
                    let currentEmployee = {}
                    for(let i = 0 ;i<data.length;i++){
                        if(companyId === data[i].companyId){
                            currentEmployee = data[i]
                        }
                    }
                    callback(result,currentEmployee)
                }else{
                    callback(result,data)
                }
            })
        }else{
            callback(result,data)
        }    
    })

   
}

function getEmployeesListByCompanyId(companyId,states,skip,limit,callback) {
    let url = config['employees-basic-server'].location+'/'+config['employees-basic-server'].restApi.getEmployeesListByCompanyId ;
    let preStr = '?'
    if(utilsValue.isValid(companyId)){
        url = url + preStr + 'companyId=' + companyId
        preStr = '&&'
    }
    if(utilsValue.isValid(states)){
        url = url + preStr + 'states=' + states
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
                let data = removeManageData(res.data)
                data = removeEmployeesListUserData(data);
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
    company.getCompanyAdmin(companyId,(admin)=>{
        const rank = 100;
        let managerId = '' ;
        const state = 1;
        if(utilsValue.isValid(admin)){
            managerId = admin.userId
        }
        isEmployeeExist(companyId,userId,(result,data)=>{
            if(result == true){
                const id = data
                editEmployees(id,companyId,userId,rank,managerId,state,'','',callback)
            }else if(data == 'employee is not exist'){
                addEmployees(companyId,userId,rank,managerId,state,false,callback)
            }else{
                callback(result,data)
            }
        })
    })
}

function editManyEmployees(editEmployees,companyId,userId,rank,managerId,state,isResign,callback) {
    const employee = {
        editEmployees
    }
    if(utilsValue.isValid(companyId)){
        employee.companyId = companyId
    }
    if(utilsValue.isValid(userId)){
        employee.userId = userId
    }
    if(utilsValue.isValid(managerId)){
        employee.managerId = managerId
    }
    if(utilsValue.isValid(rank) || rank === 0){
        employee.rank = rank
    }
    if(utilsValue.isValid(state) || state === 0){
        employee.state = state
    }
    if(utilsValue.isValid(isResign) || isResign === false){
        employee.isResign = isResign
    }
    const url = config['employees-basic-server'].location+'/'+config['employees-basic-server'].restApi.editManyEmployees;
    const method = 'PUT';
    const headers = {};
    httpRequest.sendJsonRequest(url, headers, employee, method, (error, body) => {
        if (error) {
            console.log('===editManyEmployees==error=')
            console.log(error)
            console.log('===editManyEmployees==body=')
            console.log(body)
            callback(false,body);
        } else {
            if(body.data.ok > 0 ){
                callback(true,'editManyEmployees success');
            }else{
                callback(false,'');
            }
        }
    });
}

function editEmployees(id,companyId,userId,rank,managerId,state,newOwnerId,isResign,callback) {
    const employee = {
        id,
        companyId,
        userId,
        rank,
        managerId,
        state
    }

    if(utilsValue.isValid(isResign) || isResign === false){
        employee.isResign = isResign
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
            if(body.data.ok > 0 && (state == 4 || isResign == true && newOwnerId !== '')){
                if(isResign === true){
                    smtp.sendResignNotifyMail(userId,companyId,()=>{})
                }
                const changeEmployees = {
                    companyId,
                    isResign : false,
                    managerId : userId
                }
                editManyEmployees(changeEmployees,'','','',newOwnerId,'','',(result,data)=>{
                    if(result === true){
                        house.transferExEmployeeCompanyHouse(userId,companyId,newOwnerId,callback)
                    }else{
                        editEmployees(id,companyId,userId,rank,managerId,state,newOwnerId,false,callback)
                    }

                })
            }
            else if (body.data.ok > 0){
                callback(true,body.data);
            }else{
                callback(false,body.data);
            }
        }
    });
}

function addEmployees(companyId,userId,rank,managerId,state,isResign,callback) {
    const employee = {
        companyId,
        userId,
        rank,
        managerId,
        state,
        isResign,
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
function cancelApplyEmployees(id,userId,callback) {
    getEmployeesByUserId(userId,(result,data)=>{
        if(result == true){
            let employeeData = {}
            let isExist = false;
            for(let i = 0 ;i<data.length; i++){
                if(id == data[i]._id && userId == data[i].userId){
                    isExist = true
                    employeeData = data[i]
                    i = data.length
                }
            }
            if(isExist == true){
                editEmployees(employeeData._id,employeeData.companyId,userId,employeeData.rank,employeeData.managerId,5,'','',callback)
                
            }else{
                callback(isExist,'employee is not exist')
            }
        }else{
            callback(result,data)
        }
    })
}

function getEmployeesListUserData(employeesList){
    const result = []
    for(let i = 0 ;i<employeesList.length;i++){
        const data = {
            id : employeesList[i]._id,
            userId : employeesList[i].userId,
            rank : employeesList[i].rank,
            state : employeesList[i].state,
            isResign : employeesList[i].isResign,
            userId : employeesList[i].userId,
            managerId : employeesList[i].managerId
        }
        if(employeesList[i].userData.length > 0){
            data.account = employeesList[i].userData[0].account
            data.name = employeesList[i].userData[0].name
            data.gender = employeesList[i].userData[0].gender
            data.mail = employeesList[i].userData[0].mail
            data.phone = employeesList[i].userData[0].phone
            data.lineId = employeesList[i].userData[0].lineId
        }
        result.push(data)
    }
    return result;
}

function getTeamMembersListByUserDataList(managerId,userDataList){
    const currentEmployees = []
    const result = [];
    let compareManagerIds = [managerId]
    let nextCompareManagerIds = []

    // remove isResign user
    for(let i = 0 ;i<userDataList.length;i++){
        if(userDataList[i].isResign === false){
            currentEmployees.push(userDataList[i])
        }
    }

    for(let i = 0 ;i<currentEmployees.length;i++){
        if(managerId === currentEmployees[i].userId){
            result.push(currentEmployees[i])
            i = currentEmployees.length
        }
    }
    for(let i = 0 ;i<compareManagerIds.length; i++){
        if(i === 0){
            nextCompareManagerIds = []
        }
        for(let j = 0;j<currentEmployees.length;j++){
            if(compareManagerIds[i] === currentEmployees[j].managerId){
                nextCompareManagerIds.push(currentEmployees[j].userId)
                result.push(currentEmployees[j])
            }
        }
        if(i === (compareManagerIds.length-1)){
            compareManagerIds = nextCompareManagerIds
            i = -1;
        }
    }
    return result
}

function getTeamMembers(managerId,companyId,callback) {
    const states = '2,4'
    const skip = 0;
    const limit = 999999;
    getEmployeesListByCompanyId(companyId,states,skip,limit,(result,data)=> {
        if(result === true){
            let employeesListUserData = getEmployeesListUserData(data)
            const teamMemberList = getTeamMembersListByUserDataList(managerId,employeesListUserData)
            callback(result,teamMemberList)
        }else{
            callback(false,data)
        }
    }) 


}

function setTeamMembersManagerToAdminSmallerRank(userId,companyId,rank,callback){
    company.getCompanyAdmin(companyId,(admin)=>{
        const adminId = admin.userId
        getTeamMembers(userId,companyId,(result,data)=>{
            if(result === true){
                const setIds = []
                for(let i = 0 ;i<data.length; i++){
                    if(data[i].rank < rank && data[i].managerId === userId){
                        setIds.push(data[i].id)
                    }
                }
                if(setIds.length > 0){
                    const editEmployees = {
                        ids : setIds
                    }
                    const managerId = adminId
                    editManyEmployees(editEmployees,companyId,'','',managerId,'','',callback)
                }else{
                    callback(result,data)
                }
            }else{
                callback(result,data)
            }
        })
    })
}

exports.getEmployeesByUserId = getEmployeesByUserId
exports.getCurrentEmployeeByUserId = getCurrentEmployeeByUserId
exports.getEmployeesListByCompanyId = getEmployeesListByCompanyId
exports.applyEmployees = applyEmployees
exports.editEmployees = editEmployees
exports.cancelApplyEmployees = cancelApplyEmployees
exports.getTeamMembers = getTeamMembers
exports.setTeamMembersManagerToAdminSmallerRank = setTeamMembersManagerToAdminSmallerRank
