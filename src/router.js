import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {path:'/',redirect:'/home'},
    {path:'/login',name:'login',component:()=>import(/*webpackChunkName:'login' */ '@/components/Login/Login')},
    {
      path: '/home',
      name: 'home',
      component: () => import(/* webpackChunkName: "home" */ '@/components/Home/Home.vue'),
      children:[
        {path:'Daily',name:'Daily',component:()=>import(/*webpackChunkName: "daily" */ '@/components/Daily/Daily')},
        {path:'Message',name:'Message',component:()=>import(/*webpackChunkName: "Message" */ '@/components/Message/Message')},
        {path:'Music',name:'Music',component:()=>import(/*webpackChunkName: "Music" */ '@/components/Music/Music')},
        {path:'Types',name:'Types',component:()=>import(/*webpackChunkName: "Types" */ '@/components/Types/Types')},
        {path:'Wechat',name:'Wechat',component:()=>import(/*webpackChunkName: "Wechat" */ '@/components/Wechat/Wechat')},
      ]
    }
  ]
})
