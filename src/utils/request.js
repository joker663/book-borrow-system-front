import axios from 'axios'
import router from "@/router";
import {serverIp} from "../../public/config";
import ElementUI from "element-ui";

const request = axios.create({
    baseURL: `http://${serverIp}:8080`,
    timeout: 30000
})

// request 拦截器
// 可以自请求发送前对请求做一些处理
// 比如统一加token，对请求参数统一加密
request.interceptors.request.use(config => {
    config.headers['Content-Type'] = 'application/json;charset=utf-8';
    let user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null
    let reader = localStorage.getItem("reader") ? JSON.parse(localStorage.getItem("reader")) : null
    if (user) {
        config.headers['token'] = user.token;  // 设置请求头
    }
    if (reader) {
        config.headers['ReaderToken'] = reader.token;  // 设置请求头
    }
    return config
}, error => {
    return Promise.reject(error)
});

// response 拦截器
// 可以在接口响应后统一处理结果
request.interceptors.response.use(
    response => {
        let res = response.data;
        // 如果是返回的文件
        if (response.config.responseType === 'blob') {
            return res
        }
        // 兼容服务端返回的字符串数据
        if (typeof res === 'string') {
            res = res ? JSON.parse(res) : res
        }

        // 当权限验证不通过的时候给出提示
        if (res.code === '402') {
            ElementUI.Message({
                message: res.msg,
                type: 'error'
            });
            if (router.currentRoute.path.startsWith("/front")) { // 如果当前路由是用户端路由
                router.push("/front/login"); // 跳转到用户端的登录页面
            }
        }

        // 当权限验证不通过的时候给出提示
        if (res.code === '401') {
            ElementUI.Message({
                message: res.msg,
                type: 'error'
            });
            if (router.currentRoute.path !== '/login' && !router.currentRoute.path.startsWith("/front")) { // 如果当前路由不是用户端路由
                router.push("/login"); // 跳转到管理端的登录页面
            }
        }

        return res;
    },
    error => {
        console.log('err' + error) // for debug
        return Promise.reject(error)
    }
)

export default request
