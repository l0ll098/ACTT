module.exports = {
    maximumFileSizeToCacheInBytes: 20971520,    // 20MB
    staticFileGlobs: [
        'dist/**.html',
        'dist/**.js',
        'dist/**.css',
        "dist/**.json",
        'dist/assets/images/*',
        'dist/assets/icons/*'
    ],
    root: 'dist',
    stripPrefix: 'dist/',
    navigateFallback: '/index.html',
    runtimeCaching: [
        {
            urlPattern: /fonts\.googleapis\.com/,
            handler: "cacheFirst"
        }
    ],
    navigateFallbackWhitelist: [/^(?!\/__)/]
};
