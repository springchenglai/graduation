import Header from '@/components/layout/header.vue';
import LoadModal from '@/components/layout/loadModal.vue';
import Footer from '@/components/layout/footer.vue';

export default {
  install(Vue) {
    Vue.component(Header.name, Header);
    Vue.component(Footer.name, Footer);
    Vue.component(LoadModal.name, LoadModal);
  }
};
