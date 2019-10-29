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
  const filePath = path.normalize(localFile.targetPath + localFile.relPath);
// console.log('fileupload == filePath :: ', filePath);
  const bbFile = new Blob([fs.readFileSync(filePath)]);
  const form_data = new FormData();
  form_data.append('rimUploadFile', bbFile, path.basename(filePath));
  form_data.append('method', 'UPLOAD');
  form_data.append('userid', 'test01');
  form_data.append('path', encodeURI(`/개인저장소/모든파일${cloudTarget}${localFile.relPath}`));
  return axios.post(serverUrl, form_data);
}

const fileDownload = (cloudFile, localTarget) => {
  const filePath = `${localTarget}${(cloudFile.relPath).split('/').join('\\')}${'\\'}`
  ipcRenderer.send("download-cloud", {
    url: `http://demo-ni.cloudrim.co.kr:48080/vdrive/file/api/files.ros?method=DOWNLOAD&userid=test01&path=${cloudFile.targetPath}${cloudFile.relPath}/${cloudFile.name}`,
    properties: {
      directory: filePath,
      targetPath: cloudFile.targetPath,
      localTarget: localTarget
    }
  });
}

ipcRenderer.on("download complete", (event, file) => {
  // console.log("download complete =========================================", event); // Full file path
  // console.log('file::: ', file); // Full file path
});

const createCloudFolder = (cloudTarget, localFile) => {
  const ipcResult = ipcRenderer.sendSync('get-data-from-server', {
    url: 'demo-ni.cloudrim.co.kr:48080/vdrive/file/api/files.ros',
    params: `method=MKDIR&userid=test01&path=/개인저장소/모든파일/${cloudTarget + localFile.relPath}`
  });
  if (ipcResult && ipcResult.status && ipcResult.status.result === 'SUCCESS') {
    // uploadResult = 'SUCCESS';
  } else {
    // uploadResult = 'FAIL';
  }
}

const deleteCloudFolder = (cloudTarget, cloudFile) => {
  const ipcResult = ipcRenderer.sendSync('get-data-from-server', {
    url: 'demo-ni.cloudrim.co.kr:48080/vdrive/file/api/files.ros',
    params: `method=DELDIR&userid=test01&path=/개인저장소/모든파일/${cloudTarget + cloudFile.relPath}`
  });
  if (ipcResult && ipcResult.status && ipcResult.status.result === 'SUCCESS') {
    // uploadResult = 'SUCCESS';
  } else {
    // uploadResult = 'FAIL';
  }
}

const deleteCloudFile = (cloudTarget, cloudFile) => {
  const ipcResult = ipcRenderer.sendSync('get-data-from-server', {
    url: 'demo-ni.cloudrim.co.kr:48080/vdrive/file/api/files.ros',
    params: `method=DELFILE&userid=test01&path=/개인저장소/모든파일/${cloudTarget + cloudFile.relPath}`
  });
  if (ipcResult && ipcResult.status && ipcResult.status.result === 'SUCCESS') {
    // uploadResult = 'SUCCESS';
  } else {
    // uploadResult = 'FAIL';
  }
}

const deleteFolderRecursive = (path) => {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}

const createStateItem = (file, localTarget, cloudTarget) => {
  return {
    name: file.name,
    type: file.type,
    size: file.size,
    pathHash: file.pathHash,
    local_targetPath: localTarget,
    local_relPath: `${file.relPath}/${file.name}`,
    local_ctime: file.ctime,
    local_mtime: file.mtime,
    cloud_targetPath: cloudTarget,
    cloud_relPath: `${file.relPath}/${file.name}`,
    cloud_ctime: file.ctime,
    cloud_mtime: file.mtime
  }
}

const syncLocalToCloud = (localFile, cloudTarget) => {
  if (localFile.type === 'D') {
    // CREATE FOLDER TO CLOUD
    createCloudFolder(cloudTarget, localFile);
  } else {
    // UPLOAD FILE TO CLOUD
    fileUpload(localFile, cloudTarget);
  }
}

const syncLocalDelete = (localFile) => {
  if (localFile.type === 'D') {
    // DELETE LOCAL FOLDER
    deleteFolderRecursive(path.normalize(localFile.targetPath + localFile.relPath));
  } else {
    // DELETE LOCAL FILE
    fs.unlinkSync(path.normalize(localFile.targetPath + localFile.relPath));
  }              
}

const syncCloudToLocal = (cloudFile, localTarget) => {
  if (cloudFile.type === 'D') {
    // CREATE FOLDER TO LOCAL
    fs.mkdirSync(`${localTarget}${cloudFile.relPath}/${cloudFile.name}`);
  } else {
    // DOWNLOAD FILE TO CLOUD
    fileDownload(cloudFile, localTarget);
  }
}

const syncCloudDelete = (cloudFile, cloudTarget) => {
  if (cloudFile.type === 'D') {
    // DELETE CLOUD FOLDER
    deleteCloudFolder(cloudTarget, cloudFile);
  } else {
    // DELETE CLOUD FILE
    deleteCloudFile(cloudTarget, cloudFile);
  }              
}


export function startCompareData(localDB, cloudDB, localTarget, cloudTarget) {

  return new Promise(function (resolve, reject) {

    const stateAdapter = new FileSync(`${electron.remote.app.getAppPath()}/rimdrive-state.json`);
    const stateDB = low(stateAdapter);

    // check First call : stateDB is empty
    if (stateDB.get('files').size().value() < 1) {
      
      let innerItems = [];
      // compare data by two times.

      // ##[1]##########################################################################################
      // 1. compare data with local data
      const localFiles = localDB.get('files').value();
      localFiles.forEach((localFile, i) => {
        const cloudFile = cloudDB.get('files').find({ pathHash: localFile.pathHash }).value();
        if (cloudFile === null || cloudFile === undefined) {
          // LOCAL => CLOUD    // 클라우드데이터에는 없음. 클라우드에 폴더 생성 또는 파일업로드
          syncLocalToCloud(localFile, cloudTarget);
          innerItems.push(createStateItem(localFile, localTarget, cloudTarget));
        }
      });

      // ##[2]##########################################################################################
      // 2. compare data with cloud data
      const cloudFiles = cloudDB.get('files').value();
      // [폴더]
      cloudFiles.forEach((cloudFile, i) => {
        const localFile = localDB.get('files').find({ pathHash: cloudFile.pathHash }).value();
        if (localFile === null || localFile === undefined) {
          if (cloudFile.type === 'D') {
            // CLOUD => LOCAL
            syncCloudToLocal(cloudFile, localTarget);
            innerItems.push(createStateItem(cloudFile, localTarget, cloudTarget));
          }
        }
      });
      // [파일]
      cloudFiles.forEach((cloudFile, i) => {
        const localFile = localDB.get('files').find({ pathHash: cloudFile.pathHash }).value();
        if (localFile === null || localFile === undefined) {
          if (cloudFile.type === 'F') {
            // CLOUD => LOCAL
            syncCloudToLocal(cloudFile, localTarget);
            innerItems.push(createStateItem(cloudFile, localTarget, cloudTarget));
          }
        }
      });

      // Create state database 
      stateDB.assign({ files: innerItems }).write();

    } else {

      let innerItems = [];
      // compare data by three times.

      // ##[1]##########################################################################################
      // 1. compare data with local data
      const localFiles = localDB.get('files').value();
      localFiles.forEach((localFile, i) => {

        // ##### localFile.mtime === stateFile.local_mtime
        // state file 에 local_mtime 은 로컬 시간으로 재조정 해야 한다~~~~~~!!!!!!!!!!!!!!!!

        // console.log('======================================================');
        // console.log(' :: localFile :: ', localFile);
        // console.log(' :: localFile path :: ', path.normalize(localFile.targetPath + localFile.relPath));
        // console.log('======================================================');
        
        const cloudFile = cloudDB.get('files').find({ pathHash: localFile.pathHash }).value();
        const stateFile = stateDB.get('files').find({ pathHash: localFile.pathHash }).value();

        if (cloudFile === null || cloudFile === undefined) {
          // 클라우드데이터에 없다
          if (stateFile === null || stateFile === undefined) {
            // 작업데이터에 없다 - 로컬에 신규로 생긴 데이터
            // LOCAL => CLOUD
            syncLocalToCloud(localFile, cloudTarget);
            innerItems.push(createStateItem(localFile, localTarget, cloudTarget));
          } else {
            // 작업데이터에는 있다 - 삭제 또는 클라우드에 생성
            if (localFile.size === stateFile.size && localFile.mtime === stateFile.local_mtime) {
              // 로컬데이터와 작업데이터가 같은면 로컬 삭제
              // LOCAL DELETE
              syncLocalDelete(localFile);
            } else {
              // LOCAL => CLOUD
              syncLocalToCloud(localFile, cloudTarget);
              innerItems.push(createStateItem(localFile, localTarget, cloudTarget));
            }
          }
        } else {
          // 로컬데이터와 클라우드데이터가 같다
          if (stateFile === null || stateFile === undefined) {
            // 작업데이터에는 없다 (즉, 로컬과 클라우드의 각각 새롭게 생성되었음)
            if (localFile.mtime > cloudFile.mtime) {
              // 로컬데이터가 최신이므로 클라우드에 폴더 생성 또는 파일 업로드
              // LOCAL => CLOUD
              syncLocalToCloud(localFile, cloudTarget);
              innerItems.push(createStateItem(localFile, localTarget, cloudTarget));
            } else {
              // 클라우드데이터가 최신이므로 로컬에 폴더 생성 또는 파일 다운로드
              // CLOUD => LOCAL
              syncCloudToLocal(cloudFile, localTarget);
              innerItems.push(createStateItem(cloudFile, localTarget, cloudTarget));
            }
          } else {
            // 작업데이터에도 있다 (즉, 로컬과 클라우드의 각각 비교후 처리여부 확인)
            if (localFile.size === stateFile.size && localFile.mtime === stateFile.local_mtime) {
              // 동기화 되어 있는 상태, 작업 필요 없음
            } else if (localFile.mtime > cloudFile.mtime) {
               // 로컬데이터가 최신이므로 클라우드에 폴더 생성 또는 파일 업로드
              // LOCAL => CLOUD
              syncLocalToCloud(localFile, cloudTarget);
              innerItems.push(createStateItem(localFile, localTarget, cloudTarget));
            } else {
              // 클라우드데이터가 최신이므로 로컬에 폴더 생성 또는 파일 다운로드
              // CLOUD => LOCAL
              syncCloudToLocal(cloudFile, localTarget);
              innerItems.push(createStateItem(cloudFile, localTarget, cloudTarget));
            }
          }
        }
      });

      // ##[2]##########################################################################################
      // 2. compare data with cloud data
      const cloudFiles = cloudDB.get('files').value();
      cloudFiles.forEach((cloudFile, i) => {

        const localFile = localDB.get('files').find({ pathHash: cloudFile.pathHash }).value();
        const stateFile = stateDB.get('files').find({ pathHash: cloudFile.pathHash }).value();

        if (localFile === null || localFile === undefined) {
          // 로컬데이터에 없다
          if (stateFile === null || stateFile === undefined) {
            // 작업데이터에도 없다 (클라우드에 새로생긴 정보, 폴더생성, 파일 다운로드 필요)
              // CLOUD => LOCAL
              syncCloudToLocal(cloudFile, localTarget);
              innerItems.push(createStateItem(cloudFile, localTarget, cloudTarget));
          } else {
            // 작업데이터에는 있다. (클라우드에만 있음, 비교후 클라우드 삭제 또는 다운로드)
            if (cloudFile.size === stateFile.size && cloudFile.mtime === stateFile.cloud_mtime) {
              // 클라우드데이터가 오래된 정보 클라우드 삭제 // DELETE CLOUD FILE
              syncCloudDelete(cloudFile, cloudTarget);
            } else {
              // 클라우드데이터가 최신임으로 다운로드 // DOWNLOAD TO LOCAL
              // CLOUD => LOCAL
              syncCloudToLocal(cloudFile, localTarget);
              innerItems.push(createStateItem(cloudFile, localTarget, cloudTarget));
            }
          }
        }
      });

      // ##[3]##########################################################################################
      // 3. compare data with state data
      const stateFiles = stateDB.get('files').value();
      stateFiles.forEach((stateFile, i) => {

        const localFile = localDB.get('files').find({ pathHash: stateFile.pathHash }).value();
        const cloudFile = cloudDB.get('files').find({ pathHash: stateFile.pathHash }).value();

        if (localFile === null || localFile === undefined) {
          // 로컬데이터에 없다
          if (cloudFile === null || cloudFile === undefined) {
            // 클라우드데이터에도 없다
            // 작업데이터에서 삭제 // DELETE DATABASE RECORD
          }
        }
      });

      // RE-Create state database 
      stateDB.set({ files: []}).assign({ files: innerItems }).write();
    }

  //   let c = 0;
  //   for (let i = 0; i < 99999999; i++) {
  //     c++;
  //   }

  //   resolve(c);
  });
}

