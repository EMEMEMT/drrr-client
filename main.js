const { app, BrowserWindow, globalShortcut } = require('electron')
const fs = require('fs')     // 文件系统模块
const path = require('path') // 路径处理模块

let win;

function createWindow () {
  win = new BrowserWindow({
    width: 350,
    height: 600,
    alwaysOnTop: true,
    autoHideMenuBar: true,
    opacity: 0.99,
    webPreferences: {
      nodeIntegration: false
    }
  })

  win.loadURL('https://drrr.com')

  // 监听网页加载完成的事件
  win.webContents.on('did-finish-load', () => {
    const cssPath = path.join(__dirname, 'style.css')
    const cssCode = fs.readFileSync(cssPath, 'utf8')
    win.webContents.insertCSS(cssCode).then(() => {
        console.log('自定义 CSS 注入成功！')
    })

    const jsCode = `
      if (!document.getElementById('zen-mode-btn')) {
        const btn = document.createElement('div');
        btn.id = 'zen-mode-btn';
        
        const iconEnter = '<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 14 10 14 10 20"></polyline><polyline points="20 10 14 10 14 4"></polyline><line x1="14" y1="10" x2="21" y2="3"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>';
        
        const iconExit = '<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>';

        btn.innerHTML = iconEnter;
        btn.title = '切换极简输入模式';
        
        document.body.appendChild(btn);

        btn.onclick = () => {
          document.body.classList.toggle('mini-input-mode');
          if (document.body.classList.contains('mini-input-mode')) {
            btn.innerHTML = iconExit;
          } else {
            btn.innerHTML = iconEnter;
          }
        };
      }
    `;
    win.webContents.executeJavaScript(jsCode);
  })

  win.on('resize', () => {
    // 获取当前窗口的宽高
    const [currentWidth, currentHeight] = win.getSize()
    
    let zoomRatio = currentWidth / 350
    
    if (zoomRatio < 0.4) zoomRatio = 0.4
    if (zoomRatio > 2.0) zoomRatio = 2.0
    
    // 强行设置网页的缩放比例
    win.webContents.setZoomFactor(zoomRatio)
  })
}

app.whenReady().then(() => {
  createWindow()

  globalShortcut.register('CommandOrControl+Shift+D', () => {
    if (win.isVisible()) {
      win.hide()
    } else {
      win.show()
    }
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})