//2024年2月3日 v0.1
//xlbt

//定义初始检查变量
R_email_bool = false;
R_pwd_bool = false;
R1_pwd_bool = false;

//邮箱格式检查
function R_email(){
    var email = document.getElementById("R_user").value;
    var email_reg = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;
    if (!email_reg.test(email)) {
        document.getElementById("E_tips").innerHTML="邮箱格式不正确";
        R_email_bool = false;
        return false;
    } else {
        document.getElementById("E_tips").innerHTML="";
        R_email_bool = true;
    }
}

//密码格式检查
function R_pwd(){
    var pwd = document.getElementById("R_pasw").value;
    var pwd_reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/;
    if (!pwd_reg.test(pwd)) {
        document.getElementById("P_tips").innerHTML = "密码长度要大于6位,由数字和字母组成";
        R_pwd_bool = false;
        return false;
    } else {
        document.getElementById("P_tips").innerHTML = "";
        R_pwd_bool = true;
    }
}

//密码一致性格式检查
function R1_pwd(){
    var pwd1 = document.getElementById("R1_pasw").value;
    var pwd1_reg = document.getElementById("R_pasw").value;
    if (pwd1_reg == pwd1) {
        document.getElementById("P1_tips").innerHTML = "";
        R1_pwd_bool = true;
    } else {
        document.getElementById("P1_tips").innerHTML = "两次输入的密码不一致";
        R1_pwd_bool = false;
        return false;
    }
}

//检查用户名是否重复
function findUserInfo( username,password,userInfolist ){
    flag = false;
    for (const key in userInfolist){
        if (Object.hasOwnProperty.call(userInfolist , key)) {
            const userInfo = userInfolist[key];
            if (userInfo.username == username) {
                flag = true;
                break;
            }
        }
    }
    return flag;
}

//向数据库发送用户名和密码
function my_register( usr, pwd ){
    //控制台输出提交的用户名与密码
    // console.log('usr=',usr);
    // console.log('pwd=',pwd);

    //调用axios库进行提交
    axios(
        {
            method: 'POST',
            url: 'http://localhost:3000/userinfo',
            data:{
                username: usr,
                password: pwd
            }
        }
    ).then( response => {
        console.log(response);
    })
}

//注册按钮点击
function register(){
    //检查格式
    if (R_email_bool == true && R_pwd_bool == true && R1_pwd_bool == true) {
        axios({
            method: 'GET',
            url: 'http://localhost:3000/userinfo',
        }).then(response => {
            console.log(response);
            console.log(response.data);
            data = response.data;
            //检查数据，若没重复就添加到数据库中
            const usrs = document.getElementById("R_user").value;
            const pwds = document.getElementById("R_pasw").value;
            flag = findUserInfo(usrs,pwds,response.data );
            if ( flag )
            {
                document.getElementById("E_tips").innerHTML="用户已存在";
            }
            else
            {
                my_register( usrs, pwds );
                document.getElementById("P_tips").innerHTML="注册成功";
            }
        })
    } else {
        return false;
    }
}
