import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/home.vue'
import Course from '../components/course'
import Homework from '../components/homework'
import Question from '../components/question'
import Profile from '../components/profile'
import CourseInfo from '../components/courseinfo'
import Document from '../components/courseinfo/document'
import CourseHomework from '../components/courseinfo/homework'
import Notice from '../components/courseinfo/notice'
import QuestionInfo from '../components/courseinfo/question'
import Grade from '../components/courseinfo/grade'
import SubmitNotice from '../components/courseinfo/submitnotice'
import SubmitHomework from '../components/courseinfo/submithomework'



import Cookies from '../utils/cookieUtils'
import { request } from '../network/request'


const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    children: [{
      path: '/home',
      component: Course
    }, {
      path: '/homework',
      component: Homework
    }, {
      path: '/question',
      component: Question
    }, {
      path: '/profile',
      component: Profile
    }, {
      path: '/courseinfo',
      component: CourseInfo,
      children: [{
        path: '/courseinfo',
        component: Document
      }, {
        path: '/coursehomework',
        component: CourseHomework
      },{
        path: '/notice',
        component: Notice
      },{
        path: '/questioninfo',
        component: QuestionInfo
      },{
        path: '/grade',
        component: Grade
      },{
        path: '/submitnotice',
        component: SubmitNotice
      },{
        path: '/submithomework',
        component: SubmitHomework
      },]
    }]
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

//路由守卫这里有点问题，
//路由守卫 to将要去哪，from从哪来，next()放行，next('/login')强制跳转
router.beforeEach((to, from, next) => {
  let isLogin = false;
  //localStorge的userInfo不小心删除了，但是userID cookie还在，那么更新localStorge
  if (!localStorage.getItem('userInfo') && Cookies.getCookies('userID')) {
    let id = Cookies.getCookies('userID')
    request({
      url: '/user/stuInfo',
      method: 'get',
      params: {
        id
      }
    }).then(res => {
      localStorage.setItem('userInfo', JSON.stringify(res.data[0]))
    })
  }
  //localStorge的userInfo存在，但是userID cookie不小心删除了，那么更新cookie的userID
  if (localStorage.getItem('userInfo') && !Cookies.getCookies('userID')) {
    let userInfo = JSON.parse(localStorage.getItem('userInfo'));
    Cookies.setCookies('userID', userInfo.id)
  }
  if (Cookies.getCookies('userID') || localStorage.getItem('userInfo')) {
    isLogin = true
  }

  if (to.path === '/login' && isLogin) {
    next('/home');
    return next();
  } else if (to.path !== '/login' && isLogin) {
    next();
  } else if (to.path === '/login' && !isLogin) {
    next();
  } else if (to.path !== '/login' && !isLogin) {
    next('/login');
    next();
  }
})

export default router
