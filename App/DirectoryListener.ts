/// <reference path="../typings/index.d.ts" />
import * as File from 'fs';

export class SitesWatcher{
	constructor(path){
		var ths: Object = this;
		File.watch(path, (event, filename) => {
			console.log(event + ' =>' + filename);
		});
	}
}
