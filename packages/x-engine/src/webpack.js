const resolve = require('resolve-cwd');
const assignDeep = require('assign-deep');
const deepGet = require('./concerns/deep-get');
const formatConfig = require('./concerns/format-config');

module.exports = function() {
	// 1. try to load the application's package manifest
	const pkg = require(resolve('./package.json'));

	// 2. if we have the manifest then find the engine configuration
	const raw = deepGet(pkg, 'x-dash.engine.browser');

	if (!raw) {
		throw new Error(`x-engine requires a browser runtime to be specified. none found in ${pkg.name}`);
	}

	// 3. format the configuration we've loaded
	const config = formatConfig(raw);

	// 4. if this module is a linked dependency then resolve Webpack & runtime to CWD
	const webpackResolution = resolve('webpack');
	const runtimeResolution = resolve(config.runtime);
	const renderResolution = resolve(config.renderModule);

	const webpack = require(webpackResolution);

	return {
		apply(compiler) {
			// 5. alias the runtime name to the resolved runtime path
			assignDeep(compiler.options, {
				resolve: {
					alias: {
						[config.runtime]: runtimeResolution,
						[config.renderModule]: renderResolution,
					},
				},
			});

			const replacements = {
				'X_ENGINE_RUNTIME': `"${config.runtime}"`,
				'X_ENGINE_RESOLVE': config.factory ? `runtime["${config.factory}"]` : 'runtime',
				'X_ENGINE_COMPONENT': config.component ? `runtime["${config.component}"]` : 'null',
				'X_ENGINE_RENDER_MODULE': `"${config.renderModule}"`,
				'X_ENGINE_RENDER': config.render ? `render["${config.render}"]` : 'null',
			};

			// The define plugin performs direct text replacement
			// <https://webpack.js.org/plugins/define-plugin/>
			const define = new webpack.DefinePlugin(replacements);

			define.apply(compiler);
		}
	};
};
