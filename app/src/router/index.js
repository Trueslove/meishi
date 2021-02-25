import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'hash',
  routes: [{
      path: "/",
      name: 'main',
      component: resolve => {
        require(['./../components/footer.vue'], resolve)
      },
      children: [{
          path: '/',
          name: "home",
          meta: {
            title: '首页'
          },
          component: resolve => {
            require(['./../pages/home/index.vue'], resolve)
          }
        },
        {
          path: '/order',
          name: 'order',
          meta: {
            title: '订单'
          },
          component: resolve => {
            require(['./../pages/order/index.vue'], resolve)
          }
        },
        {
          path: '/list',
          name: 'list',
          meta: {
            title: '评论圈'
          },
          component: resolve => {
            require(['./../pages/list/index.vue'], resolve)
          }
        },
        {
          path: '/myself',
          name: 'myself',
          meta: {
            title: '我的'
          },
          component: resolve => {
            require(['./../pages/myself/index.vue'], resolve)
          }
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      meta: {
        title: '登录'
      },
      component: resolve => {
        require(['./../components/login.vue'], resolve)
      }
    },
    {
      path: '/detail',
      name: 'detail',
      meta: {
        title: '详情'
      },
      component: resolve => {
        require(['./../pages/home/detail.vue'], resolve)
      }
    },
    {
      path: '/share',
      name: 'share',
      meta: {
        title: '发布'
      },
      component: resolve => {
        require(['./../pages/myself/share.vue'], resolve)
      }
    },
    {
      path: '/browse',
      name: 'browse',
      meta: {
        title: '浏览记录'
      },
      component: resolve => {
        require(['./../pages/browse/index.vue'], resolve)
      }
    },
    {
      path: '/business',
      name: 'business',
      meta: {
        title: '发表评论'
      },
      component: resolve => {
        require(['./../pages/order/business.vue'], resolve)
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? to.meta.title : '未设置'
  if (sessionStorage.getItem('userInfo')) {
    next()
  } else {
    if (to.path === '/login') { // 这就是跳出循环的关键
      next()
    } else {
      next('/login')
    }
  }
})

export default router


