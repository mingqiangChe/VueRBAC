import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login.vue'
import Home from '@/components/Home.vue'
import Welcome from '@/components/Welcome.vue'
import Users from '@/components/user/Users.vue'
import Roles from '@/components/role/Roles.vue'
import GoodsCate from '@/components/goods/GoodsCate.vue'
import GoodsList from '@/components/goods/GoodsList.vue'
import NotFound from '@/components/NotFound.vue'
import store from './store'

Vue.use(Router)

const userRule = { path: '/users', component: Users }
const roleRule = { path: '/roles', component: Roles }
const goodRule = { path: '/goods', component: GoodsList }
const categoryRule = { path: '/categories', component: GoodsCate }

//路由规则和字符传映射关系
const ruleMapping = {
  'users': userRule,
  'roles': roleRule,
  'goods': goodRule,
  'categories': categoryRule
}

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        // { path: '/users', component: Users },
        // { path: '/roles', component: Roles },
        // { path: '/goods', component: GoodsList },
        // { path: '/categories', component: GoodsCate }
      ]
    },
    {
      path: '*',
      component: NotFound
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next()
  } else {
    const token = sessionStorage.getItem('token')
    if (!token) {
      next('/login')
    } else {
      next()
    }
  }

  next()
})


export function initDynamicRoutes() {
  //根据二级权限，对路由规则进行动态添加
  const currentRoutes = router.options.routes
  // currentRoutes[2].children.push()
  const rightList = store.state.rightList
  rightList.forEach(item => {
    item.children.forEach(item => {
      const temp = ruleMapping[item.path]
      temp.meta = item.rights
      currentRoutes[2].children.push(ruleMapping[item.path])
       
    })
  })
  router.addRoutes(currentRoutes)
}

export default router
