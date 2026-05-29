const { app, BrowserWindow } = require('electron')

function createWindow () {
  const win = new BrowserWindow({
    width: 350,            // 窗口宽度
    height: 600,           // 窗口高度
    alwaysOnTop: true,
    autoHideMenuBar: true, 
    webPreferences: {
      nodeIntegration: false 
    }
  })

  // 加载 drrr.com
  win.loadURL('https://drrr.com')
}

// Electron 初始化完成时，打开窗口
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