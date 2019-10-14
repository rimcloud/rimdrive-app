import fs from 'fs';
import { ipcRenderer } from 'electron';
import { formatDateTime } from 'components/utils/RCCommonUtil';

const selectLocalFiles = (targetPath, relativePath, depth, innerItems) => {

  let dirents = fs.readdirSync(`${targetPath}${(relativePath === '') ? '' : '\\' + relativePath}`, { withFileTypes: true });

  // `${targetPath}${(relativePath === '') ? '' : '\\' + relativePath}`
  // `${targetPath}${(relativePath === '') ? '' : '\\' + relativePath}\\${path.name}`

  dirents.map((path, i) => {
      if (path.isDirectory()) {
        const folderInfo = fs.statSync(`${targetPath}${(relativePath === '') ? '' : '\\' + relativePath}\\${path.name}`);
        // console.log('FOLDER :: ', `${targetPath}\\${path.name}`);
        // console.log('FOLDER Info :: ', folderInfo);
        
        innerItems.push({
          name: path.name,
          targetPath: targetPath,
          relPath: `${relativePath}\\${path.name}`,
          atime: formatDateTime(folderInfo.atime),
          ctime: formatDateTime(folderInfo.ctime),
          birthtime: formatDateTime(folderInfo.birthtime),
          mtime: formatDateTime(folderInfo.mtime)
        });

        selectLocalFiles(targetPath, `${relativePath}\\${path.name}`, depth + 1, innerItems);

      } else {
        // console.log('FILE :: ', `${targetPath}\\${path.name}`);
        // console.log('FILE Info :: ', fileInfo);

        // const fileInfo = fs.statSync(`${targetPath}${(relativePath === '') ? '' : '\\' + relativePath}\\${path.name}`);
        // innerItems.push({
        //   name: path.name,
        //   targetPath: targetPath,
        //   relPath: `${relativePath}\\${path.name}`,
        //   atime: formatDateTime(fileInfo.atime),
        //   ctime: formatDateTime(fileInfo.ctime),
        //   birthtime: formatDateTime(fileInfo.birthtime),
        //   mtime: formatDateTime(fileInfo.mtime)
        // });

        fs.stat(`${targetPath}${(relativePath === '') ? '' : '\\' + relativePath}\\${path.name}`, (err, stats) => {

          if(err !== null)
            console.log('err :::::::::: ', err);
          if(stats !== undefined) {
            innerItems.push({
              name: stats.name,
              targetPath: targetPath,
              relPath: `${relativePath}\\${path.name}`,
              atime: formatDateTime(stats.atime),
              ctime: formatDateTime(stats.ctime),
              birthtime: formatDateTime(stats.birthtime),
              mtime: formatDateTime(stats.mtime)
            });
          }
        });
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

export function getLocalFiles(syncItem) {
  // console.log('getLocalFiles ==>> syncItem ::: ', syncItem);

  let innerItems = [];
  console.log('START >>>> ', new Date());
  const files = selectLocalFiles(syncItem.local, '', 1, innerItems);
  return files;
};


