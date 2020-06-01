(function(doc, win) {
  // 假设设计稿宽度为640px, 在640px时设html的font-size为100px
  const defaultWidth = 640;
  const docEl = doc.documentElement;
  const resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
  // const initVh = docEl.clientHeight;
  // docEl.style.height = initVh;
  // alert(initVh);
  // 检测到屏幕宽度变化时就重新计算根节点font-size
  const recalc = function() {
    if (!docEl || !doc || !doc.body) {
      return;
    }
    const { clientWidth } = docEl;
    if (!clientWidth) {
      return;
    }
    docEl.style.fontSize = `${100 * (clientWidth / defaultWidth)}px`;
    // alert(docEl.clientHeight);
  };
  if (!doc.addEventListener) {
    return;
  }
  win.addEventListener(resizeEvt, recalc, false);
  doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);
