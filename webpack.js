const path = require('path'),
    webpack = require('webpack');

module.exports = {
    entry: 'scripts/main.js',
    resolve: {
        // options for resolving module requests
        // (does not apply to resolving to loaders)

        modules: [
            "node_modules",
            path.resolve(__dirname, "src")
        ],
    },
    output: {
        path: path.resolve(__dirname, ".tmp/scripts"),
        filename: "bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                loader: 'babel-loader',
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            jQuery: 'jquery',
            $: 'jquery',
        }),
    ],
    externals: {
        jQuery: 'jQuery',
        $: 'jQuery'
    },
};
