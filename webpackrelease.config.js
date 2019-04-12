const path = require("path");

module.exports = {
    mode: "release",
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
        path: path.resolve(__dirname, "dist"),
        filename: "main.js",
    },
};
