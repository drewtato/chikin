const path = require("path");

module.exports = {
    mode: "development",
    devtool: "inline-source-map",
    devServer: {
        contentBase: "./dev",
        port: "5501",
        inline: false,
        open: true,
    },
    resolve: {
        extensions: [".ts"]
    },
    module: {
        rules: [
            {
                test: /\.ts/,
                loader: "awesome-typescript-loader"
            }
        ]
    },
    entry: "./src/index.ts",
    output: {
        path: path.resolve(__dirname, "dev"),
        filename: "main.js",
    },
};
