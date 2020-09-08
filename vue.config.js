module.exports = {
    css: {
        loaderOptions: {
            stylus: {
                import: '~@/assets/css/loader.styl',
            },
        },
    },
    pluginOptions: {
        electronBuilder: {
            nodeIntegration: true,
            builderOptions: {
                publish: ['github'],
                productName: 'casino',
                appId: 'com.electron.casino',
                win: {
                    icon: 'public/icon.ico',
                    target: [ 'nsis' ]
                },
                nsis: {
                    oneClick: false,
                    perMachine: true,
                    allowToChangeInstallationDirectory: true,
                    deleteAppDataOnUninstall: false,
                    shortcutName: 'casino',
                    artifactName: 'casino_setup_${version}.${ext}'
                }
            }
        }
    }
}
