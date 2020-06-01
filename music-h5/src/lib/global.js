// import common from './commonData';
// import router from '@/router';
// import { Toast } from 'vant';

function play(song) {
  this.$loading.show();
  this.$api.checkMusicIsUseful({
    id: song.id
  })
    .then(res => {
      this.$loading.hide();
      if (res.data.success) {
        this.$common.commit('changePlayingSong', song);
        let mode = '';
        if (this.$route.name === 'play') {
          mode = 'replace';
        } else {
          mode = 'push';
        }
        this.$router[mode]({
          name: 'play',
          params: { id: song.id },
          query: { name: song.name }
        });
      } else {
        this.$toast(res.data.msg);
      }
    })
    .catch(error => {
      this.$loading.hide();
      this.$toast(error.response.data.message);
    });
}
export default {
  play
};
