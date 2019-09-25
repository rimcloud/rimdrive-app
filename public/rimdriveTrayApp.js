const {app, BrowserWindow, Menu, Tray} = require('electron');

const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow;
let tray = null;

function createWindow() {

    tray = new Tray('public/favicon.ico');
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Open Rimdrive',
            type: 'normal',
            click() {
                showRimdriveApp();
            },
        }, {
            label: 'Item2',
            type: 'radio'
        }
    ]);
    tray.setToolTip('Rimdrive 0.1');
    tray.setContextMenu(contextMenu);
    
    mainWindow = new BrowserWindow({
        width: 600,
        height: 480,
        webPreferences: {
            nodeIntegration: true
        }
    });
    mainWindow.setMenu(null);
    mainWindow.loadURL(isDev
        ? 'http://localhost:3000'
        : `file://${path.join(__dirname, '../build/index,html')}`);

    if (isDev) {
        // Open DevTools BrowserWindow.addDevToolsExtension(' ... ');
        mainWindow
            .webContents
            .openDevTools();
    }

    mainWindow.on('close', function (event) {
        if(!app.isQuiting){
            event.preventDefault();
            mainWindow.hide();
        }
        return false;
    });

    mainWindow.on('closed', () => mainWindow = null);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    console.log('window-all-closed');
    // if (process.platform !== 'darwin') {
    //     app.hide();
    // }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});


const showRimdriveApp = () => {
    mainWindow.show();
};