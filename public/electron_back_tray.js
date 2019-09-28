const {app, BrowserWindow, Menu, Tray} = require('electron');

const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow;
let tray = null;

function createWindow() {

    tray = new Tray(path.join(__dirname, '../build/assets/icons/win/rimdrive.ico'));
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Open Rimdrive',
            type: 'normal',
            click() {
                showRimdriveApp();
            },
        }, {
            label: 'Quit',
            type: 'normal',
            click() {
                quitRimdriveApp();
            },
        }
    ]);
    tray.setToolTip('Rimdrive 0.1');
    tray.setContextMenu(contextMenu);
    
    mainWindow = new BrowserWindow({
        width: 600,
        height: 480,
        icon: path.join(__dirname, 'assets/icons/win/rimdrive.ico'),
        webPreferences: {
            nodeIntegration: true
        }
    });
    mainWindow.setMenu(null);
    mainWindow.loadURL(isDev
        ? 'http://localhost:3000'
        : `file://${path.join(__dirname, '../build/index.html')}`);

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

const quitRimdriveApp = () => {
    if (process.platform !== 'darwin') {
        app.exit(0);
        // mainWindow.close();
    }
};

