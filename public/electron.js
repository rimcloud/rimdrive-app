const qs = require('qs');
const { app, BrowserWindow, ipcMain, dialog } = require('electron');

const path = require('path');
const { Buffer } = require('buffer');

const isDev = require('electron-is-dev');
const log = require('electron-log');

const STORAGEPROTOCOL = 'http:';
const STORAGEHOST = 'demo-ni.cloudrim.co.kr';
const STORAGEPORT = '48080';

const STORAGEOPTION = {
    protocol: 'http:',
    hostname: 'demo-ni.cloudrim.co.kr',
    port: '48080'
}

let mainWindow;

let syncLocalTarget = '';
let syncCloudTarget = '';

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 680,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false
        }
    });
    mainWindow.setMenu(null);
    mainWindow.setMenuBarVisibility(false);
    mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);

    if (isDev) {
        // Open DevTools
        // BrowserWindow.addDevToolsExtension(' ... ');
        mainWindow.webContents.openDevTools();
    }

    mainWindow.on('closed', () => mainWindow = null);

    mainWindow.webContents.session.on('will-download', (event, item, webContents) => {
        // Set the save path, making Electron not to prompt a save dialog.
        // item.setSavePath('/tmp/save.pdf')
        const cpath = item.getURL().split('&path=')[1];
        const lastPath = `${syncLocalTarget}${(cpath.substring(cpath.indexOf(syncCloudTarget) + syncCloudTarget.length)).replace(/\//g, path.sep)}`;
        log.info('GET lastPath ::: ', lastPath);
        item.savePath = lastPath;

        item.on('updated', (event, state) => {
            if (state === 'interrupted') {
                // console.log('Download is interrupted but can be resumed')
            } else if (state === 'progressing') {
                if (item.isPaused()) {
                    // console.log('Download is paused')
                } else {
                    // console.log(`Received bytes: ${item.getReceivedBytes()}`)
                }
            }
        })
        item.once('done', (event, state) => {
            if (state === 'completed') {
                // console.log('Download successfully')
            } else {
                // console.log(`Download failed: ${state}`)
            }
        })
    });

    // TEST electron.dialog.showOpenDialog({ properties: ['openFile', 'openDirectory', 'multiSelections'] });

    // ipcMain.on('asynchronous-message', (event, arg) => {
    //     console.log(arg)  // "ping" 출력
    //     event.sender.send('asynchronous-reply', 'pong')
    // });

    ipcMain.on('sync-msg-select-folder', (event, arg) => {
        const selectedDirectory = dialog.showOpenDialogSync(mainWindow, {
            title: '폴더 선택',
            properties: ['openDirectory'],
            message: '폴더를 선택하세요'
        });

        if (selectedDirectory != undefined && selectedDirectory.length > 0) {
            console.log('selectedDirectory[0] ----->>> ', selectedDirectory[0]);
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
        // console.log('arg ::: ', arg);
        const { net } = require('electron');
        const request = net.request({
            method: 'GET',
            url: `http://${arg.url}?${arg.params}`
        });
        request.on('response', (response) => {
            // console.log(`STATUS: ${response.statusCode}`);
            // console.log(`HEADERS: ${JSON.stringify(response.headers)}`);
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
                    console.log('Exception e :: ', e);
                }

            })
        });
        request.end();
    });

    ipcMain.on('post-req-to-server', (event, arg) => {
        // console.log('arg ::: ', arg);
        const { net } = require('electron');
        let params = STORAGEOPTION;
        params['method'] = 'POST';
        params['path'] = `${arg.url}?${qs.stringify(arg.params)}`;

        try {
            // console.log('params ::: ', params);
            const request = net.request(params);
            request.on('response', (response) => {
                // console.log(`STATUS: ${response.statusCode}`);
                // console.log(`HEADERS: ${JSON.stringify(response.headers)}`);
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
                        // console.log('responseObj: >>> ', responseObj);
                        event.returnValue = responseObj;
                    } catch (e) {
                        console.log('Exception e :: ', e);
                    }

                })
            });
            request.on('error', (error) => {
                // console.log('[ ERROR ] :: ', error);
                event.returnValue = { "status": { "result": "FAIL", "resultCode": error, "message": "server error" } };
            });
            request.end();
        } catch (ex) {
            // console.log('Exception eeeeeeexxxxxxx :: ', ex);
            event.returnValue = { "status": { "result": "FAIL", "resultCode": ex, "message": "request exception" } };
        }
    });

    ipcMain.on('download-cloud', (event, arg) => {
        mainWindow.webContents.downloadURL(arg.url);
    });

    ipcMain.on('set_sync_valiable', (event, arg) => {
        syncLocalTarget = arg.localTarget;
        syncCloudTarget = arg.cloudTarget;

        event.returnValue = '1';
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
