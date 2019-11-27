const qs = require('qs');
const { app, BrowserWindow, Menu, ipcMain, dialog, Tray } = require('electron');

const fs = require('fs');
const { FormData } = require('form-data');
const axios = require('axios');

const path = require('path');
const { Buffer } = require('buffer');

const isDev = require('electron-is-dev');
const log = require('electron-log');

let STORAGEOPTION = {
    protocol: 'http:',
    hostname: 'demo-ni.cloudrim.co.kr',
    port: '48080'
}

// setting log level.
log.transports.console.level='debug';
log.transports.file.level='error';


let mainWindow;
let tray = null;

let syncLocalTarget = '';
let syncCloudTarget = '';

const template = [];
const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu);


function createWindow() {
    tray = new Tray(path.join(__dirname, '../build/assets/icons/win/icon.ico'));
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
    tray.setToolTip('Rimdrive 1.0');
    tray.setContextMenu(contextMenu);

    mainWindow = new BrowserWindow({
        width: 680,
        height: 600,
        minWidth: 330,
        minHeight: 450,
        icon: path.join(__dirname, 'assets/icons/png/logo.png'),
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false
        }
    });
    mainWindow.setMenu(null);
    // mainWindow.setMenuBarVisibility(false);
    mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);

    if (isDev) {
        // Open DevTools
        // BrowserWindow.addDevToolsExtension(' ... ');
        mainWindow.webContents.openDevTools();
    }

    mainWindow.on('close', function (event) {
        if(!app.isQuiting){
            event.preventDefault();
            mainWindow.hide();
        }
        return false;
    });
    mainWindow.on('closed', () => mainWindow = null);

    mainWindow.webContents.session.on('will-download', (event, item, webContents) => {
        // Set the save path, making Electron not to prompt a save dialog.
        const cpath = item.getURL().split('&path=')[1];
        const lastPath = `${syncLocalTarget}${(cpath.substring(cpath.indexOf(syncCloudTarget) + syncCloudTarget.length)).replace(/\//g, path.sep)}`;
        log.debug('GET lastPath ::: ', lastPath);
        item.savePath = lastPath;

        item.on('updated', (event, state) => {
            if (state === 'interrupted') {
                // log.debug('Download is interrupted but can be resumed')
            } else if (state === 'progressing') {
                if (item.isPaused()) {
                    // log.debug('Download is paused')
                } else {
                    // log.debug(`Received bytes: ${item.getReceivedBytes()}`)
                }
            }
        })
        item.once('done', (event, state) => {
            if (state === 'completed') {
                // log.debug('Download successfully')
            } else {
                // log.debug(`Download failed: ${state}`)
            }
        })
    });

    ipcMain.on('set-env-config', (event, arg) => {
        log.debug('set-env-config - arg ::: ', arg);

        if(arg.protocol) {
            STORAGEOPTION.protocol = arg.protocol;
        }

        if(arg.hostname) {
            STORAGEOPTION.hostname = arg.hostname;
        }

        if(arg.port) {
            STORAGEOPTION.port = arg.port;
        }

        event.returnValue = 'SUCCESS';
    });

    ipcMain.on('sync-msg-select-folder', (event, arg) => {
        const selectedDirectory = dialog.showOpenDialogSync(mainWindow, {
            title: '폴더 선택',
            properties: ['openDirectory'],
            message: '폴더를 선택하세요'
        });

        if (selectedDirectory !== undefined && selectedDirectory.length > 0) {
            event.returnValue = selectedDirectory[0];
        } else {
            event.returnValue = null;
        }
    });

    ipcMain.on('sync-msg-select-file', (event, arg) => {
        dialog.showOpenDialog({
            title: '파일 선택',
            properties: ['openFile'],
            message: '파일를 선택하세요'
        }).then(result => {
            if (result.canceled) {
                event.returnValue = null;
            } else {
                event.returnValue = result.filePaths;
            }
        });
    });

    ipcMain.on('get-data-from-server', (event, arg) => {
        log.debug('arg ::: ', arg);
        const { net } = require('electron');
        let params = STORAGEOPTION;
        params['method'] = 'GET';
        params['path'] = `${arg.url}?${qs.stringify(arg.params)}`;

        try {
            log.debug('params ::: ', params);
            const request = net.request(params);
            request.on('response', (response) => {
                log.debug(`STATUS: ${response.statusCode}`);
                log.debug(`HEADERS: ${JSON.stringify(response.headers)}`);
                let chunks = Buffer.alloc(0);
                if (response.statusCode === 200) {
                    response.on('data', (chunk) => {
                        chunks = Buffer.concat([chunks, chunk]);
                    });
                } else {
                    event.returnValue = { 'result': 'FAIL', 'message': 'server error', 'code': response.statusCode };
                }
                response.on('end', () => {
                    try {
                        const responseObj = JSON.parse(chunks.toString());
                        event.returnValue = responseObj;
                    } catch (e) {
                        log.debug('Exception e :: ', e);
                    }

                })
            });
            request.end();
        } catch (ex) {
            // log.debug('Exception eeeeeeexxxxxxx :: ', ex);
            event.returnValue = { "status": { "result": "FAIL", "resultCode": ex, "message": "request exception" } };
        }
    });

    ipcMain.on('post-req-to-server', (event, arg) => {
        log.debug('arg ::: ', arg);
        const { net } = require('electron');
        let params = STORAGEOPTION;
        params['method'] = 'POST';
        params['path'] = `${arg.url}?${qs.stringify(arg.params)}`;

        try {
            log.debug('params ::: ', params);
            const request = net.request(params);
            request.on('response', (response) => {

                log.debug(`STATUS: ${response.statusCode}`);
                log.debug(`HEADERS: ${JSON.stringify(response.headers)}`);
                
                let chunks = Buffer.alloc(0);
                if (response.statusCode === 200) {
                    response.on('data', (chunk) => {
                        chunks = Buffer.concat([chunks, chunk]);
                    });
                } else {
                    event.returnValue = { "status": { "result": "FAIL", "resultCode": response.statusCode, "message": "server return fail" } };
                }
                response.on('end', () => {
                    try {
                        const responseObj = JSON.parse(chunks.toString());

                        log.debug('responseObj: >>> ', responseObj);
                        
                        event.returnValue = responseObj;
                    } catch (e) {
                        log.error('Exception e :: ', e);
                    }

                })
            });
            request.on('error', (error) => {
                // log.debug('[ ERROR ] :: ', error);
                event.returnValue = { "status": { "result": "FAIL", "resultCode": error, "message": "server error" } };
            });
            request.end();
        } catch (ex) {
            // log.debug('Exception eeeeeeexxxxxxx :: ', ex);
            event.returnValue = { "status": { "result": "FAIL", "resultCode": ex, "message": "request exception" } };
        }
    });

    ipcMain.on('download-cloud', (event, arg) => {
        let params = STORAGEOPTION;
        mainWindow.webContents.downloadURL(`${params.protocol}//${params.hostname}:${params.port}${arg.url}`);
    });

    ipcMain.on('upload-cloud', (event, arg) => {
        
        let params = STORAGEOPTION;

        const serverUrl = `${params.protocol}//${params.hostname}:${params.port}${arg.url}`;
        const form_data = new FormData();
        form_data.append('rimUploadFile', arg.bbFile, path.basename(arg.filePath));
        form_data.append('method', arg.method);
        form_data.append('userid', arg.userId);
        form_data.append('path', arg.path);
        // log.debug('[fileUpload] ============================== serverUrl : ', serverUrl);
        axios.post(serverUrl, form_data);

    });

    ipcMain.on('set_sync_valiable', (event, arg) => {
        syncLocalTarget = arg.localTarget;
        syncCloudTarget = arg.cloudTarget;

        event.returnValue = '1';
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    // if (process.platform === 'darwin') {
    //     app.quit();
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
    } else {
        app.quit();
    }
};


