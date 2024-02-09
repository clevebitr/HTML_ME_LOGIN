// 2024年2月9日 v0.1
// xlbt

//定义用户id
var id;
//登录状态
var login_state;
//用户状态检查
var admin = false;
var user = false;
//数据库数据
var data;
//列表更新数据使用的数组
var data_info = [];
var cell = [];
//定义初始变量用于格式检查
var H_email_bool = false;
var H_pwd_bool = false;
var new_user = false;
var flag = false;

//当页面加载完成后执行以下函数
window.addEventListener("load", (event) => {
    console.log("page is fully loaded");

    //隐藏元素
    document.getElementById('by').style.display="none";
    document.getElementById('user_str').style.display="none";
    document.getElementById('delet').style.display="none"

    let params = new URL(location.href).searchParams;
    id = params.get('id');
    login_state = params.get('login_state');
    // console.log(id) //id
    // console.log(login_state) //login_state

    //查询登录状态
    if (login_state == 'true') {
         //数据库获取用户信息
        axios({
            method: 'GET',
            url: 'http://localhost:3000/userinfo',
        }).then(response => {
            // //在控制台输出获取到的数据
            // console.log(response);
            // console.log(response.data);
            data = response.data;
            //调用检查函数
            username = findUserInfo(id ,response.data);
        })
    } else {
        document.getElementById('user_info_name').innerHTML = '您还未登录';
        document.getElementById('home_user_name').innerHTML = '请登录以继续';
    }  
    //根据登录状态隐藏退出登录选项
    if (login_state == 'false' || login_state == null) {
        let login_exit = document.getElementById('exit_login');
        login_exit.style.display = "none";
    }
    //用户检查函数
    function findUserInfo( id , userInfolist ){
        //初始化变量
        username = "";
        for (const key in userInfolist){
            if (Object.hasOwnProperty.call(userInfolist , key)) {
                const userInfo = userInfolist[key];
                if (userInfo.id == id) {
                    if(userInfo.id == 1){
                        admin = true;
                        user = true;
                        document.getElementById('user_info_name').innerHTML = userInfo.username;
                        document.getElementById('home_user_name').innerHTML = '管理员，选择一个项目，'+userInfo.username;
                        document.getElementById('td_l1').innerHTML = userInfo.id;
                        document.getElementById('td_l2').innerHTML = userInfo.username+ "(当前账户)";
                        document.getElementById('td_l3').innerHTML = userInfo.password;
                        return username;
                    }
                    document.getElementById('user_info_name').innerHTML = userInfo.username;
                    document.getElementById('home_user_name').innerHTML = '选择一个项目，'+userInfo.username;
                    document.getElementById('td_l1').innerHTML = userInfo.id;
                    document.getElementById('td_l2').innerHTML = userInfo.username+ "(当前账户)";
                    document.getElementById('td_l3').innerHTML = userInfo.password;
                    user = true;
                    break;
                }
            }
        }
        return username;
    }
});

//退出登录
function exit_login() {
    user = false;
    admin = false;
    window.location.href="index.html";
}

//关于
function by(){
    let by = document.getElementById('by');
    let home = document.getElementById('HOME');
    if (by.style.display="none") {
        by.style.display="flex"
        home.style.display="none"
        document.getElementById('user_str').style.display="none"
    } else {
        by.style.display="none"
        home.style.display="flex"
        document.getElementById('user_str').style.display="none"
    }
}

//HOME
function HOME_CLICK(){
    let by = document.getElementById('by');
    let home = document.getElementById('HOME');
    by.style.display="none"
    document.getElementById('user_str').style.display="none"
    home.style.display="flex"
}

//管理员身份确认函数
function admin_pass_info(id,password,userInfolist){
        //初始化变量
        admin_pass = false;
        for (const key in userInfolist){
            if (Object.hasOwnProperty.call(userInfolist , key)) {
                const userInfo = userInfolist[key];
                if (id==userInfo.id) {
                    if(password==userInfo.password){
                        admin_pass = true;
                        break;
                    }
                }
            }
        }
        return admin_pass;
}

//动态更新表格
function table_number(userInfolist){
    var i=0;
    for (const key in userInfolist){
        if (Object.hasOwnProperty.call(userInfolist , key)) {
            i++;
        }
    }
    return i;
}

var user_i=0;

//存入数据
function data_infolist(userInfolist){
    var select = document.getElementById('user_change_se')
    if (Object.hasOwnProperty.call(userInfolist , user_i)) {
        const userInfo = userInfolist[user_i];
        data_info[0]=userInfo.id;
        data_info[1]=userInfo.username;
        data_info[2]=userInfo.password
        cell[0].innerHTML = data_info[0];
        cell[1].innerHTML = data_info[1];
        cell[2].innerHTML = data_info[2];
        select.options.add(new Option(userInfo.id));
    }
}

var row = [];

// user
function user_str(){
    let by = document.getElementById('by');
    if (admin == true && user == true) {
    let user_str = document.getElementById('user_str');
    let home = document.getElementById('HOME');
    if(user_str.style.display=="none"){

        user_str.style.display="flex"
        home.style.display="none"
        by.style.display="none"

        row_rge = table_number(data);

        //添加内容
        var table = document.getElementById("user_table");
        if (user_i!=row_rge) {
            for (let i = 0; i <= row_rge -1; i++) {
                row[i] = table.insertRow(i+2); // 插入新的行 
                cell[0] = row[i].insertCell(0); // 在新行中插入新的单元格  
                cell[1] = row[i].insertCell(1); // 在新行中插入新的单元格  
                cell[2] = row[i].insertCell(2); // 在新行中插入新的单元格
                data_infolist(data);
                user_i++;
            }
        }
    }else{
        user_str.style.display="none"
        by.style.display="none"
        home.style.display="flex"
    }
    }else{
        alert("您没有权限")
        return false;
    }
}

//修改框中显示用户参数
function id_info(id,data){
    for (const key in data){
        if (Object.hasOwnProperty.call(data, key)) {
            const userInfo = data[key];
            if (userInfo.id == id) {
                document.getElementById('user_change_username').value = userInfo.username;
                document.getElementById('user_change_password').value = userInfo.password;
                break;
            }
        }
    }
}

//下拉框选择数据触发的事件
function change(){
    var id_user_change_se = document.getElementById('user_change_se').value;
    document.getElementById('user_change_username').value = ""
    document.getElementById('user_change_password').value  = ""
    id_info(id_user_change_se,data);
    //删除按钮显示
    if (id_user_change_se=="none" || id_user_change_se=="newuser") {
        document.getElementById('delet').style.display="none"
    } else {
        document.getElementById('delet').style.display="block"
    }
    
}


//修改用户数据
function submit(){
    //重置变量内容
    new_user = false;
    var id_change = document.getElementById('user_change_se').value;
    var user = document.getElementById('user_change_username').value
    var pass = document.getElementById('user_change_password').value
    if (id_change!="none") {
        //邮箱密码格式判断
        if (user!=""&&pass!="") {
            H_email(user)
            H_pwd(pass)
        }else{
            alert("用户名或密码不能为空")
            return false;
        }
    }

    //判断是否创建新用户
    if (id_change == "newuser"){
        new_user = true;
    }

    if (new_user == true ) {
        //判断用户是否重复
        flag = flaguser(user,data);
        if ( flag )
        {
            alert("用户已存在");
        }
        else
        {
            newuser( user, pass );
        }
    }

    //当明确不创建新用户时
    if (H_email_bool == true && H_pwd_bool == true && new_user == false && id_change != "none") {
        my_register(user,pass,id_change)//调用修改函数
    }

}

//邮箱格式检查
function H_email(email){
    var email_reg = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;
    if (!email_reg.test(email)) {
        H_email_bool = false;
        alert("邮箱格式不正确")
    } else {
        H_email_bool = true;
    }
}


//密码格式检查
function H_pwd(password){
    var password_reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/;
    if (!password_reg.test(password)) {
        H_pwd_bool = false;
        alert("密码格式不正确")
    } else {
        H_pwd_bool = true;
    }
}


//提交修改函数
function my_register(user,pwd,id){

    axios(
        {
            method: 'patch',
            url: 'http://localhost:3000/userinfo'+"/"+id,
            data:{
                username: user,
                password: pwd
            }
        }
    ).then( response => {
        // console.log(response);
        alert("提交成功");
        console.log(id+"提交成功,"+response);
    }).catch(error => {
        if (error.response) {
          // error.response包含了服务器响应的详细信息
          const statusCode = error.response.status;
          const errorMessage = error.response.data.message;
    
          // 根据不同的错误代码，显示不同的错误消息
          switch (statusCode) {
            case 400:
              alert(`输入错误: ${errorMessage}`);
              break;
            case 404:
              alert(`不存在: ${errorMessage}`);
              break;
            case 500:
              alert(`服务器错误，请稍后重试。`);
              break;
            default:
              alert(`未知错误: ${errorMessage}`);
          }
        } else {
          // 其他错误（例如网络问题）
          alert('网络错误，请检查你的连接。');
        }
      });
}

//创建新用户函数
function newuser(usr,pwd){
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
        alert("提交成功");
        console.log("提交成功" + response);
    })
}

//重复用户检查
function flaguser( username,userInfolist ){
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

function delete_user(userId){
    axios.delete('http://localhost:3000/userinfo/' + userId)
      .then(response => {
        console.log('User deleted successfully:', response.data);
        alert("删除成功")
      })
      .catch(error => {
        console.error('Error deleting user:', error);
      });
}

function delet(){
    var sign;
    var admin_pass;
    var pass;
    var id_change = document.getElementById('user_change_se').value;
    pass = window.prompt("请输入管理员密码")
    admin_pass = admin_pass_info(id,pass,data)
    if(admin_pass == true){
        if (id_change!="none" && id_change!="") {
            sign = window.prompt("请输入'yes'以确认删除用户", "no"); // 打开显示提示文本为"请输入‘yes’以确认删除用户"并且输入框默认值为"no"的提示窗口
            if (sign == 'yes'){
                delete_user(id_change)
            }else{
                alert('您取消了删除操作')
            }
        }
    }else{
        alert("管理员密码错误");
    }

}