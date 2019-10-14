import fs from 'fs';
// import { drivelist } from 'drivelist';
import os from 'os';
import { ipcRenderer } from 'electron';


const selectLocalFiles = (pathString, depth) => {
  let dirents = fs.readdirSync(pathString, { withFileTypes: true });
  let innerItems = [];

  dirents.map((path, i) => {
      if (path.isDirectory()) {
        console.log('FOLDER :: ', path.name);
        innerItems.push(path.name);
        const childItem = selectLocalFiles(`${pathString}/${path.name}`, depth + 1);
      } else {
        console.log('FILE :: ', path.name);
        innerItems.push(path.name);
      }
  });
  
  return innerItems;
}

function test() {

  // const drivelist = require('drivelist');
  //const drives = drivelist.list();

  //electron.dialog.showOpenDialog({ properties: ['openFile', 'openDirectory', 'multiSelections'] });

  console.log(ipcRenderer.sendSync('sync-msg-select-folder', 'ping')) // "pong" 출력

//  console.log('drives :::: ', drives);
};

export function setLocalFilesInDatabase(syncItem) {

  console.log('setLocalFilesInDatabase ==>> syncItem ::: ', syncItem);
  console.log('setLocalFilesInDatabase ==>> syncItem.local ::: ', syncItem.local);

  test();
  



  // select local folders and files by local path info
  // const pathItems = selectLocalFiles('/test', 1);
};


