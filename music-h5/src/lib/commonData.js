import Vue from 'vue';
import Vuex from 'vuex';
import api from './api';

Vue.use(Vuex);
const common = new Vuex.Store({
  state: {
    playingSong: null,
    userInfo: null,
    playlist: [], // 播放列表
    songRandom: {
      album: 'Yesterday Once More: Greatest Hits 1969-1983',
      aliaName: '',
      artists: ['Carpenters'],
      avatar: 'https://p1.music.126.net/oohnKqUgkNEsYJHJDcGmZw==/19000660439857160.jpg',
      id: 3986241,
      name: 'Yesterday Once More'
    } // 系统存储的歌曲，当用户点击随便听听时播放
  },
  getters: {
    getPlayingSong(state) {
      const playingSong = localStorage.getItem('playingSong') !== 'undefined' && JSON.parse(localStorage.getItem('playingSong'));
      return state.playingSong || playingSong || {};
    },
    getUser(state) {
      const user = JSON.parse(localStorage.getItem('user'));
      return state.userInfo || user || {};
    },
    getPlaylist(state, getters) {
      const playlistStorage = JSON.parse(localStorage.getItem('playlist')) || [];
      const playlist = state.playlist.length > 0 ? state.playlist : playlistStorage;
      const idsArr = playlist.map(song => song.id);
      if (!idsArr.includes(getters.getPlayingSong.id)) {
        playlist.unshift(getters.getPlayingSong);
      }
      return playlist;
    }
  },
  mutations: {
    changePlayingSong(state, payload) {
      state.playingSong = payload;
      localStorage.setItem('playingSong', JSON.stringify(payload));
    },
    saveUserInfo(state, payload) {
      state.userInfo = payload;
      localStorage.setItem('user', JSON.stringify(payload));
    },
    changePlaylist(state, payload) {
      state.playlist = payload;
      localStorage.setItem('playlist', JSON.stringify(payload));
    }
  },
  actions: {
    // 登录之后存储用户信息
    loginByEmail(context, payload) {
      return new Promise((resolve, reject) => {
        api.login(payload)
          .then(res => {
            localStorage.setItem('token', res.data.token);
            context.commit('saveUserInfo', res.data.data);
            resolve(res);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    getUserInfo(context, payload) {
      return new Promise((resolve, reject) => {
        api.getUserInfo(payload)
          .then(res => {
            context.commit('saveUserInfo', res.data.data);
            resolve(res);
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  }
});
export default common;
