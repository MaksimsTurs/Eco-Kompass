/**
 *	@import { 
 *		ImportManagerModule,
 *		ImportManagerAfterWindowLoadAddedFiles
 * } from "../types.js" 
 */

import { 
	G_IMPORT_MANAGER_LAZY_MODULES_EXTENTIONS
} from "../STRINGS.const.js";

import {
	G_IMPORT_MANAGER_FILE_IS_NOT_JS
} from "../ERRORS.const.js";

import {
	G_IMPORT_MANAGER_DOT_SPLITER
} from "../REGEXPS.const.js";

/**
 *	@description Small library for management dynamic importet files.
 */
class ImportManager {
	static MODULE_EXTENTIONS = G_IMPORT_MANAGER_LAZY_MODULES_EXTENTIONS;
	/**
	 * @private
	 * @type {ImportManagerModule} 
	 */
	#modules = null;

	constructor() {
		this.#modules = {};
	}
	/**
	 *	@param {string} key 
	 *	@param {string} filePath 
	 */
	async add(key, filePath) {
		if(!(key in this.#modules)) {
			const extention = filePath.split(G_IMPORT_MANAGER_DOT_SPLITER).at(-1);

			switch(extention) {
				case "js":
					const module = await import(filePath)
			
					if(typeof module.default === "function") {
						this.#modules[key] = {...this.#modules[key], [module.default.name]: module.default };
					}
			
					this.#modules[key] = {...this.#modules[key], ...module }
			
					delete this.#modules[key]?.default
				break;
				case "css":
					this.#modules[key] = filePath;
					document.head.insertAdjacentHTML("beforeend", `<link rel="stylesheet" href="${filePath}">`);
				break;
			}
		}		
	}
	/**
	 *	@param {string} key 
	 */
	get(key) {
		return this.#modules[key];
	}
	/***
	 * @param {ImportManagerAfterWindowLoadAddedFiles} modules
	 * @description Append a collection of source files	to the DOM after DOM loaded.
	 */
	static appendSourceFileAfterPageLoad(modules) {
		window.onload = function() {
			for(let index = 0; index < modules.length; index++) {
				const [type, src] = modules[index];

				switch(type) {
					case G_IMPORT_MANAGER_LAZY_MODULES_EXTENTIONS.JS:
						document
							.head
							.insertAdjacentHTML("beforeend", `<script type="module" src="${src}"></script>`);
					break;
					case G_IMPORT_MANAGER_LAZY_MODULES_EXTENTIONS.CSS:
						document
						.head
						.insertAdjacentHTML("beforeend", `<link rel="stylesheet" href="${src}">`);
					break;
					default:
				}
			}

			window.onload = null;
		}
	}
}

export default ImportManager;