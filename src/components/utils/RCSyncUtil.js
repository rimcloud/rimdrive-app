import fs from 'fs';

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

export function setLocalFilesInDatabase(syncItem) {

  console.log('setLocalFilesInDatabase ==>> syncItem ::: ', syncItem);
  console.log('setLocalFilesInDatabase ==>> syncItem.local ::: ', syncItem.local);

  // select local folders and files by local path info
  const pathItems = selectLocalFiles('/test', 1);
};


