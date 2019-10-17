import electron from 'electron';

import fs from 'fs';
import crypto from 'crypto';

import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

import { formatDateTime } from 'components/utils/RCCommonUtil';

const SECRET = 'rimdrivezzang';

const selectLocalFiles = (targetPath, relativePath, depth, innerItems) => {

  let dirents = fs.readdirSync(`${targetPath}${(relativePath === '') ? '' : '\\' + relativePath}`, { withFileTypes: true });

  dirents.forEach((path, i) => {
      if (path.isDirectory()) {
        const folderInfo = fs.statSync(`${targetPath}${(relativePath === '') ? '' : '\\' + relativePath}\\${path.name}`);
        innerItems.push({
          name: path.name,
          type: 'D',
          size: folderInfo.size,
          targetPath: targetPath,
          relPath: `${relativePath}\\${path.name}`,
          pathHash: crypto.createHmac('sha256', SECRET).update(`${relativePath}\\${path.name}`).digest('hex'),
          atime: formatDateTime(folderInfo.atime),
          ctime: formatDateTime(folderInfo.ctime),
          birthtime: formatDateTime(folderInfo.birthtime),
          mtime: formatDateTime(folderInfo.mtime)
        });
        // recursive
        selectLocalFiles(targetPath, `${relativePath}\\${path.name}`, depth + 1, innerItems);
      } else {
        const stats = fs.statSync(`${targetPath}${(relativePath === '') ? '' : '\\' + relativePath}\\${path.name}`);
        if(stats !== undefined) {
          innerItems.push({
            name: path.name,
            type: 'F',
            size: stats.size,
            targetPath: targetPath,
            relPath: `${relativePath}\\${path.name}`,
            pathHash: crypto.createHmac('sha256', SECRET).update(`${relativePath}\\${path.name}`).digest('hex'),
            atime: formatDateTime(stats.atime),
            ctime: formatDateTime(stats.ctime),
            birthtime: formatDateTime(stats.birthtime),
            mtime: formatDateTime(stats.mtime)
          });
        }
      }
  });
  
  return innerItems;
}

export function getLocalFiles(syncItem) {
  const files = selectLocalFiles(syncItem.local, '', 1, []);
  return files;
};

export function getCloudFiles(syncItem) {
  const files = selectLocalFiles(syncItem.cloud, '', 1, []);
  return files;
};


export function startCompareData(localDB, cloudDB, localTarget, cloudTarget) {

  return new Promise(function (resolve, reject) {

    const stateAdapter = new FileSync(`${electron.remote.app.getAppPath()}/rimdrive-state.json`);
    const stateDB = low(stateAdapter);

    // check First call : stateDB is empty
    if(stateDB.get('files').size().value() < 1) {
      // First Compare
      let innerItems = [];
      // compare data by 2 times.
      // 1. compare data with local data
      const localFiles = localDB.get('files').value();
      localFiles.forEach((n, i) => {
        const cloudFile = cloudDB.get('files').find({ pathHash: n.pathHash }).value();
        if(cloudFile === null || cloudFile === undefined) {
          // upload to cloud this file
          // ###################################################################################
          // temp : copy to cloudFolder
          // UPLOAD
          // if it is directory, make directory
          let type = '';
          if(n.type === 'D') {
            fs.mkdirSync(cloudTarget + n.relPath);
            type = 'D';
          } else {
            fs.copyFileSync(n.targetPath + n.relPath, cloudTarget + n.relPath);
            type = 'F';
          }

          innerItems.push({
            name: n.name,
            type: type,
            size: n.size,
            pathHash: n.pathHash,
            local_targetPath: localTarget,
            local_relPath: `${n.relPath}\\${n.name}`,
            local_atime: n.atime,
            local_ctime: n.ctime,
            local_birthtime: n.birthtime,
            local_mtime: n.mtime,
            cloud_targetPath: cloudTarget,
            cloud_relPath: `${n.relPath}\\${n.name}`,
            cloud_atime: n.atime,
            cloud_ctime: n.ctime,
            cloud_birthtime: n.birthtime,
            cloud_mtime: n.mtime
          });
        }
      });

      // 2. compare data with cloud data
      const cloudFiles = cloudDB.get('files').value();
      cloudFiles.forEach((n, i) => {
        const localFile = localDB.get('files').find({ pathHash: n.pathHash }).value();
        if(localFile === null || localFile === undefined) {
          // upload to cloud this file
          // ###################################################################################
          // temp : copy to localFolder
          // DOWNLOAD
          // if it is directory, make directory
          let type = '';
          if(n.type === 'D') {
            fs.mkdirSync(localTarget + n.relPath);
            type = 'D';
          } else {
            fs.copyFileSync(n.targetPath + n.relPath, localTarget + n.relPath);
            type = 'F';
          }

          innerItems.push({
            name: n.name,
            type: type,
            size: n.size,
            pathHash: n.pathHash,            
            local_targetPath: localTarget,
            local_relPath: `${n.relPath}\\${n.name}`,
            local_atime: n.atime,
            local_ctime: n.ctime,
            local_birthtime: n.birthtime,
            local_mtime: n.mtime,
            cloud_targetPath: cloudTarget,
            cloud_relPath: `${n.relPath}\\${n.name}`,
            cloud_atime: n.atime,
            cloud_ctime: n.ctime,
            cloud_birthtime: n.birthtime,
            cloud_mtime: n.mtime
          });
        }
      });

      // Create state database 
      stateDB.assign({files: innerItems}).write();

    } else {
      // compare data by 3 times.
      // 1. compare data with local data
      const localFiles = localDB.get('files').value();
      localFiles.forEach((n, i) => {
        const cloudFile = cloudDB.get('files').find({ pathHash: n.pathHash }).value();
        const stateFile = stateDB.get('files').find({ pathHash: n.pathHash }).value();
        
        if(cloudFile === null || cloudFile === undefined) {
          if(stateFile === null || stateFile === undefined) {
            // UPLOAD
            // temp copy to cloudFolder
            // let type = '';
            if(n.type === 'D') {
              fs.mkdirSync(cloudTarget + n.relPath);
              // type = 'D';
            } else {
              fs.copyFileSync(n.targetPath + n.relPath, cloudTarget + n.relPath);
              // type = 'F';
            }
          } else {
            if(n.size === stateFile.size && n.mtime === stateFile.local_mtime) {
              // DELETE LOCAL FILE
            } else {
              // UPLOAD
            }
          }
        }

        if(cloudFile !== null && cloudFile !== undefined) {
          if(stateFile === null || stateFile === undefined) {
            if(n.size === stateFile.size && n.mtime > cloudFile.mtime) {
              // UPLOAD
            } else {
              // DOWNLOAD
            }
          }
        }

        if(cloudFile !== null && cloudFile !== undefined) {
          if(stateFile !== null && stateFile !== undefined) {
            if(n.size === stateFile.size && n.mtime === stateFile.local_mtime) {
              // SKIP
            } else if(n.mtime > cloudFile.mtime) {
              // UPLOAD
            } else {
              // DOWNLOAD
            }
          }
        }
      });

      // 2. compare data with cloud data
      const cloudFiles = cloudDB.get('files').value();
      cloudFiles.forEach((n, i) => {
        const localFile = localDB.get('files').find({ pathHash: n.pathHash }).value();
        const stateFile = stateDB.get('files').find({ pathHash: n.pathHash }).value();
        
        if(localFile === null || localFile === undefined) {
          if(stateFile === null || stateFile === undefined) {
            // DOWNLOAD
          } else {
            if(n.size === stateFile.size && n.mtime === stateFile.cloud_mtime) {
              // DELETE CLOUD FILE
            } else {
              // DOWNLOAD
            }
          }
        }
      });

      // 3. compare data with state data
      const stateFiles = stateDB.get('files').value();
      stateFiles.forEach((n, i) => {
        const localFile = localDB.get('files').find({ pathHash: n.pathHash }).value();
        const cloudFile = cloudDB.get('files').find({ pathHash: n.pathHash }).value();
        
        if(localFile === null || localFile === undefined) {
          if(cloudFile === null || cloudFile === undefined) {
            // DELETE DATABASE RECORD
          }
        }
      });
    }

    let c = 0;
    for(let i = 0; i < 99999999; i++) {
      c++;
    }

    resolve(c);
  });
}

