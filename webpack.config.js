const Dotenv = require('dotenv-webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
	mode: process.env.NODE_ENV || 'development',
	entry: {
		content: path.join(__dirname, 'src/pages/Content/content.js'),
		options: path.join(__dirname, 'src/pages/Options/index.js'),
		background: path.join(__dirname, 'src/pages/Background/background.js'),
	},
	output: {
		path: path.join(__dirname, 'dist'),
		filename: '[name].bundle.js',
		globalObject: 'self',
		publicPath: '',
	},
	resolve: {
		extensions: ['.js', '.jsx'],
		alias: {
			jquery: 'jquery/src/jquery',
		},
	},
	devtool:
		process.env.NODE_ENV === 'development' ? 'eval-source-map' : 'source-map',
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: ['babel-loader'],
			},
			{
				test: /\.css$/,
				use: [MiniCssExtractPlugin.loader, 'css-loader'],
			},
			{
				test: /\.(png|jpe?g|gif|svg)$/i,
				use: [
					{
						loader: 'file-loader',
						options: {
							outputPath: 'public/images',
							name: '[name].[ext]',
						},
					},
				],
			},
			{
				test: /\.(mp4)$/,
				use: {
					loader: 'file-loader',
					options: {
						name: '[name].[ext]',
						outputPath: 'videos/',
						publicPath: 'videos/',
					},
				},
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/pages/Options/OptionsSBFC.html',
			filename: 'OptionsSBFC.html',
			chunks: ['options'],
		}),
		new CopyWebpackPlugin({
			patterns: [
				{ from: 'src/manifest.json', to: 'manifest.json' },
				{
					from: 'src/public/images',
					to: 'public/images',
				},
			],
		}),
		new MiniCssExtractPlugin({ filename: '[name].css' }),
		new Dotenv(),
	],
}
