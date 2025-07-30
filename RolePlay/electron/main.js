const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const path = require('path')

app.commandLine.appendSwitch('js-flags', '--max-old-space-size=4096')
app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors')

let mainWindow
let imageViewerWindow = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    fullscreen: false,
    icon: path.join(__dirname, 'favicon-chaos.ico'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
      allowRunningInsecureContent: true,
      sandbox: false,
      nativeWindowOpen: true,
      enableRemoteModule: true
    }
  })

  Menu.setApplicationMenu(null);
  mainWindow.loadFile(path.join(__dirname, '../wwwroot/index.html'));
}

function createImageViewerWindow(imageUrl = null) {
  imageViewerWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    icon: path.join(__dirname, 'favicon-chaos.ico'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    }
  })

  imageViewerWindow.loadFile(path.join(__dirname, 'index-viewer.html'));

  imageViewerWindow.on('closed', () => {
    imageViewerWindow = null
  })
}

ipcMain.on('show-image', (event, imageUrl) => {
  if (!imageViewerWindow) {
    createImageViewerWindow()
  }
  
  imageViewerWindow.webContents.send('display-image', imageUrl)
  imageViewerWindow.focus()
})

app.whenReady().then(() => {
  createWindow()
  createImageViewerWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})