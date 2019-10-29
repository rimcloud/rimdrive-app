import electron from 'electron';

import { ipcRenderer } from 'electron';

import FormData from 'form-data';
import fs from 'fs';
import axios from 'axios';
import path from 'path';
import crypto from 'crypto';

import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

import { formatDateTime } from 'components/utils/RCCommonUtil';

const SECRET = 'rimdrivezzang';

const selectLocalFiles = (targetPath, relativePath, innerItems) => {

  let dirents = fs.readdirSync(`${targetPath}${(relativePath === '') ? '' : '/' + relativePath}`, { withFileTypes: true });

  dirents.forEach((path, i) => {
    if (path.isDirectory()) {
      const folderInfo = fs.statSync(`${targetPath}${(relativePath === '') ? '' : '/' + relativePath}/${path.name}`);
      innerItems.push({
        name: path.name,
        type: 'D',
        size: folderInfo.size,
        targetPath: targetPath,
        relPath: `${relativePath}/${path.name}`,
        pathHash: crypto.createHmac('sha256', SECRET).update(`${relativePath}/${path.name}`).digest('hex'),
        // atime: formatDateTime(folderInfo.atime),
        ctime: formatDateTime(folderInfo.ctime),
        // birthtime: formatDateTime(folderInfo.birthtime),
        mtime: formatDateTime(folderInfo.mtime)
      });
      // recursive
      selectLocalFiles(targetPath, `${relativePath}/${path.name}`, innerItems);
    } else {
      const stats = fs.statSync(`${targetPath}${(relativePath === '') ? '' : '/' + relativePath}/${path.name}`);
      if (stats !== undefined) {
        innerItems.push({
          name: path.name,
          type: 'F',
          size: stats.size,
          targetPath: targetPath,
          relPath: `${relativePath}/${path.name}`,
          pathHash: crypto.createHmac('sha256', SECRET).update(`${relativePath}/${path.name}`).digest('hex'),
          // atime: formatDateTime(stats.atime),
          ctime: formatDateTime(stats.ctime),
          // birthtime: formatDateTime(stats.birthtime),
          mtime: formatDateTime(stats.mtime)
        });
      }
    }
  });

  return innerItems;
}

const selectCloudFiles = (targetPath, relativePath, innerItems) => {

  const ipcResult = ipcRenderer.sendSync('get-data-from-server', {
    url: 'demo-ni.cloudrim.co.kr:48080/vdrive/file/api/files.ros',
    params: `method=FINDFILES&userid=test01&path=${targetPath}${relativePath}`
  });

  if (ipcResult.data && ipcResult.data.length > 0) {
    ipcResult.data.forEach((cf, i) => {
      if (cf.fileType === 'D') {
        innerItems.push({
          name: cf.name,
          type: 'D',
          size: cf.size,
          targetPath: targetPath,
          relPath: `${relativePath}`,
          pathHash: crypto.createHmac('sha256', SECRET).update(`${relativePath}/${cf.name}`).digest('hex'),
          ctime: formatDateTime(cf.createDate),
          mtime: formatDateTime(cf.modifyDate)
        });
        // recursive
        selectCloudFiles(targetPath, `${relativePath}/${cf.name}`, innerItems);
      } else {
        innerItems.push({
          name: cf.name,
          type: 'F',
          size: cf.size,
          targetPath: targetPath,
          relPath: `${relativePath}`,
          pathHash: crypto.createHmac('sha256', SECRET).update(`${relativePath}/${cf.name}`).digest('hex'),
          ctime: formatDateTime(cf.createDate),
          mtime: formatDateTime(cf.modifyDate)
        });
      }
    });
  }
  return innerItems;
}

export function getLocalFiles(syncItem) {
  const files = selectLocalFiles(syncItem.local, '', []);
  return files;
};

export function getCloudFiles(syncItem) {
  const files = selectCloudFiles(`/개인저장소/모든파일${syncItem.cloud}`, '', []);
  return files;
};


const fileUpload = (localFile, cloudTarget) => {

  const serverUrl = 'http://demo-ni.cloudrim.co.kr:48080/vdrive/file/api/files.ros';
  const filePath = `${localFile.targetPath}${localFile.relPath}`;

  const bbFile = new Blob([fs.readFileSync(filePath)]);
  const form_data = new FormData();
  form_data.append('rimUploadFile', bbFile, path.basename(filePath));
  form_data.append('method', 'UPLOAD');
  form_data.append('userid', 'test01');
  form_data.append('path', encodeURI(`/개인저장소/모든파일${cloudTarget}${localFile.relPath}`));
  return axios.post(serverUrl, form_data);

}

ipcRenderer.on("download complete", (event, file) => {
  console.log("download complete =========================================", event); // Full file path
  console.log('file::: ', file); // Full file path
});

export function startCompareData(localDB, cloudDB, localTarget, cloudTarget) {

  return new Promise(function (resolve, reject) {

    const stateAdapter = new FileSync(`${electron.remote.app.getAppPath()}/rimdrive-state.json`);
    const stateDB = low(stateAdapter);

    // check First call : stateDB is empty
    if (stateDB.get('files').size().value() < 1) {
      // First Compare
      let innerItems = [];
      // compare data by 2 times.
      // 1. compare data with local data
      const localFiles = localDB.get('files').value();
      localFiles.forEach((localFile, i) => {
        const cloudFile = cloudDB.get('files').find({ pathHash: localFile.pathHash }).value();
        if (cloudFile === null || cloudFile === undefined) {
          // upload to cloud this file
          // ###################################################################################
          // temp : copy to cloudFolder
          // UPLOAD
          // if it is directory, make directory
          let type = '';
          let uploadResult = '';
          if (localFile.type === 'D') {
            type = 'D';

            // create remote folder
            const ipcResult = ipcRenderer.sendSync('get-data-from-server', {
              url: 'demo-ni.cloudrim.co.kr:48080/vdrive/file/api/files.ros',
              params: `method=MKDIR&userid=test01&path=/개인저장소/모든파일/${cloudTarget + localFile.relPath}`
            });
            if (ipcResult && ipcResult.status && ipcResult.status.result === 'SUCCESS') {
              uploadResult = 'SUCCESS';
            } else {
              uploadResult = 'FAIL';
            }

            // console.log('ipcResult >>>>>>>>>>>>>>>>>>>>> ', ipcResult);

          } else {
            type = 'F';
            // UPLOAD
            // 
            // console.log('localFile ::: ', localFile);
            // console.log('cloudTarget ::: ', cloudTarget);

            fileUpload(localFile, cloudTarget);

            // fs.copyFileSync(localFile.targetPath + localFile.relPath, cloudTarget + localFile.relPath);
          }

          innerItems.push({
            name: localFile.name,
            type: type,
            result: uploadResult,
            size: localFile.size,
            pathHash: localFile.pathHash,
            local_targetPath: localTarget,
            local_relPath: `${localFile.relPath}/${localFile.name}`,
            // local_atime: localFile.atime,
            local_ctime: localFile.ctime,
            // local_birthtime: localFile.birthtime,
            local_mtime: localFile.mtime,
            cloud_targetPath: cloudTarget,
            cloud_relPath: `${localFile.relPath}/${localFile.name}`,
            // cloud_atime: localFile.atime,
            cloud_ctime: localFile.ctime,
            // cloud_birthtime: localFile.birthtime,
            cloud_mtime: localFile.mtime
          });
        }
      });

      // 2. compare data with cloud data
      const cloudFiles = cloudDB.get('files').value();
      cloudFiles.forEach((cloudFile, i) => {
        const localFile = localDB.get('files').find({ pathHash: cloudFile.pathHash }).value();
        if (localFile === null || localFile === undefined) {
          if (cloudFile.type === 'D') {
            fs.mkdirSync(`${localTarget}${cloudFile.relPath}/${cloudFile.name}`);
            innerItems.push({
              name: cloudFile.name,
              type: 'D',
              size: cloudFile.size,
              pathHash: cloudFile.pathHash,
              local_targetPath: localTarget,
              local_relPath: `${cloudFile.relPath}/${cloudFile.name}`,
              local_ctime: cloudFile.ctime,
              local_mtime: cloudFile.mtime,
              cloud_targetPath: cloudTarget,
              cloud_relPath: `${cloudFile.relPath}/${cloudFile.name}`,
              cloud_ctime: cloudFile.ctime,
              cloud_mtime: cloudFile.mtime
            });
          }
        }
      });

      cloudFiles.forEach((cloudFile, i) => {
        const localFile = localDB.get('files').find({ pathHash: cloudFile.pathHash }).value();
        if (localFile === null || localFile === undefined) {
          if (cloudFile.type === 'F') {
            // DOWNLOAD
            const filePath = `${localTarget}${(cloudFile.relPath).split('/').join('\\')}${'\\'}`
            ipcRenderer.send("download-cloud", {
              url: `http://demo-ni.cloudrim.co.kr:48080/vdrive/file/api/files.ros?method=DOWNLOAD&userid=test01&path=${cloudFile.targetPath}${cloudFile.relPath}/${cloudFile.name}`,
              properties: {
                directory: filePath,
                targetPath: cloudFile.targetPath,
                localTarget: localTarget
              }
            });

            innerItems.push({
              name: cloudFile.name,
              type: 'F',
              size: cloudFile.size,
              pathHash: cloudFile.pathHash,
              local_targetPath: localTarget,
              local_relPath: `${cloudFile.relPath}/${cloudFile.name}`,
              local_ctime: cloudFile.ctime,
              local_mtime: cloudFile.mtime,
              cloud_targetPath: cloudTarget,
              cloud_relPath: `${cloudFile.relPath}/${cloudFile.name}`,
              cloud_ctime: cloudFile.ctime,
              cloud_mtime: cloudFile.mtime
            });
          }
        }
      });

      // Create state database 
      stateDB.assign({ files: innerItems }).write();

    } else {
      // compare data by 3 times.
      // 1. compare data with local data
      const localFiles = localDB.get('files').value();
      localFiles.forEach((localFile, i) => {
        const cloudFile = cloudDB.get('files').find({ pathHash: localFile.pathHash }).value();
        const stateFile = stateDB.get('files').find({ pathHash: localFile.pathHash }).value();

        if (cloudFile === null || cloudFile === undefined) {
          if (stateFile === null || stateFile === undefined) {
            // UPLOAD
            // temp copy to cloudFolder
            // let type = '';
            if (localFile.type === 'D') {
              fs.mkdirSync(cloudTarget + localFile.relPath);
              // type = 'D';
            } else {
              fs.copyFileSync(localFile.targetPath + localFile.relPath, cloudTarget + localFile.relPath);
              // type = 'F';
            }
          } else {
            if (localFile.size === stateFile.size && localFile.mtime === stateFile.local_mtime) {
              // DELETE LOCAL FILE
            } else {
              // UPLOAD
            }
          }
        }

        if (cloudFile !== null && cloudFile !== undefined) {
          if (stateFile === null || stateFile === undefined) {
            if (localFile.size === stateFile.size && localFile.mtime > cloudFile.mtime) {
              // UPLOAD
            } else {
              // DOWNLOAD
            }
          }
        }

        if (cloudFile !== null && cloudFile !== undefined) {
          if (stateFile !== null && stateFile !== undefined) {


// ##### localFile.mtime === stateFile.local_mtime
// state file 에 local_mtime 은 로컬 시간으로 재조정 해야 한다~~~~~~!!!!!!!!!!!!!!!!

            if (localFile.size === stateFile.size && localFile.mtime === stateFile.local_mtime) {
              // SKIP
            } else if (localFile.mtime > cloudFile.mtime) {
              // UPLOAD
            } else {
              // DOWNLOAD
            }
          }
        }
      });

      // 2. compare data with cloud data
      const cloudFiles = cloudDB.get('files').value();
      cloudFiles.forEach((cloudFile, i) => {
        const localFile = localDB.get('files').find({ pathHash: cloudFile.pathHash }).value();
        const stateFile = stateDB.get('files').find({ pathHash: cloudFile.pathHash }).value();

        if (localFile === null || localFile === undefined) {
          if (stateFile === null || stateFile === undefined) {
            // DOWNLOAD
          } else {
            if (cloudFile.size === stateFile.size && cloudFile.mtime === stateFile.cloud_mtime) {
              // DELETE CLOUD FILE
            } else {
              // DOWNLOAD
            }
          }
        }
      });

      // 3. compare data with state data
      const stateFiles = stateDB.get('files').value();
      stateFiles.forEach((stateFile, i) => {
        const localFile = localDB.get('files').find({ pathHash: stateFile.pathHash }).value();
        const cloudFile = cloudDB.get('files').find({ pathHash: stateFile.pathHash }).value();

        if (localFile === null || localFile === undefined) {
          if (cloudFile === null || cloudFile === undefined) {
            // DELETE DATABASE RECORD
          }
        }
      });
    }

  //   let c = 0;
  //   for (let i = 0; i < 99999999; i++) {
  //     c++;
  //   }

  //   resolve(c);
  });
}

