const path = require('path');
let CompressionPlugin = require('compression-webpack-plugin');
let env = process.env.QA_ENV;
const cesiumSource = 'node_modules/cesium/Source';
const cesiumWorkers = '../Build/Cesium/Workers';

function getPlugins() {
  if (env === 'build') {
    return {
      install: {
        plugin: require('uglifyjs-webpack-plugin'),
        args: [
          {
            sourceMap: false,
            uglifyOptions: {
              compress: {
                // 删除所有的 `console` 语句
                drop_console: true,
              },
              output: {
                // 最紧凑的输出
                beautify: false,
                // 删除所有的注释
                comments: false,
              },
            },
          },
        ],
      },
    };
  } else {
    return {};
  }
}

function getModulePackageName(module) {
  if (!module.context) return null;
  const nodeModulesPath = path.join(__dirname, './node_modules/');
  if (module.context.substring(0, nodeModulesPath.length) !== nodeModulesPath) {
    return null;
  }
  const moduleRelativePath = module.context.substring(nodeModulesPath.length);
  const [moduleDirName] = moduleRelativePath.split(path.sep);  //将特定文字分隔符 ‘\\' 或 ‘/' 的字符串转换成数组对象。
  let packageName = moduleDirName;
  // handle tree shaking
  if (packageName.match('^_')) {
    // eslint-disable-next-line prefer-destructuring
    packageName = packageName.match(/^_(@?[^@]+)/)[1];
  }
  if (packageName.match(/cesium/)) {
    // eslint-disable-next-line prefer-destructuring
    packageName = 'cesium';
  }
  return packageName;
}

export default {
  treeShaking: true,
  manifest: {
    basePath: '/',
  },
  publicPath: '/',
  outputPath: './pages',
  hash:true,
  define: {
    CESIUM_BASE_URL: '/cesium',
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: {
        hmr: true,
      },
      // 部署按需加载
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
        webpackChunkName: true,
        level: 3,
      },
      title: 'geo-ecological',
      // dll: true,
      locale: {
        enable: true,
        default: 'en-US',
        baseNavigator:false,
      },
      routes: {
        exclude: [
          /models\//,
          /services\//,
          /model\.(t|j)sx?$/,
          /service\.(t|j)sx?$/,
          /components\//,
        ]
      },
    }],
  ],
  // 代理请求到其他服务器
  proxy: {
    '/v1.0/api': {
      target: 'http://114.115.129.187:8080/v1.0/api/',
      changeOrigin: true,
      secure: false,
      pathRewrite: { '^/v1.0/api': '' },
    },
    '/v2.0/api': {
      target: 'http://114.115.129.187:8080/v2.0/api/',
      changeOrigin: true,
      secure: false,
      pathRewrite: { '^/v2.0/api': '' },
    },
    '/DataServer': {
      target: 'http://t0.tianditu.com/',
      changeOrigin: true,
      secure: false,
      pathRewrite: { '^/map/api': '' },
    },
    '/taobao/service': {
      target: 'http://ip.taobao.com/',
      changeOrigin: true,
      secure: false,
      pathRewrite: { '/taobao/service': '/service' },
    },
    '/map/api': {
      target: 'http://114.115.129.187:8888/v1.0/api/',
      changeOrigin: true,
      secure: false,
      pathRewrite: { '^/map/api': '' },
    }
  },
  alias: {
    'cesium': path.resolve(__dirname, './node_modules/cesium/Source'),
    '@components': path.resolve(__dirname, './src/components'),
    '@utils': path.resolve(__dirname, './src/utils'),
    '@assets': path.resolve(__dirname, './src/assets'),
    '@services': path.resolve(__dirname, './src/services'),
  },
  'copy': [
    {
      from: path.join(cesiumSource, cesiumWorkers), to: 'cesium/Workers',
    },
    {
      from: path.join(cesiumSource, 'Assets'), to: 'cesium/Assets',
    },
    {
      from: path.join(cesiumSource, 'Widgets'), to: 'cesium/Widgets',
    },
  ],
  chainWebpack(config, { webpack }) {
    config.merge({
      amd: {
        toUrlUndefined: true,
      },
      node: {
        fs: 'empty',
      },
      module: {
        unknownContextCritical: false,
      },
      plugin: getPlugins(),
    });

    if (env === 'build') {
      config.optimization
        .runtimeChunk(false) // share the same chunks across different modules
        .splitChunks({
          chunks: 'async',
          name: 'vendors',
          maxInitialRequests: Infinity,
          minSize: 0,
          cacheGroups: {
            vendors: {
              test: module => {
                const packageName = getModulePackageName(module);
                if (packageName) {
                  return ['cesium'].indexOf(packageName) >= 0;
                }
                return false;
              },
              name(module) {
                const packageName = getModulePackageName(module);
                if (['cesium'].indexOf(packageName) >= 0) {
                  return 'cesium'; // visualization package
                }
                return 'misc';
              },
            },
          },
        });
      config.plugin('compression').use(
        new CompressionPlugin({
          test: /\.(js|css)(\?.*)?$/i,
          filename: '[path].gz[query]',
          algorithm: 'gzip',
        }),
      );
    }
  },
}
