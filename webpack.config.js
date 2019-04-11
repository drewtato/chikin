const path = require("path");

module.exports = {
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
        path: path.resolve(__dirname, "release"),
        filename: "main.js",
    },
    mode: "development",
};
