import Vue from 'vue';
import Router from 'vue-router';
import common from '@/lib/commonData';
import api from '@/lib/api';
import index from '@/page/index';
import login from '@/page/login/login';
import register from '@/page/login/register';
import play from '@/components/common/play';
import PlayList2 from '@/components/common/playlist2';
// import recommend from '@/page/index';
import MyMusic from '@/page/my/mymusic';
import person from '@/page/my/person';
import EditInfo from '@/page/my/editinfo';
import FriendsList from '@/page/my/friendlist';
import UserHomePage from '@/components/common/userhomepage';
import SongListHomepage from '@/components/common/songlisthomepage';
import MusicDynamic from '@/page/my/musicdynamic';

Vue.use(Router);
const route = {
  mode: 'history',
  base: '/',
  routes: [
    {
      path: '/',
      name: 'index',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: index,
      meta: {
        free: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: login,
      meta: {
        free: true
      }
    },
    {
      path: '/register',
      name: 'register',
      component: register,
      meta: {
        free: true
      }
    },
    {
      path: '/my/music',
      name: 'mymusic',
      component: MyMusic,
      meta: {
        free: false
      }
    },
    {
      path: '/my/person',
      name: 'person',
      component: person,
      meta: {
        free: true
      }
    },
    {
      path: '/user/homepage/:id',
      name: 'userhomepage',
      component: UserHomePage,
      beforeEnter: (to, from, next) => {
        // 跳到用户主页时验证该用户是不是本平台用户，如果不是就不能跳过去
        api.getUserInfo({
          id: to.params.id
        })
          .then(res => {
            next();
          })
          .catch(error => {
            next(false);
            Vue.prototype.$toast(error.response.data.msg);
          });
      },
      meta: {
        free: true
      }
    },
    {
      path: '/person/editinfo',
      name: 'editinfo',
      component: EditInfo,
      meta: {
        free: false
      }
    },
    {
      path: '/friends/list/:id',
      name: 'friendslist',
      component: FriendsList,
      meta: {
        free: false
      }
    },
    {
      path: '/music/play/:id',
      name: 'play',
      component: play,
      meta: {
        free: true
      }
    },
    {
      path: '/music/playlist',
      name: 'playlist',
      component: PlayList2,
      meta: {
        free: true
      }
    },
    {
      path: '/songlist/homepage/:id',
      name: 'songlisthomepage',
      component: SongListHomepage,
      meta: {
        free: true
      }
    },
    {
      path: '/music/dynamic',
      name: 'musicdynamic',
      component: MusicDynamic,
      meta: {
        free: false
      }
    }
  ]
};
const router = new Router(route);

router.beforeEach((to, from, next) => {
  // 验证是否需要登录
  if (to.matched.some(record => !record.meta.free)) {
    if (common.getters.getUser.id) {
      // 去请求一个需要登录的接口，让服务器判断token有没有过期
      common.dispatch('getUserInfo', {
        id: common.getters.getUser.id
      })
        .then(res => {
          next();
        })
        .catch(error => {
          if (error.response.status === 401) {
            next({
              name: 'login',
              query: {
                redirect: to.fullPath
              }
            });
          }
        });
    } else {
      next({
        name: 'login',
        query: {
          redirect: to.fullPath
        }
      });
    }
  } else {
    next();
  }
});

export default router;
