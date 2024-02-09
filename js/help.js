// 2024年2月3日 v0.1
// xlbt

//定义初始变量用于格式检查
var H_email_bool = false;
var H_state_bool = false;
var H_pwd_bool = false;
var H1_pwd_bool = false;

//邮箱格式检查
function H_email(){
    var email = document.getElementById('user').value;
    var email_reg = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;
    if (!email_reg.test(email)) {
        H_email_bool = false;
        document.getElementById('E_tips').innerHTML="邮箱格式不正确";
    } else {
        H_email_bool = true;
        document.getElementById('E_tips').innerHTML="";
    }
}

//状态码格式检查
function H_state(){
    var state = document.getElementById('state').value;
    var state_reg = /\d{4}(\-|\/|.)\d{1,2}\1\d{1,2}/;
    if (!state_reg.test(state)) {
        H_state_bool = false;
        document.getElementById('S_tips').innerHTML="状态码格式不正确";
    } else {
        H_state_bool = true;
        document.getElementById('S_tips').innerHTML="";
    }
}

//密码格式检查
function H_pwd(){
    var password = document.getElementById('pasw').value;
    var password_reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/;
    if (!password_reg.test(password)) {
        H_pwd_bool = false;
        document.getElementById('P_tips').innerHTML="密码格式不正确";
    } else {
        H_pwd_bool = true;
        document.getElementById('P_tips').innerHTML="";
    }
}

//密码1格式检查
function H1_pwd(){
    var password = document.getElementById('pasw1').value;
    var password_reg = document.getElementById('pasw').value;
    if (password == password_reg) {
        H1_pwd_bool = true;
        document.getElementById('P1_tips').innerHTML = "";
    } else {
        H1_pwd_bool = false;
        document.getElementById('P1_tips').innerHTML = "两次输入的密码不一致";
    }
}

//获取当前系统日期比较
function data_n(year_reg,month_reg,date_1_reg){
    //初始化变量
    data_bool = false;
    //获取系统当前日期
    var data = new Date();
    var year = data.getFullYear();
    var month = data.getMonth()+11;
    var date_1 = data.getDate()+10;

    //与传过来的形参比较
    if (year_reg == year && month_reg == month && date_1_reg == date_1){
        data_bool = true;
        document.getElementById("S_tips").innerHTML = "";
    }else{
        document.getElementById("S_tips").innerHTML = "状态码错误";
        data_bool = false;
    }
    return data_bool;                        
}

//修改
function my_register(pwd,id){
    axios(
        {
            method: 'patch',
            url: 'http://localhost:3000/userinfo'+"/"+id,
            data:{
                password: pwd
            }
        }
    ).then( response => {
        // console.log(response);
        console.log(id);
    })
}

//检查是否重复
function findUserInfo( username,userInfolist ){
    id = "";
    for (const key in userInfolist){
        if (Object.hasOwnProperty.call(userInfolist , key)) {
            const userInfo = userInfolist[key];
            if (userInfo.username == username) {
                id = userInfolist[key].id
                break;
            }
        }
    }
    return id;
}

//按钮事件
function help(){
    if(H_email_bool == true && H_pwd_bool == true && H_state_bool == true && H1_pwd_bool == true){
        //获取输入的状态码
        var str_reg = document.getElementById('state').value;
        //截取年份
        var year_reg = str_reg.substr(0,4);
        //截取月份
        var month_reg = str_reg.substr(5,2);
        //月份类型转换加10
        var month_reg1 = +month_reg + 10;
        //截取日期
        var date_1_reg = str_reg.substr(8,2);
        //日期类型转换加10
        var date_1_reg1 = +date_1_reg + 10;
        //调用函数与系统日期比较
        data_bool = data_n(year_reg,month_reg1,date_1_reg1);
        //控制台输出
        console.log(data_bool);
        if (data_bool) {
            const usrs = document.getElementById("user").value;
            const pwds = document.getElementById("pasw").value;
            axios({
                method: 'GET',
                url: 'http://localhost:3000/userinfo',
            }).then(response => {
                console.log(response);
                console.log(response.data);
                data = response.data;

                id = findUserInfo(usrs,response.data );

                if(id != "" && id != "undefined"){
                    my_register(pwds,id);
                    console.log(id);
                    document.getElementById('P1_tips').innerHTML="密码更新成功";
                }else{
                    console.log(id);
                    document.getElementById('P1_tips').innerHTML="该用户不存在";
                    return false;
                }
            })
        }
    }
}

function LOGININ(){
    window.location.href="index.html";
    // window.document.f.submit();
}