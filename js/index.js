//2024年2月3日 v0.1
//xlbt

var E = false;
var P = false;

//email格式检查
function L_email(){
    var user=document.getElementById("user").value;  //读取表单数据，创建变量
    var reg = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;
    if(!reg.test(user)){
        document.getElementById("E_tips").innerHTML="邮箱格式不正确";
        E=false;
        return false;  
    }else{
        document.getElementById("E_tips").innerHTML="";
        E=true;
    }
}

//pwd格式检查
function L_pwd(){
    var L_pwd=document.getElementById("pasw").value;
    var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/;
    if(!reg.test(L_pwd)){
        document.getElementById("P_tips").innerHTML="密码长度要大于6位,由数字和字母组成"
        P=false;
        return false;  
    }else{
        document.getElementById("P_tips").innerHTML="";
        P=true;
    }
 }

//账号密码检查函数
function findUserInfo( username , password , userInfolist ){
    //初始化变量
    id = "";
    for (const key in userInfolist){
        if (Object.hasOwnProperty.call(userInfolist , key)) {
            const userInfo = userInfolist[key];
            if (userInfo.username == username) {
                if(userInfo.password == password){
                    id = userInfo.id
                    break;
                }
            }
        }
    }
    return id;
}

//按钮点击事件
function login() {
    //读取表单数据，创建变量
    var name=document.getElementById("user").value;
    var pass=document.getElementById("pasw").value;

    //格式检查
    if(E==true && P==true){
        //axios方法获取已注册的用户数据
        var login_state = false;
        axios({
            method: 'GET',
            url: 'http://localhost:3000/userinfo',
        }).then(response => {

            //在控制台输出获取到的数据
            // console.log(response);
            // console.log(response.data);
            data = response.data;

            //调用检查账号密码函数
            var id = "";
            id = findUserInfo(name,pass,response.data);

            //登录结果检查
            if (id != "" && id != "undefined") {
                //在控制台输出登录成功的数据
                console.log("email:"+name);
                console.log("pwd:"+pass);
                login_state = true;
                window.location.href = './home.html?'+'id='+ id +'&login_state=' + login_state;
                
                // 暂不跳转
                // window.location.href="home.html";
                // window.document.f.submit();
            } else {
                document.getElementById("P_tips").innerHTML = "账号或密码错误";
                //清除密码框的数据
                document.getElementById("pasw").value = "";
                return false;
            }
        }).catch(error=>{
            console.log(error);
            document.getElementById('P_tips').innerHTML = "请求服务器失败"
        })
    }else{
        return false;
    }
}