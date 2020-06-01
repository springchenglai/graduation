import Header from './layout/header';
import Footer from './layout/footer';
import LoadModal from './layout/loadModal';

export default {
  install(Vue, { router }) {
    // 注册全局组件
    Vue.component(Header.name, Header);
    Vue.component(Footer.name, Footer);
    Vue.component(LoadModal.name, LoadModal);
  }
}
;