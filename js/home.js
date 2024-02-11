// 2024年2月9日 v0.1
// xlbt

//-----------------------------------------定义公用变量------------------------------------------
//定义用户id
var id;
//登录状态
var login_state;
//用户状态检查
var admin = false;
var user = false;
//如果登录状态为真，数据库数据将存放在data
var data;
//列表更新数据使用的数组
var data_info = [];
var cell = [];
//定义初始变量用于格式检查
var H_email_bool = false;
var H_pwd_bool = false;
var new_user = false;
var flag = false;

//定义数组row用来存放更新的列表行
var row = [];

//user_i中间变量，用于更新用户管理界面的用户数据表
var user_i=0;

//----------------------------------------------------------------------------------------------
//当页面加载完成后执行以下函数
window.addEventListener("load", (event) => {
    //控制台显示页面加载完成
    console.log("page is fully loaded");

    //初始页面隐藏其他元素
    document.getElementById('by').style.display="none";
    document.getElementById('user_str').style.display="none";
    document.getElementById('delet').style.display="none";
    document.getElementById('settings').style.display="none";

    //获取地址栏上的当前登录id和登录状态
    let params = new URL(location.href).searchParams;

    id = params.get('id');//当前id
    login_state = params.get('login_state');//当前登录状态
        
    //根据登录状态隐藏退出登录选项
    if (login_state == 'false' || login_state == null) {
        let login_exit = document.getElementById('exit_login');
        login_exit.style.display = "none";
    }


//查询登录状态
//---------------------------------------------------------------------------------------------

    //当登录状态为真时，向数据库请求登录数据，为假时，给出未登录提示
    if (login_state == 'true') {
         //数据库获取用户信息
        axios({
            method: 'GET',
            url: 'http://localhost:3000/userinfo',
        }).then(response => {
            // //在控制台输出获取到的数据
            // console.log(response);
            // console.log(response.data);

            //将获取到的数据赋值给公用变量data
            data = response.data;
            //调用检查函数
            findUserInfo(id ,data);
        })
    } else {
        document.getElementById('user_info_name').innerHTML = '您还未登录';
        document.getElementById('home_user_name').innerHTML = '请登录以继续';
    }


    //用户检查函数
    function findUserInfo( id , userInfolist ){

        //初始化用户名变量
        username = "";

        //遍历数据库中每一个用户的数据
        for (const key in userInfolist){
            if (Object.hasOwnProperty.call(userInfolist , key)) {
                //临时变量userInfo
                const userInfo = userInfolist[key];

                //如果遍历到了当前登录的id
                if (userInfo.id == id) {
                    //先检查是否为管理员，id为1的是管理员
                    if(userInfo.id == 1){
                        //管理员状态权限为真
                        admin = true;
                        //正常用户权限为真
                        user = true;

                        //修改顶栏显示的用户信息
                        document.getElementById('user_info_name').innerHTML = userInfo.username;
                        document.getElementById('home_user_name').innerHTML = '管理员，选择一个项目，'+userInfo.username;
                        
                        //用户选项显示的账号信息
                        document.getElementById('username').innerHTML = userInfo.username;

                        //用户管理显示当前管理员账号信息，隐藏密码
                        document.getElementById('td_l1').innerHTML = userInfo.id
                        document.getElementById('td_l2').innerHTML = userInfo.username+ "(当前账户)";
                        document.getElementById('td_l3').innerHTML = "未知";

                        //退出函数
                        return false;
                    }

                    //如果不是管理员
                    //修改顶栏数据
                    document.getElementById('user_info_name').innerHTML = userInfo.username;
                    document.getElementById('home_user_name').innerHTML = '选择一个项目，'+userInfo.username;

                    //用户选项显示的账号信息
                    document.getElementById('username').innerHTML = userInfo.username;

                    //正常用户权限为真
                    user = true;
                    //退出遍历
                    break;
                }
            }
        }
        //退出函数
        return false;
    }
});

//按下退出登录按钮
function exit_login() {
    //撤销用户权限
    user = false;
    admin = false;

    //跳转登录页面
    window.location.href="index.html";
}

//按下关于
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
    //当按下HOME键时，隐藏所有其他元素
    let by = document.getElementById('by');
    let home = document.getElementById('HOME');
    by.style.display="none"
    document.getElementById('user_str').style.display="none"
    document.getElementById('settings').style.display="none"
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
                        //当传入的密码与管理员密码一致时，管理员确认变量为真
                        admin_pass = true;
                        break;
                    }
                }
            }
        }
        //返回确认值
        return admin_pass;
}

//确认当前数据库的所有用户数量
//用户管理使用
function table_number(userInfolist){
    var i=0;
    //遍历所有用户
    for (const key in userInfolist){
        if (Object.hasOwnProperty.call(userInfolist , key)) {
            i++;//用户数量加1
        }
    }
    return i;
}


//用户管理界面更新用户数据表
//用户管理使用
function data_infolist(userInfolist){
    var select = document.getElementById('user_change_se')
    const userInfo = userInfolist[user_i];
    if (userInfo.id == '1') {//不显示管理员密码
        cell[0].innerHTML = userInfo.id;
        cell[1].innerHTML = userInfo.username;
        cell[2].innerHTML = "未知";
        return false;
    }
    cell[0].innerHTML = userInfo.id;
    cell[1].innerHTML = userInfo.username;
    cell[2].innerHTML = userInfo.password
    select.options.add(new Option(userInfo.id));
}

// 按下用户管理按钮时
function user_str(){
    //定义其他元素的变量，方便后面使用
    let by = document.getElementById('by');
    let user_str = document.getElementById('user_str');
    let home = document.getElementById('HOME');
    let setting = document.getElementById('settings')
    var table = document.getElementById("user_table");
    //判断是否为管理员账户
    if (admin == true && user == true) {
        //判断用户管理界面的显示
        if(user_str.style.display=="none"){
            //显示用户管理，隐藏其他所有元素,并同时加载用户数据列表
            user_str.style.display="flex"
            home.style.display="none"
            by.style.display="none"
            setting.style.display="none"

            //调用获取数据库用户总数函数，存入row_rge变量
            row_rge = table_number(data);

            //添加内容
            //如果当前添加的用户总数不等于数据库所有的用户总数时
            if (user_i!=row_rge) {

                //添加新的行，列，并调用data_infolist函数添加用户数据
                for (let i = 0; i <= row_rge -1; i++) {
                    row[i] = table.insertRow(i+2); // 插入新的行 
                    cell[0] = row[i].insertCell(0); // 在新行中插入新的单元格  
                    cell[1] = row[i].insertCell(1); // 在新行中插入新的单元格  
                    cell[2] = row[i].insertCell(2); // 在新行中插入新的单元格
                    data_infolist(data);//调用函数添加
                    user_i++;//添加完一个用户数据就自增，直到所有数据都被添加进表格里
                }
            }
        }else{//关闭用户管理界面
            setting.style.display="none"
            user_str.style.display="none"
            by.style.display="none"
            home.style.display="flex"//显示主页
        }
    }else{//如果不是管理员账户，显示没有权限
        alert("您没有权限")
        return false;
    }
}

//用户管理界面的修改框中显示用户参数
//下拉列表框中使用
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
    //获取下拉列表框中的数据值
    var id_user_change_se = document.getElementById('user_change_se').value;

    //每次更改下拉列表框的选项都清空input中的值
    document.getElementById('user_change_username').value = ""
    document.getElementById('user_change_password').value  = ""

    //调用函数更新当前下拉列表框中选中的id值的数据
    id_info(id_user_change_se,data);

    //删除按钮是否显示
    if (id_user_change_se=="none" || id_user_change_se=="newuser") {//如果下拉列表框是默认状态或者添加数据状态
        document.getElementById('delet').style.display="none"//关闭删除按钮的显示
    } else {
        document.getElementById('delet').style.display="block"
    }
    
}


//修改用户数据按钮按下
function submit(){
    var id_change = document.getElementById('user_change_se').value;
    var user = document.getElementById('user_change_username').value
    var pass = document.getElementById('user_change_password').value
    var pass_ADMIN;
    var admin_pass;
    pass_ADMIN = window.prompt("请输入管理员密码")
    admin_pass = admin_pass_info(id,pass_ADMIN,data)
    if (admin_pass != true) {//输入管理密码创建新用户
            alert('管理员密码错误')
            return false;
    }
    if (id_change!="none") {//如果下拉列表不是默认状态
        //邮箱密码格式判断
        if (user!=""&&pass!="") {//如果账号密码输入框中不为空
            H_email(user)
            H_pwd(pass)
        }else{
            alert("用户名或密码不能为空")
            return false;
        }
    }

    //判断是否创建新用户
    if (id_change == "newuser"){//下拉列表中的值是创建新用户
        //判断用户是否重复
        flag = flaguser(user,data);
        if ( flag ){
            alert("用户已存在");
            return false;
        }else{
            if (H_email_bool == true && H_pwd_bool == true) {
                newuser( user, pass );//调用新用户函数添加用户
            }
            return false;//退出函数
        }
    }

    //当不创建新用户时
    if (H_email_bool == true && H_pwd_bool == true && id_change != "none") {
        my_register(user,pass,id_change)//调用修改函数
    }

}

//邮箱格式检查函数
//用户管理使用
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
//用户管理使用
function H_pwd(password){
    var password_reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/;
    if (!password_reg.test(password)) {
        H_pwd_bool = false;
        alert("密码格式不正确,密码长度要大于6位,由数字和字母组成")
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
    if (H_email_bool ==true && H_pwd_bool ==true) {
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

//删除用户函数
function delete_user(userId){
    axios.delete('http://localhost:3000/userinfo/' + userId)
      .then(response => {
        // console.log('User deleted successfully:', response.data);
        alert("删除成功")
      })
      .catch(error => {//控制台显示删除成功信息
        // console.error('Error deleting user:', error);    
      });
}

//删除用户按钮按下
function delet(){
    var sign;//用户确定
    var admin_pass; //管理员权限确定
    var pass;//用户输入的管理员密码
    var id_change = document.getElementById('user_change_se').value;
    //弹出窗口让用户输入管理员密码
    pass = window.prompt("请输入管理员密码")
    admin_pass = admin_pass_info(id,pass,data)//调用函数确认密码是否正确
    if(admin_pass == true){
        if (id_change!="none" && id_change!="" && id_change!="1") {//下拉框必须选中了一个id,且该id不能为管理员id
            sign = window.prompt("请输入'yes'以确认删除用户", "no"); // 打开显示提示文本为"请输入‘yes’以确认删除用户"并且输入框默认值为"no"的提示窗口
            if (sign == 'yes'){//用户确定后，调用删除函数删除下拉框选中的id的用户数据
                delete_user(id_change)
            }else{
                alert('您取消了删除操作')
                return false;
            }
        }else{
            alert("管理员账户不可删除")
            return false;
        }
    }else{
        alert("管理员密码错误");
        return false;
    }

}

//选项
function settings(){
    var setting = document.getElementById('settings')
    if (setting.style.display == "none") {
        setting.style.display = "flex";
        document.getElementById('by').style.display="none";
        document.getElementById('user_str').style.display="none";
        document.getElementById('delet').style.display="none";
        document.getElementById('HOME').style.display="none";
    } else {
        setting.style.display = "none"
        document.getElementById('by').style.display="none";
        document.getElementById('user_str').style.display="none";
        document.getElementById('delet').style.display="none";
        document.getElementById('HOME').style.display="flex";
    }
}