'use strict';
const path = require('path');
const {app, BrowserWindow, shell, dialog} = require('electron');
const unusedFilename = require('unused-filename');
const pupa = require('pupa');
const extName = require('ext-name');

function getFilenameFromMime(name, mime) {
	const exts = extName.mime(mime);

	if (exts.length !== 1) {
		return name;
	}

	return `${name}.${exts[0].ext}`;
}

function registerListener(session, options, cb = () => {}) {
	const downloadItems = new Set();
	let receivedBytes = 0;
	let completedBytes = 0;
	let totalBytes = 0;
	const activeDownloadItems = () => downloadItems.size;
	const progressDownloadItems = () => receivedBytes / totalBytes;

	options = Object.assign({
		showBadge: true
	}, options);

	const listener = (e, item, webContents) => {

console.log('[[ELECTRON_DL]] ===================================================================');
console.log('[[ELECTRON_DL]] will-download :item.getFilename():: ', item.getFilename());
console.log('[[ELECTRON_DL]] will-download :item.getSavePath():: ', item.getSavePath());
console.log('[[ELECTRON_DL]] will-download :item.getURL():: ', item.getURL());
console.log('[[ELECTRON_DL]] options ::: ', options);
console.log('');
console.log('>>> ', item.getURL().indexOf(encodeURI(options.targetPath)));
		const tempIndex = item.getURL().indexOf(encodeURI(options.targetPath));
		let tempPath = item.getURL().substring(tempIndex + encodeURI(options.targetPath).length);

		tempPath = tempPath.replace(/\//g, path.sep);

console.log('tempPath >> ', tempPath);
console.log('');
console.log('[[ELECTRON_DL]] will-download :item.getTotalBytes():: ', item.getTotalBytes());
console.log('[[ELECTRON_DL]] will-download :item.getReceivedBytes():: ', item.getReceivedBytes());




		downloadItems.add(item);
		totalBytes += item.getTotalBytes();

		let hostWebContents = webContents;
		if (webContents.getType() === 'webview') {
			({hostWebContents} = webContents);
		}

		const win = BrowserWindow.fromWebContents(hostWebContents);

		
console.log('[[ELECTRON_DL]] options.directory ::: ', options.directory);		
console.log('[[ELECTRON_DL]] app.getPath(downloads) ::: ', app.getPath('downloads'));

		// const dir = options.directory || app.getPath('downloads');

		const dir = options.localTarget + path.sep + tempPath;

console.log('[[ELECTRON_DL]] dir ::: ', dir);

		let filePath;
		// if (options.filename) {
		// 	filePath = path.join(dir, options.filename);
		// } else {
		// 	const filename = item.getFilename();
		// 	const name = path.extname(filename) ? filename : getFilenameFromMime(filename, item.getMimeType());

		// 	filePath = unusedFilename.sync(path.join(dir, name));
		// }

		filePath = path.normalize(dir);

		const errorMessage = options.errorMessage || 'The download of {filename} was interrupted';
		const errorTitle = options.errorTitle || 'Download Error';

		if (!options.saveAs) {
console.log('[[ELECTRON_DL]] filePath ::: ', filePath);
			item.setSavePath(filePath);
		}

		if (typeof options.onStarted === 'function') {
			options.onStarted(item);
		}

		item.on('updated', () => {
			receivedBytes = [...downloadItems].reduce((receivedBytes, item) => {
				receivedBytes += item.getReceivedBytes();
				return receivedBytes;
			}, completedBytes);

			if (options.showBadge && ['darwin', 'linux'].includes(process.platform)) {
				app.setBadgeCount(activeDownloadItems());
			}

			if (!win.isDestroyed()) {
				win.setProgressBar(progressDownloadItems());
			}

			if (typeof options.onProgress === 'function') {
				options.onProgress(progressDownloadItems());
			}
		});

		item.on('done', (event, state) => {
			console.log('[[ELECTRON_DL --- done]] =====');
			completedBytes += item.getTotalBytes();
			downloadItems.delete(item);

			if (options.showBadge && ['darwin', 'linux'].includes(process.platform)) {
				app.setBadgeCount(activeDownloadItems());
			}

			if (!win.isDestroyed() && !activeDownloadItems()) {
				win.setProgressBar(-1);
				receivedBytes = 0;
				completedBytes = 0;
				totalBytes = 0;
			}

			if (options.unregisterWhenDone) {
				session.removeListener('will-download', listener);
			}

			if (state === 'cancelled') {
				if (typeof options.onCancel === 'function') {
					options.onCancel(item);
				}
			} else if (state === 'interrupted') {
				const message = pupa(errorMessage, {filename: item.getFilename()});
				dialog.showErrorBox(errorTitle, message);
				cb(new Error(message));
			} else if (state === 'completed') {
				if (process.platform === 'darwin') {
					app.dock.downloadFinished(filePath);
				}

				if (options.openFolderWhenDone) {
					//shell.showItemInFolder(path.join(dir, item.getFilename()));
					shell.showItemInFolder(dir);
				}

				cb(null, item);
			}
		});
console.log('[[ELECTRON_DL]] =====########################################################======');		

	};

	
console.log('[[              ONONONONONONONON               ELECTRON_DL]] ONONONONONONONON ', listener);

	session.on('will-download', listener);
}

module.exports = (options = {}) => {
	app.on('session-created', session => {
console.log('[[ELECTRON_DL]] ==SESSION-CREATED !!! ==');
		registerListener(session, options);
	});
};

// TODO: Remove this for the next major release
module.exports.default = module.exports;

module.exports.download = (win, url, options) => new Promise((resolve, reject) => {
console.log('[[ELECTRON_DL]] download ::options: ', options);
	options = Object.assign({}, options, {unregisterWhenDone: true});

	registerListener(win.webContents.session, options, (err, item) => {
		if (err) {
			reject(err);
		} else {
			resolve(item);
		}
	});

	win.webContents.downloadURL(url);
});
