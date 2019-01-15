'use strict';

const path = require('path');
const del = require('del');
const globby = require('globby');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const atImport = require('postcss-import');

module.exports = () => {

	return del(['./test-dist'])
		.then(() => globby(['./test/manual/**/*.js', '!./test/manual/webpack.config.js']))
		.then(( files ) => {
			return files
				.map(( file ) => {
					const extname = path.extname(file);
					const key = path.basename(file, extname);
					const obj = {};
					obj[`${file.replace('./test/manual/', '').replace(path.basename(file), '')}${key}`] = file;
					return obj;
				})
				.reduce(( prev, next ) => {
					return Object.assign(prev, next);
				}, {});
		})
		.then(( entries ) => {

			return {
				entry: entries,
				output: {
					filename: '[name].js',
					path: path.resolve(__dirname, '../../test-dist'),
				},
				mode: 'none',
				devtool: 'cheap-module-inline-source-map',
				devServer: {
					contentBase: path.join(__dirname, '../../test-dist'),
					port: 9000,
					open: true
				},
				module: {
					rules: [
						{
							test: /\.css$/,
							use: [
								{
									loader: MiniCssExtractPlugin.loader
								},
								{
									loader: 'css-loader',
									options: {
										sourceMap: true,
										import: false
									}
								},
								{
									loader: 'postcss-loader',
									options: {
										sourceMap: true,
										plugins: [
											atImport()
										]
									}
								}
							],
						}
					],
				},
				plugins: [
					new CopyWebpackPlugin([
						{ from: 'test/manual/assets/images/*', to: 'assets/images', flatten: true }
					]),
					new MiniCssExtractPlugin({
						filename: '[name].css',
						chunkFilename: '[id].css'
					}),
					...Object.keys(entries).map(( key ) => {
						return new HtmlWebpackPlugin({
							title: key,
							chunks: [key],
							filename: `${key}.html`,
							template: `./test/manual/${key}.html`
						});
					})
				]
			};

		});

};
