import Vue from 'vue'
import VueRouter from 'vue-router'
import store from "@/store";
import {request} from "axios";

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/404',
    name: '404',
    component: () => import('../views/404.vue')
  },
  {
    path: '/front',
    name: 'Front',
    component: () => import('../views/front/Front'),
    children: [
      {
        path: 'home',
        name: 'FrontHome',
        component: () => import('../views/front/Home.vue')
      },
      {
        // 借阅排行
        path: 'booksearch',
        name: 'BookSearch',
        props:true,
        component: () => import('../views/front/BookSearch')
      },
      {
        path: 'bookdetail',
        name: 'BookDetail',
        component: () => import('../views/front/BookDetail.vue')
      },
      {
        path: 'person',
        name: 'FrontPerson',
        component: () => import('../views/front/Person')
      },
      {
        path: 'password',
        name: 'FrontPassword',
        component: () => import('../views/front/Password')
      },
      {
        path: 'myborrow',
        name: 'MyBorrow',
        component: () => import('../views/front/MyBorrow')
      },
      {
        path: 'myfavorited',
        name: 'MyFavorited',
        component: () => import('../views/front/MyFavorited')
      },
      {
        path: 'messagewall',
        name: 'MessageWall',
        component: () => import('../views/front/MessageWall')
      },
      {
        path: 'notice',
        name: 'Notice',
        component: () => import('../views/front/Notice')
      },
    ]
  },
  {
    path: '/front/login',
    name: 'FrontLogin',
    component: () => import('../views/front/Login.vue')
  },
  {
    path: '/front/register',
    name: 'FrontRegister',
    component: () => import('../views/front/Register.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 提供一个重置路由的方法
export const resetRouter = () => {
  router.matcher = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
  })
}

// 注意：刷新页面会导致页面路由重置
export const setRoutes = () => {
  const storeMenus = localStorage.getItem("menus");
  if (storeMenus) {

    // 获取当前的路由对象名称数组
    const currentRouteNames = router.getRoutes().map(v => v.name)
    if (!currentRouteNames.includes('Manage')) {
      // 拼装动态路由
      const manageRoute = { path: '/', name: 'Manage', component: () => import('../views/Manage.vue'), redirect: "/home", children: [
          { path: 'person', name: '个人信息', component: () => import('../views/Person.vue')},
          { path: 'password', name: '修改密码', component: () => import('../views/Password.vue')}
        ] }
      const menus = JSON.parse(storeMenus)
      menus.forEach(item => {
        if (item.path) {  // 当且仅当path不为空的时候才去设置路由
          let itemMenu = { path: item.path.replace("/", ""), name: item.name, component: () => import('../views/' + item.pagePath + '.vue')}
          manageRoute.children.push(itemMenu)
        } else if(item.children.length) {
          item.children.forEach(item => {
            if (item.path) {
              let itemMenu = { path: item.path.replace("/", ""), name: item.name, component: () => import('../views/' + item.pagePath + '.vue')}
              manageRoute.children.push(itemMenu)
            }
          })
        }
      })
      // 动态添加到现在的路由对象中去
      router.addRoute(manageRoute)
    }
  }
}

// 重置我就再set一次路由
setRoutes()

// 路由守卫
router.beforeEach((to, from, next) => {
  localStorage.setItem("currentPathName", to.name); // 设置当前的路由名称，为了在 Header 组件中使用
  store.commit("setPath"); // 触发 store 的数据更新

  const userToken = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).token : null;
  const readerToken = localStorage.getItem("reader") ? JSON.parse(localStorage.getItem("reader")).token : null;

  // 判断当前路由是否需要权限验证
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 如果是用户端路由
    if (to.path.startsWith("/front")) {
      // 如果用户端没有 token，跳转到登录页面
      if (!readerToken) {
        next("/front/login");
      } else {
        // 如果有 token，则将 token 放置到请求头中
        request.defaults.headers.common["ReaderToken"] = readerToken;
        next();
      }
    } else { // 如果是管理端路由
      // 如果管理端没有 token，跳转到登录页面
      if (!userToken) {
        next("/login");
      } else {
        // 如果有 token，则将 token 放置到请求头中
        request.defaults.headers.common["token"] = userToken;
        next();
      }
    }
  } else {
    // 如果用户访问的路径不存在，跳转到404页面
    if (!to.matched.length) {
      next("/404");
    } else {
      next();
    }
  }
});

export default router
