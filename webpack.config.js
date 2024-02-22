const path = require('path');

module.exports = {
    // エントリーポイントの設定
    entry: './server.js',
    // ビルド後、'./dist/my-bundle.js'というbundleファイルを生成する
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'muserver.js'
    },
    resolve: {
        // configuration options
        modules: ["node_modules"],
        alias: {
            'pg-native': './pg-native-dummy.js',
            'dns': './pg-native-dummy.js',
          }
    },
    target: 'node'
};
