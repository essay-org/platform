<p align="center" dir="auto">
    <img src="/public/logo.png" width="70px">
</p>
<p align="center">
    <a href="https://github.com/essay-org/platform"><img src="https://img.shields.io/badge/database-sqlite3-blue" alt="database"></a>
    <a href="https://github.com//essay-org/platform"><img src="https://img.shields.io/badge/node-%3E%3D16.0.0-orange.svg" alt="Version"></a>
    <a href="https://github.com//essay-org/platform"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License"></a>
</p>
<!-- 
<p align="center"><a href="https://ppx.link" target="_blank">演示网站</a></p> -->

> 通用管理后台系统

plaform是一个基于RBAC模型开发的后台管理系统，没有多余的功能。

# 技术栈

- 前端 Vue3 + Element-Plus
- 服务端 Egg + SQLite

# 启动

```bash
git clone https://github.com/essay-org/platform.git

# 启动前端服务
cd fe
yarn install
npm run dev # 访问 http://127.0.0.1:8088

# 启动后端服务 
cd serve
yarn install
npm run dev # 访问 http://127.0.0.1:7077

```

# 登录

默认用户名：admin
默认密码：123456

说明：系统已经内置SQLite初始数据，在`server/database/data.db`中

# 功能展示
### 用户管理


<p align="center" dir="auto">
    <img src="/public/1.png" width="600px">
</p>

# 菜单管理


<p align="center" dir="auto">
    <img src="/public/2.png" width="600px">
</p>

### 角色管理


<p align="center" dir="auto">
    <img src="/public/4.png" width="600px">
</p>

### 部门管理


<p align="center" dir="auto">
    <img src="/public/3.png" width="400px">
</p>

# 其他说明

本项目是一个以学习为目的的后台项目，旨在让前端也能充分了解RBAC模型是如何设计的，不建议用于线上，因为未经过充分的测试。

如果在学习过程遇到任何问题，可以在issue中提出，我尽可能回复。