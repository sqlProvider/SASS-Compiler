/// <reference path="../typings/index.d.ts" />
import * as NodeSASS from 'node-sass';
import * as File from 'fs';
import {SassSettings} from './Configuration';
import {Archiver} from './Archiver';

export module SASS{
	export function render(path) {
		if(!path.match(/scss/)) return {
			Status: 'NOT RENDERED'
		}
		path = path.replace(/\\/g, '/');
		var directoryHierarchy = path.split('/');

		var sitePath = directoryHierarchy[0] + '/' + directoryHierarchy[1] + '/';

		let sassResult;
		try {
			sassResult = NodeSASS.renderSync({
				file: sitePath + SassSettings.StartFile,
				outputStyle: SassSettings.OutputStyle,
				outFile: sitePath + SassSettings.OutputFile,
				sourceMap: SassSettings.SourceMap
			});

			File.writeFileSync(sitePath + SassSettings.OutputFile, sassResult.css);
			File.writeFileSync(sitePath + SassSettings.OutputFile + '.map', sassResult.map);
			console.log(sassResult.stats);

			// Archive Here
			Archiver.createArchive(sitePath);
		} catch (error) {
			console.log(error.formatted || error);
			let errorCSS =  "body:after{" +
								"content: '" + (error.formatted || error).replace(/\n/g,'\\A').replace(/'/g, '') + "';" +
								"position:fixed;top: 0;left: 0;width: 100%; height: 100%; background: white; color: black; font-family: monospace;font-size: 30px; white-space:pre" +
							"}";
			File.writeFileSync(sitePath + SassSettings.OutputFile, errorCSS);
		}
		
	}
}