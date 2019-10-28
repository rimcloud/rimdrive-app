import electron from 'electron';
import path from 'path';

export const getAppRoot = () => {
  // console.log('electron.remote.app.getAppPath() --------------- >> ', electron.remote.app.getAppPath());
  // console.log('process.platform ------------------------------- >> ', process.platform);

  if(electron.remote.app.getAppPath() === 'D:\\electron\\rimdrive-app') {
    return electron.remote.app.getAppPath();
  } else {
    if ( process.platform === 'win32' ) {
      return path.join( electron.remote.app.getAppPath(), '/../../../' );
    }  else {
      return path.join( electron.remote.app.getAppPath(), '/../../../../' );
    }
  }
}

export const formatDate = (date) => {
  const d = new Date(date);
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  let year = d.getFullYear();

  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;

  return [year, month, day].join('-');
}

export const formatDateTime = (date) => {
  const d = new Date(date);
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  let year = d.getFullYear();

  let hour = d.getHours();
  let minute = d.getMinutes();
  let second = d.getSeconds();

  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;
  if (hour.length < 2)
    hour = '0' + hour;
  if (minute.length < 2)
    minute = '0' + minute;
  if (second.length < 2)
    second = '0' + second;

  return [[year, month, day].join('-'), ' ', [hour, minute, second].join(':')].join('');
}

export const compareShareInfo = (former, curr) => {
  if(former !== undefined && curr !== undefined) {
    if(former.size !== curr.size) {
      return false;
    }
    // loop
    let loopResult = true;
    former.forEach(n => {
      const c = curr.find(e => (e.get('shareId') === n.get('shareId') 
          && e.get('shareTargetNo') === n.get('shareTargetNo')
          && e.get('permissions') === n.get('permissions')
          && e.get('shareWithName') === n.get('shareWithName')
          && e.get('shareWithUid') === n.get('shareWithUid')
          && e.get('targetTp') === n.get('targetTp')
      ));
      if(c === undefined) {
        loopResult = false;
        return;
      }
    });

    return loopResult;
  }

  return false;
}


