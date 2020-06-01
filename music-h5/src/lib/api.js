import request from './axios';

/**
 * 网易云音乐提供的接口
 * 不需要登录
 */

// 获取音乐url
const getMusicUrl = params => request({
  url: '/song/url',
  method: 'get',
  params
});

// 音乐是否可用
const checkMusicIsUseful = params => request({
  url: '/check/music',
  method: 'get',
  params
});

// 获取推荐新音乐
const getRecommendNewsong = params => request({
  url: '/personalized/newsong',
  method: 'get',
  params
});

// 获取推荐歌单
const getRecommendSonglist = params => request({
  url: '/personalized',
  method: 'get',
  params
});

// 获取歌手分类列表
const getArtistsList = params => request({
  url: '/artist/list',
  method: 'get',
  params
});

// 热门歌单分类
const getPlaylistsHot = params => request({
  url: '/playlist/hot',
  method: 'get',
  params
});

// 获取歌单详情(网络歌单)
const getNetworkPlayListDetail = params => request({
  url: '/playlist/detail',
  method: 'get',
  params
});

// 获取歌曲详情
const getSongDetail = params => request({
  url: '/song/detail',
  method: 'get',
  params
});

// 获取歌词
const getLyric = params => request({
  url: '/lyric',
  method: 'get',
  params
});

const getSongComment = params => request({
  url: '/comment/music',
  method: 'get',
  params
});

/**
 * 下面为自己写的接口
 * 需要验证登录
 */

// 用户登录
const login = params => request({
  url: '/user/login',
  method: 'post',
  data: params
});

// 用户注册
const register = params => request({
  url: '/user/register',
  method: 'post',
  data: params
});

// 获取用户信息
const getUserInfo = params => request({
  url: '/user/info',
  method: 'post',
  data: params
});

// 修改用户信息
const editUserInfo = params => request({
  url: '/user/editinfo',
  method: 'post',
  data: params
});

// 获取用户粉丝列表
const getUserFans = params => request({
  url: '/user/fans',
  method: 'get',
  params
});

// 获取用户关注列表
const getUserAttention = params => request({
  url: '/user/attention/get',
  method: 'get',
  params
});

// 关注用户
const attentionUser = params => request({
  url: '/user/attention/generate',
  method: 'POST',
  data: params
});

// 生成动态
const generateDynamic = params => request({
  url: '/user/dynamic/generate',
  method: 'post',
  data: params
});

// 获取用户圈子动态
const getDynamic = params => request({
  url: '/user/dynamic/get',
  method: 'get',
  params
});

// 用户下载或收藏歌曲
const downloadOrLikeSong = params => request({
  url: '/user/song/download',
  method: 'post',
  data: params
});

// 创建歌单
const createPlaylist = params => request({
  url: '/user/songlist/generate',
  method: 'post',
  data: params
});

// 获取用户所有歌单
const getUserPlaylist = params => request({
  url: '/user/songlist/list',
  method: 'get',
  params
});

// 获取歌单详情(用户自己的歌单)
const getUserPlayListDetail = params => request({
  url: '/user/songlist/detail',
  method: 'get',
  params
});

// 获取用户下载或者喜欢的歌曲
const getUserSongs = params => request({
  url: '/user/songs',
  method: 'get',
  params
});

// 收藏歌曲到歌单
const collectSong = params => request({
  url: '/user/song/collect',
  method: 'post',
  data: params
});

// 上传图片
const uploadImage = params => request({
  url: '/upload/image',
  method: 'post',
  data: params
});

// 给动态点赞
const likeDynamic = params => request({
  url: '/user/dynamic/like',
  method: 'post',
  data: params
});
export default {
  getMusicUrl,
  checkMusicIsUseful,
  getArtistsList,
  getPlaylistsHot,
  getNetworkPlayListDetail,
  login,
  register,
  getUserInfo,
  editUserInfo,
  getUserFans,
  getUserAttention,
  generateDynamic,
  downloadOrLikeSong,
  createPlaylist,
  collectSong,
  uploadImage,
  getUserPlaylist,
  getUserPlayListDetail,
  getSongDetail,
  getLyric,
  getSongComment,
  getUserSongs,
  getRecommendNewsong,
  getRecommendSonglist,
  getDynamic,
  attentionUser,
  likeDynamic
};
