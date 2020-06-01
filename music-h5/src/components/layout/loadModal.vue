<template>
  <article id="loading-modal">
    <van-loading class="body" color="white" size="50px" />
  </article>
</template>
<script>
import { Loading } from 'vant';

export default {
  name: 'LoadModal',
  data() {
    return {

    };
  },
  methods: {

  },
  components: {
    VanLoading: Loading
  }
};
</script>
<style lang="scss">
  #loading-modal {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 101;
    background: rgba(0, 0, 0, .2);
    .body {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
</style>

