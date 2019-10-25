
const { app, BrowserWindow, ipcMain, dialog } = require('electron');

const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 600,
        height: 480,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false
        }
    });
    mainWindow.setMenu(null);
    mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);

    if (isDev) {
        // Open DevTools
        // BrowserWindow.addDevToolsExtension(' ... ');
        mainWindow.webContents.openDevTools();
    }

    mainWindow.on('closed', () => mainWindow = null);

    // TEST electron.dialog.showOpenDialog({ properties: ['openFile', 'openDirectory', 'multiSelections'] });

    // ipcMain.on('asynchronous-message', (event, arg) => {
    //     console.log(arg)  // "ping" 출력
    //     event.sender.send('asynchronous-reply', 'pong')
    // });

    ipcMain.on('sync-msg-select-folder', (event, arg) => {
        dialog.showOpenDialog({
            title: '폴더 선택',
            properties: ['openDirectory'],
            message: '폴더를 선택하세요'
        }).then(result => {
            if (result.canceled) {
                event.returnValue = null;
            } else {
                event.returnValue = result.filePaths;
            }
        });
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
        console.log('arg ::: ', arg);
        const { net } = require('electron');
        const request = net.request({
            method: 'GET',
            url: `http://${arg.url}?${arg.params}`
        });
        request.on('response', (response) => {
            // console.log(`STATUS: ${response.statusCode}`);
            // console.log(`HEADERS: ${JSON.stringify(response.headers)}`);
            if(response.statusCode === 200) {
                response.on('data', (chunk) => {
                    const responseObj = JSON.parse(chunk.toString());
                    console.log('responseObj (BODY) : ', responseObj);
                    event.returnValue = responseObj;
                    // if(responseObj && responseObj.status && responseObj.status.result === 'SUCCESS') {
                    //     event.returnValue = {'result': 'SUCCESS', 'message': responseObj.status.message};
                    // } else {
                    //     event.returnValue = {'result': 'FAIL', 'message': responseObj.status.message};
                    // }
                })
            } else {
                event.returnValue = {'result': 'FAIL', 'message': 'server error', 'code': response.statusCode};
            }
            response.on('end', () => {
                console.log('No more data in response.')
            })
        });
        request.end();
    });

    ipcMain.on('login-to-server', (event, arg) => {
        console.log('arg ::: ', arg);
        const { net } = require('electron');
        // const qs = require('qs');
        const request = net.request({
            method: 'GET',
            url: `http://demo-ni.cloudrim.co.kr:48080/vdrive/api/login.ros?userid=${arg.userId}&passwd=${arg.password}`
        });
        request.on('response', (response) => {
            // console.log(`STATUS: ${response.statusCode}`);
            // console.log(`HEADERS: ${JSON.stringify(response.headers)}`);
            if(response.statusCode === 200) {
                response.on('data', (chunk) => {
                    const responseObj = JSON.parse(chunk.toString());
                    // console.log('responseObj (BODY) : ', responseObj);
                    if(responseObj && responseObj.status && responseObj.status.result === 'SUCCESS') {
                        event.returnValue = {'result': 'SUCCESS', 'message': responseObj.status.message};
                    } else {
                        event.returnValue = {'result': 'FAIL', 'message': responseObj.status.message};
                    }
                })
            } else {
                event.returnValue = {'result': 'FAIL', 'message': 'server error', 'code': response.statusCode};
            }
            response.on('end', () => {
                console.log('No more data in response.')
            })
        });
        // request.write(qs.stringify({
        //     'userid': arg.userId,
        //     'passwd': arg.password
        // }));
        request.end();
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


