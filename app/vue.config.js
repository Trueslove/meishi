/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-06 09:33:55
 * @LastEditTime: 2019-08-27 09:30:34
 * @LastEditors: Please set LastEditors
 */
const path = require('path')
const webpack = require('webpack')
module.exports = {
	// 基本路径
	publicPath: './',
	// 输出文件目录
	outputDir: 'dists',
	// webpack-dev-server 相关配置
	devServer: {
		host: "0.0.0.0",
		hot: true,
		port: 8080,
		proxy: {
			'/': {     //这里最好有一个 /
				target: 'https://wzcx.amahoo.cn/food',  // 后台接口域名
				secure: false,  // 如果是https接口，需要配置这个参数
				changeOrigin: true,  //是否跨域
				pathRewrite:{
					'^/':'/'
				}
			}
		}
	},
	chainWebpack: config => {
		const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
		types.forEach(type => addStyleResource(config.module.rule('less').oneOf(type)))
	},
	css: {
		loaderOptions: {
			less: {
				javascriptEnabled: true
			}
		}
	},
	configureWebpack: {
		plugins: [
			new webpack.ProvidePlugin({
				$: "jquery",
				jQuery: "jquery",
				"windows.jQuery": "jquery"
			})
		]
	}
}

function addStyleResource(rule) {
	rule.use('style-resource')
		.loader('style-resources-loader')
		.options({
			patterns: [
				path.resolve(__dirname, './src/assets/css/global.less'), // 需要全局导入的less
			]
		})
}