/** @format */
require("intersection-observer");
require("es6-promise").polyfill();

require("dotenv").config({ path: ".env" });

const CopyPlugin = require("copy-webpack-plugin"),
	path = require("path"),
	HtmlWebpackPlugin = require("html-webpack-plugin"),
	MiniCssExtractPlugin = require("mini-css-extract-plugin"),
	VueLoaderPlugin = require("vue-loader/lib/plugin"),
	mode = process.env.NODE_ENV || "development",
	isProduction = mode === "production";

function pkg(m) {
	// get the name. E.g. node_modules/packageName/not/this/part.js
	// or node_modules/packageName
	const packageName = m.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1].replace("@", "");

	// npm package names are URL-safe, but some servers don't like @ symbols
	if (packageName.includes("vue")) {
		return `pkg.vueCommons`;
	}
	return `pkg.${packageName}`;
}

//webpack defaults
var config = {
	entry: {
		app: "./src/js/index.js",
	},
	resolve: {
		alias: {
			_src: path.resolve(__dirname, "src"),
			_components: path.resolve(__dirname, "src/js/components"),
			_helpers: path.resolve(__dirname, "src/js/helpers"),
			_assets: path.resolve(__dirname, "src/assets"),
			_scss: path.resolve(__dirname, "src/scss"),
		},
		extensions: [".js", ".vue"],
	},
	output: {
		path: __dirname + "/public",
		filename: "js/[name].js",
		chunkFilename: "js/chunks/[name].js",
		publicPath: "/",
	},
	plugins: [new VueLoaderPlugin()],
	module: {
		rules: [
			{
				test: /\.js$/,
				include: path.resolve(__dirname, "src"),
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
				},
			},
			{
				test: /\.vue$/,
				include: path.resolve(__dirname, "src"),
				exclude: /node_modules/,
				use: [
					{
						loader: "vue-loader",
						options: {
							hotReload: true,
						},
					},
				],
			},
			{
				test: /\.css$/i,
				include: path.resolve(__dirname, "src"),
				use: [
					/**
					 * MiniCssExtractPlugin doesn't support HMR.
					 * For developing, use 'style-loader' instead.
					 * */
					...(isProduction
						? [MiniCssExtractPlugin.loader, "css-loader"]
						: ["vue-style-loader", "css-loader?sourceMap"]),
				],
			},
			{
				test: /\.s[ac]ss$/i,
				include: path.resolve(__dirname, "src"),
				use: [
					...(isProduction
						? [
								MiniCssExtractPlugin.loader,
								"css-loader",
								"sass-loader", // Compiles Sass to CSS
						  ]
						: ["vue-style-loader", "css-loader?sourceMap", "sass-loader?sourceMap"]),
				],
			},
			{
				test: /\.(png|jpg|gif|svg)$/,
				include: path.resolve(__dirname, "src"),
				use: [
					{
						loader: "file-loader",
						options: {
							name: "images/[name].[ext]",
							esModule: false,
						},
					},
				],
			},
			{
				test: /\.(mov|mp4|webm)$/,
				include: path.resolve(__dirname, "src"),
				use: [
					{
						loader: "file-loader",
						options: {
							name: "video/[name].[ext]",
							esModule: false,
						},
					},
				],
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/,
				include: path.resolve(__dirname, "src"),
				use: [
					{
						loader: "file-loader",
						options: {
							name: "fonts/[name].[ext]",
							esModule: false,
						},
					},
				],
			},
		],
	},
	mode,
	devtool: isProduction ? false : "source-map",
};
if (isProduction) {
	//production only
	const TerserPlugin = require("terser-webpack-plugin"),
		HtmlBeautifyPlugin = require("html-beautify-webpack-plugin"),
		ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin"),
		OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
	// PurgecssPlugin = require("purgecss-webpack-plugin"),
	// glob = require("glob-all");
	config.output.pathinfo = false;
	config.plugins.push(
		new MiniCssExtractPlugin({
			filename: "css/[name].css",
		}),
		new HtmlWebpackPlugin({
			filename: "index.html",
			template: "src/index.original.html",
			hash: true,
			minify: {
				removeComments: true,
				removeEmptyElements: false,
				minifyCSS: {
					format: "beautify",
				},
			},
		}),
		new ScriptExtHtmlWebpackPlugin({
			defaultAttribute: "defer",
		}),
		new HtmlBeautifyPlugin({
			config: {
				html: {
					end_with_newline: false,
					indent_size: 2,
					indent_with_tabs: true,
					indent_inner_html: true,
					preserve_newlines: false,
				},
			},
		}),
		new CopyPlugin([
			{ from: "src/static/default", to: "", dot: true },
			{ from: "src/static/production", to: "", dot: true },
		])
	);
	module.exports = Object.assign({}, config, {
		optimization: {
			splitChunks: {
				chunks: "all",
				cacheGroups: {
					vendor: {
						test: /(node_modules|vendors).+(?<!css)$/,
						name: m => {
							return pkg(m);
						},
						reuseExistingChunk: true,
						enforce: true,
						chunks: "all",
						minSize: 10000,
					},
					// Split Vue chunks
					vue: {
						name: m => {
							if (m.constructor.name !== "CssModule") {
								if (m.context.includes("node_modules")) {
									//	PACKAGE
									return pkg(m);
								} else if ("rawRequest" in m) {
									var moduleName = m.rawRequest.split("/");
									moduleName = moduleName[moduleName.length - 1].split("?")[0].split(".")[0];
									if (m.context.includes("src\\js\\components")) {
										// COMPONENT
										moduleName = moduleName.charAt(0).toLowerCase() + moduleName.slice(1);
										return `component.${moduleName}`;
									} else if (m.context.includes("src\\js\\views")) {
										// VIEW, this mimics the [request] naming
										var pre = String.raw`${m.context}`.replace(/\\/gi, "-"),
											prefix = pre.split("views-")[1] + "-";
										return `view.${prefix + moduleName}-vue`;
									}
									return "root";
								}
								return "unknown";
							}
							return "styles";
						},
						test: /\.vue$/,
						reuseExistingChunk: true,
						enforce: true,
						chunks: "all",
						minSize: 0,
					},
					// Merge all the CSS into one file
					styles: {
						name: "styles",
						test: /\.s?css$/,
						reuseExistingChunk: true,
						enforce: true,
						chunks: "all",
						minSize: 0,
					},
				},
			},
			minimize: true,
			minimizer: [
				new TerserPlugin({
					cache: true,
					parallel: true,
					terserOptions: {
						output: {
							comments: false,
						},
					},
					extractComments: false,
				}),
				new OptimizeCSSAssetsPlugin({
					cssProcessor: require("postcss")([
						require("postcss-combine-media-query")({}),
						require("cssnano")({
							preset: [
								"default",
								{
									discardComments: {
										removeAll: true,
									},
									calc: false,
									zindex: false,
									autoprefixer: false,
								},
							],
						}),
						require("autoprefixer")({}),
						require("postcss-custom-properties")({}),
					]),
				}),
			],
		},
	});
} else {
	//dev only
	const WebpackNotifierPlugin = require("webpack-notifier");
	config.plugins.push(
		new HtmlWebpackPlugin({
			filename: "index.html",
			template: "src/index.original.html",
			hash: true,
		}),
		new CopyPlugin([
			{ from: "src/static/default", to: "", dot: true },
			{ from: "src/static/dev", to: "", dot: true },
		]),
		new WebpackNotifierPlugin({
			title: "Webpack Build",
			contentImage: path.join(__dirname, "src/assets/logo_vue.png"),
			alwaysNotify: true,
		})
	);
	module.exports = Object.assign({}, config, {
		devServer: {
			port: 3000,
			hot: false,
			inline: true,
			contentBase: "public",
			historyApiFallback: true,
			open: process.env.WATCH_BROWSER || true,
		},
	});
}
