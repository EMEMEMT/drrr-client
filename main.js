const { app, BrowserWindow } = require('electron')

function createWindow () {
  const win = new BrowserWindow({
    width: 350,            // 窗口宽度，类似手机屏幕
    height: 600,           // 窗口高度
    alwaysOnTop: true,     // 【关键】开启永远置顶
    autoHideMenuBar: true, // 隐藏顶部的原生菜单栏，让界面更清爽
    webPreferences: {
      nodeIntegration: false // 加载外部网页时的标准安全设置
    }
  })

  // 让这个窗口直接加载 drrr.com
  win.loadURL('https://drrr.com')
}

// 当 Electron 初始化完成时，打开窗口
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})