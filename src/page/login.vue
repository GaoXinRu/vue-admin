<template>
    <div class="login_page">
        <transition name="form-fade" mode="in-out">
            <section class="form_contianer" v-show="showLogin">
                <div class="manage_tip">
                    <span class="title">学习实训平台</span>
                </div>
                <el-form :model="loginForm" :rules="rules" ref="loginForm" class="loginForm">
                    <el-form-item prop="username">
                        <span class="fa-tips"><i class="fa fa-user"></i></span>
                        <el-input class="area" type="text" placeholder="用户名" v-model="loginForm.username"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <span class="fa-tips"><i class="fa fa-lock"></i></span>
                        <el-input class="area" type="password" placeholder="密码" v-model="loginForm.password"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('loginForm')" class="submit_btn">登陆</el-button>
                    </el-form-item>
                    <div class="tiparea">
                        <p class="wxtip">温馨提示：</p>
                        <p class="tip">未登录过的新用户，自动注册</p>
                        <p class="tip">注册过的用户可凭账号密码登录</p>
                    </div>
                </el-form>

            </section>
        </transition>
    </div>
</template>

<script>
    import axios from 'utils/axios'
    import * as mUtils from 'utils/mUtils'
    import {mapActions, mapState, mapGetters} from 'vuex'

    export default {
        data() {
            return {
                loginForm: {
                    username: '',
                    password: ''
                },
                rules: {
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'},
                        {min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ],
                },
                showLogin: false,
                ip: '',
            }
        },
        mounted() {
            this.showLogin = true;
            // this.getip();  // 在页面初始化时，就去获取公网ip
        },
        computed: {
            ...mapGetters(['menuitems', 'isLoadRoutes'])
        },
        methods: {
            ...mapActions(['addMenu', 'loadRoutes']),
            showMessage(type, message) {
                this.$message({
                    type: type,
                    message: message
                });
            },
            //保存用户信息到缓存
            saveUserInfo() {
                const userinfo = {
                    username: this.loginForm.username
                }
                mUtils.setStore('userinfo', userinfo)
            },
            //模拟动态生成菜单并定位到index
            generateMenuPushIndex() {
                const menuData = [
                    {
                        path: '/index', name: '首页', component: '00_index/index', icon: 'fa-home',noDropdown: true,
                        children: [{path: '/index', name: '首页', component: '00_index/index'}]
                    },
                    {
                        path: '/org', name: '组织管理', component: 'userList', icon: 'fa-server',
                        children: [
                            {path: '/org_college', name: '学院/专业管理', component: 'userList'},
                            {path: '/org_class', name: '班级管理', component: 'userList'},
                            {path: '/org_school', name: '学校信息', component: 'userList'},
                        ]
                    },
                    {
                        path: '/userList', name: '人员管理', component: 'userList', icon: 'fa-user',
                        children: [
                            {path: '/userList', name: '教师管理', component: 'userList'},
                            {path: '/userList', name: '学生管理', component: 'userList'},
                            {path: '/userList', name: '角色权限管理', component: 'userList'},
                            {path: '/userList', name: '菜单权限管理', component: 'userList'},
                        ]
                    },
                    {
                        // noDropdown: true,
                        path: '/infoList', name: '基地管理', component: 'infoList', icon: 'fa-envelope',
                        children: [
                            {path: '/infoList', name: '基地信息管理', component: 'infoList'},
                            {path: '/infoList', name: '企业联系人管理', component: 'infoList'},
                        ]
                    },
                    {
                        path: '/infoManage', name: '教学管理', component: 'content', icon: 'fa-asterisk',
                        children: [
                            {path: '/infoShow', name: '新建教学环节', component: 'infoShow'},
                            {path: '/infoModify', name: '教学环节管理', component: 'infoModify'},
                            {path: '/infoShow', name: '学习成果管理', component: 'infoShow'},
                            {path: '/infoModify', name: '学习成绩管理', component: 'infoModify'}
                        ]
                    },
                    {
                        path: '/fundManage', name: '审批管理', component: 'content', icon: 'fa-money',
                        children: [
                            {path: '/fundList', name: '待审批信息', component: 'fundList'},
                            {path: '/payList', name: '历史审批信息', component: 'payList'},
                            {path: '/payList', name: '审批流程管理', component: 'payList'}
                        ]
                    },
                    {
                        path: '/touziManage', name: '考勤管理', component: 'content', icon: 'fa-inbox',
                        children: [
                            {path: '/chinaTouziList', name: '考勤方案管理', component: 'chinaTouziList'},
                            {path: '/chinaTabsList', name: '考勤细心管理', component: 'chinaTabsList'},
                            {path: '/chinaTabsList', name: '新建临时查岗', component: 'chinaTabsList'}
                        ]
                    },
                    {
                        path: '/fundArticle', name: '预警管理', component: 'content', icon: 'fa-file-text-o',
                        children: [
                            {path: '/chinaTabsList', name: '考勤预警管理', component: 'chinaTabsList'},
                            {path: '/chinaTabsList', name: '日志预警管理', component: 'chinaTabsList'}
                        ]
                    }
                ];

                mUtils.setStore('menuData', menuData);  // 将菜单放入本地缓存。
                this.addMenu(menuData);  // 生成菜单,将菜单放入store。

                console.log(!this.isLoadRoutes);
                if (!this.isLoadRoutes) {  // 首次进来为false,改变其状态为true
                    const routes = mUtils.generateRoutesFromMenu(menuData) //根据菜单生成的路由信息,需要将数据库返回的对象key值转成小写
                    console.log(routes)
                    const asyncRouterMap = [
                        {
                            path: '/404',
                            name: '404',
                            hidden: true,
                            component: require('page/404.vue')
                        },
                        {
                            path: '/index',
                            name: '',
                            hidden: true,
                            component: require('layout/home.vue'),
                            redirect: '/index',
                            children: routes
                        }
                    ]
                    console.log(asyncRouterMap)
                    this.$router.addRoutes(asyncRouterMap);
                    this.loadRoutes()   // true,第二次进来不用再去加载路由
                }

                this.$router.push('/index')
                this.showMessage('success', '登录成功');
            },

            submitForm(loginForm) {
                this.$refs[loginForm].validate((valid) => {
                    if (valid) {
                        //用户登录的接口
                        let userinfo = this.loginForm;
                        // let data = {
                        //     ip: this.ip,
                            // url: 'http://ip.taobao.com/service/getIpInfo.php?ip='
                        // }
                        // let userData = Object.assign(userinfo);
                        axios({
                            type: 'get',
                            path: '/api/user/login',
                            data: userinfo,
                            fn: data => {
                                if (data.status == 1) {
                                    this.saveUserInfo() // 存入缓存，用于显示用户名
                                    this.generateMenuPushIndex() //模拟动态生成菜单并定位到index
                                    this.$store.dispatch('initLeftMenu'); //设置左边菜单始终为展开状态
                                } else {
                                    this.$message.error('登录失败请重试')
                                }
                            },
                            errFn: res => {
                                this.$message.error('请求出错11：' + res)
                            }
                        })
                    } else {
                        this.$notify.error({
                            title: '错误',
                            message: '请输入正确的用户名密码',
                            offset: 100
                        });
                        return false;
                    }
                });
            },
            // getip() {
            //     axios({
            //         type: 'get',
            //         path: 'http://httpbin.org/ip',
            //         data: '',
            //         fn: data => {
            //             const ip = data.origin;
            //             this.ip = ip;
            //         },
            //         errFn: res => {
            //             this.$message.error('请求出错：' + res)
            //         }
            //     });
            // },


        },
        watch: {
            adminInfo: function (newValue) {
                if (newValue.id) {
                    this.$message({
                        type: 'success',
                        message: '检测到您之前登录过，将自动登录'
                    });
                    this.$router.push('index')
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .login_page {
        position: absolute;
        width: 100%;
        height: 100%;
        background: url(../assets/img/bg1.jpg) no-repeat center center;
        background-size: 100% 100%;
    }

    .loginForm {
        background-color: #fff;
        padding: 20px;
        border-radius: 3px;
        box-shadow: 5px 5px 10px #01144c;

    .fa-tips {
        position: absolute;
        top: 0px;
        left: 10px;
        z-index: 20;
        color: #FF7C1A;
        font-size: 18px;
    }

    }
    .manage_tip {
        margin-bottom: 20px;

    .title {
        font-family: cursive;
        font-weight: bold;
        font-size: 26px;
        color: #fff;
    }

    .logo {
        width: 60px;
        height: 60px;
    }

    }
    .form_contianer {
        width: 370px;
        height: 210px;
        position: absolute;
        top: 20%;
        left: 34%;
        padding: 25px;
        border-radius: 5px;
        text-align: center;

    .submit_btn {
        width: 100%;
        font-size: 16px;
        letter-spacing: 20px;
    }

    }
    .tiparea {
        text-align: left;
        font-size: 12px;
        color: #4cbb15;

    .tip {
        margin-left: 54px;
    }

    }

    .form-fade-enter-active, .form-fade-leave-active {
        transition: all 1s;
    }

    .form-fade-enter, .form-fade-leave-active {
        transform: translate3d(0, -50px, 0);
        opacity: 0;
    }

    .loginForm {

    .el-button--primary {
        background-color: #FF7C1A;
        border: 1px solid #FF7C1A;
    }

    }
</style>
