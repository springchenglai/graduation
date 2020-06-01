'use strict'
const path = require('path');
const config = require('../config');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const packageConfig = require('../package.json');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}
// 把静态资产放到指定目录 /static/...
exports.assetsPath = function (_path) {
  const assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory

  return path.posix.join(assetsSubDirectory, _path);
}

exports.cssLoaders = function (options) {
  options = options || {};
  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap
    }
  };

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  };
  // 把px转化为rem的加载器
  const px2remLoader = {
    loader: 'px2rem-loader',
    options: {
      // 1rem = 50px
      remUnit: 50
    }
  };
  // 把 variable.scss和mixins.scss里面的内容声明为全局
  const sassResourceLoader = {
    loader: 'sass-resources-loader',
    options: {
      resources: [
        resolve('src/styles/variable.scss'),
        resolve('src/styles/mixins.scss')
      ]
    }
  };
  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader];
    loaders.push(px2remLoader);
    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      });
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      });
    } else {
      return ['vue-style-loader'].concat(loaders);
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass').concat(sassResourceLoader),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  };
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  const output = [];
  const loaders = exports.cssLoaders(options);

  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }

  return output;
}

exports.createNotifierCallback = () => {
  const notifier = require('node-notifier')

  return (severity, errors) => {
    if (severity !== 'error') return

    const error = errors[0];
    const filename = error.file && error.file.split('!').pop();

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    })
  }
}
