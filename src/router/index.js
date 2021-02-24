import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/home.vue'
import Cookies from '../utils/cookieUtils'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component:Login
  },
  {
    path: '/home',
    component:Home
  }
  
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
//路由守卫 to将要去哪，from从哪来，next()放行，next('/login')强制跳转
router.beforeEach((to,from,next) => {
  let isLogin = false;
  if(Cookies.getCookies('user')){
    isLogin = true
  }
  if(to.path === '/login' && isLogin){
    next('/home');
    return next();
  }else if (to.path !== '/login' && isLogin){
    next();
  }else if (to.path === '/login' && !isLogin){
    next();
  }else if (to.path !== '/login' && !isLogin){
    next('/login');
    next();
  }
})

export default router
