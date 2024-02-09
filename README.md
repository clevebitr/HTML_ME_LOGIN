# HTML_ME_LOGIN
html网页，简单登录注册管理

1.使用jsonserver数据库，axios库

2.使用了第三方封装的api

3.所有图标资源非原创

版本：v0.1

一.配置jsonserver

项目地址：https://github.com/typicode/json-server

 $ npm install -g json-server

创建db.json文件

在你的项目目录新建一个db.json文件夹,填入测试信息（json）（本demo自带2条）

运行jsonserver:

进入项目目录，打开终端输入 json-server --watch db.json

二.引入axios

Axios 是什么?

Axios 是一个基于 promise 网络请求库，作用于node.js 和浏览器中。 它是 isomorphic 的(即同一套代码可以运行在浏览器和node.js中)。在服务端它使用原生 node.js http 模块, 而在客户端 (浏览端) 则使用 XMLHttpRequests。（引用自官网）

官方文档：
https://www.axios-http.cn/docs/intro

引入

在本demo所有的html文件前添加以下链接（二选一），默认情况下，本demo默认自带。

使用 jsDelivr CDN:

<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>

使用 unpkg CDN:

<script src="https://unpkg.com/axios/dist/axios.min.js"></script>


2024年2月9日
