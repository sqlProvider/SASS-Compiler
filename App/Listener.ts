/// <reference path="../typings/index.d.ts" />
import * as File from 'fs';
import * as Chokidar from 'chokidar';
import * as Path from 'path';
import {WatcherExceptions} from './Exceptions';

import {SASS} from './SASSCompiler'


export class WatchManager{
	mainPath: string;
	WatchList: Array<ISiteWatcher>;
	Watcher: Chokidar.IFSWatcher;
	constructor(path){
		this.mainPath = path;
		this.WatchList = [];
		
		this.RootWatcher();
	}
	RootWatcher(){
		this.Watcher = Chokidar.watch(this.mainPath)
		this.Watcher.on('addDir',(path: string, details: IChokidarDetails) =>{
			let paths = path.split('\\');
			if(paths.length == 2)
				this.WatchList[this.WatchList.length] = {
					SiteName: path[1],
					isSubDirctory: (paths.length > 2 ? true : false),
					Path: path,
					Watcher: new Watch(path),
				}
		});
	}
}


class Watch{
	Path: string;
	Watcher: Chokidar.IFSWatcher;
	Watching: boolean;
	Exception: IWatcherException;
	Event: any;
	constructor(path: string = '', start:boolean = true){
		this.Exception = {
			Status: 'FAILD'
		};
		if(!path) {
			this.Exception.Message = WatcherExceptions.InvalidPath;
			throw this.Exception;
		}
		this.Path = path;
		if(start)
			this.startWatch();
	}
	startWatch(){
		let ths = this;
		this.Watcher = Chokidar.watch(this.Path, {});
		this.Watcher.on('raw', (event, path, details) =>{
			if(this.Event)
				clearTimeout(this.Event);
			this.Event = setTimeout(function () {
				SASS.render(details.watchedPath);
			},50);
			
		});
		this.Watching = true;
	}
	stopWatch(){
		this.Watcher.unwatch(this.Path);
		this.Watching = false;
	}
}

///############################################################### Interfaces

interface ISiteWatcher{
	SiteName: string;
	Path: string;
	Watcher: Watch;
	isSubDirctory: boolean;
}
interface ISubDirectoryWatcher{
	Path: string;
	Watcher: Watch;
}

type WatcherExceptionStatus = 'OK' | 'FAILD';
interface IWatcherException{
	Status: WatcherExceptionStatus;
	Message ?: string;
}

interface IChokidarDetails{
	dev: number;
	mode: number;
	nlink: number;
	uid: number;
	gid: number;
	rdev: number;
	blksize: any;
	ino: number;
	size: number;
	blocks: any;
	atime: Date;
	mtime: Date;
	ctime: Date;
	birthtime: Date;
}