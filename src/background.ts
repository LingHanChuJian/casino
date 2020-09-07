'use strict'

import { fund } from '@/api'
import { ActionDetails } from '@/types/commponents'
import { dbHas, read, update, remove } from '@/utils'
import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'

const isDevelopment = process.env.NODE_ENV !== 'production'

let win: BrowserWindow | null

protocol.registerSchemesAsPrivileged([ { scheme: 'app', privileges: { secure: true, standard: true } } ])

const createWindow = (): void => {
  win = new BrowserWindow({
    width: 960,
    height: 720,
    webPreferences: {
      nodeIntegration: true,
    },
  })

  win.setMenu(null)

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
    if (!process.env.IS_TEST) { win.webContents.openDevTools() }
  } else {
    createProtocol('app')
    win.loadURL('app://./index.html')
  }

  win.on('closed', () => {
    win = null
  })
}

const monitor = (): void => {
  ipcMain.handle('casino', async (event, args) => {
    const tableData: ActionDetails = {}
    switch (args.type) {
      case 'casino-config-update-table-data':
        return read('casino_config')
      case 'casino-config':
        const config: any = Object.assign({}, args)
        delete config.type
        delete config.action
        if (args.action === 'remove') {
          remove('casino_config', config)
          tableData.status = 'success'
          tableData.message = '移除赌场配置成功'
          return tableData
        } else {
          if (args.action === 'add' && dbHas('casino_config', { code: config.code })) {
            tableData.status = 'error'
            tableData.message = `${config.code} 赌场代码存在, 无法添加!!`
            return tableData
          }
          const responseCasinoConfig = await fund({ code: config.code })
          if (responseCasinoConfig.code === 200) {
            config.title = responseCasinoConfig.data[0].name
            update('casino_config', config)
          }
          tableData.status = responseCasinoConfig.code === 200 ? 'success' : 'error'
          tableData.message = (args.action === 'add' ? '添加' : '修改') + '赌场配置' + (responseCasinoConfig.code === 200 ? '成功' : `失败: ${responseCasinoConfig.message}`)
          return tableData
        }
      case 'casino-revenue':
        let casinoConfigParams: any[] = read('casino_config')
        const responseCasinoRevenue = await fund({ code: casinoConfigParams.reduce((total, item) => total ? total + ',' + item.code! : item.code!, '') })
        if (responseCasinoRevenue.code === 200) {
          casinoConfigParams = casinoConfigParams.map((item) => {
            for (let i = 0, len = responseCasinoRevenue.data.length; i < len; i++) {
              const data = responseCasinoRevenue.data[i]
              delete data.name
              if (item.code === data.code) {
                item = Object.assign(item, data)
              }
            }
            return item
          })
          tableData.data = casinoConfigParams
        }
        tableData.status = responseCasinoRevenue.code === 200 ? 'success' : 'error'
        tableData.message = responseCasinoRevenue.code === 200 ? '更新表格成功!!' : `更新表格失败: ${responseCasinoRevenue.message}`
        return tableData
    }
  })
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

app.on('ready', async () => {
  monitor()
  createWindow()
})

if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
