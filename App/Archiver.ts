/// <reference path="../typings/index.d.ts" />
import * as File from 'fs';
import * as Zipper from 'zip-folder';

export module Archiver{
	export function createArchive(sitePath) {
		var historyPath = sitePath.replace(/^Sites/, 'History');
		
		try {
			if(!File.lstatSync(historyPath).isDirectory()) throw "Directory Not Found";
		} catch (error) {
			File.mkdirSync(historyPath);
		}

		let date = new Date();
		let dateArr = [date.getFullYear(), date.getMonth(), date.getDate(), '-', date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()];
		dateArr.forEach(function (e, i) {
			if(e < 10)
				dateArr[i] = '0' + e;
			if(dateArr[i] < 100) dateArr[i] = '0' + dateArr[i];
		});

		let fileName = dateArr.join('.') + '.zip';
		Zipper(sitePath, historyPath + fileName, function(err) {});
		
	}
}