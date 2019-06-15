import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
import './apis/apis'
import './mixin/mixin'
import './utils/newaxios'
import jgTable from '@/components/common/jgtable';
Vue.component('jg-table',jgTable)

Vue.config.productionTip = false

router.beforeEach((to,from,next)=>{
  if(to.path =='/login'){
    next()
  }else{
    var token = localStorage.token;
    if(token){
      next()
    }else{
      next({path:'/login',query:{redirect:to.path}})
    }
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
