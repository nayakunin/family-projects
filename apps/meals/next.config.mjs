import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.plugins.push(
            new MonacoWebpackPlugin({
                // available options are documented at https://github.com/microsoft/monaco-editor/blob/main/webpack-plugin/README.md#options
                languages: ['markdown'],
                features: [''],
            }),
        );
        return config;
    },
};

export default nextConfig;
