"use strict"

import StatixElement, { G_ROOT_ELEMENT } from "./StatixElement.core.js";
import { StatixInvalidTypeOrInstance } from "./StatixErrors.core.js";

import { 
	isStatixElement, 
	isFunction, 
	isString, 
	isBoolean, 
	isObject, 
	isUndefined 
} from "./utils/is.utils.js";

const G_MEMO_CACHE = {};

/**
 *	@typedef {(...any) => any} StatixDelayCallback
 *	Function that will be executed after some delay. 
 */

const utils = {
	/**
	 * 	Generate random string value.
	 *	@returns {string} 
	 */
	generateRandomValue: function() {
		let string = "";
		
		const ASCII = "!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}~";
	
		string += (~~(Math.random() * 100)).toString(16);
		string += ASCII[~~(Math.random() * ASCII.length)];
		
		string += (~~(Math.random() * 100)).toString(16);
		string += ASCII[~~(Math.random() * ASCII.length)];
		
		string += (~~(Math.random() * 100)).toString(16);
		string += ASCII[~~(Math.random() * ASCII.length)];

		string += (~~(Math.random() * 100)).toString(16);
		string += ASCII[~~(Math.random() * ASCII.length)];
	
		return string;
	},
  /**
	 *	@param  {StatixDelayCallback} callback
	 *	@param  {number} 							delay
	 *	@return {StatixDelayCallback}
	 */
	debounce(callback, delay) {
		let timerId = 0;

		return function(...args) {
			clearTimeout(timerId);
			timerId = setTimeout(() => callback(...args), delay);
		}
	},
  /**
	 *	@param  {StatixDelayCallback} callback
	 *	@param  {number} 							delay
	 *	@return {StatixDelayCallback}
	 */
	throttle(callback, delay) {
		let timerId = null;

		return function(...args) {
			if(!timerId) {
				callback(...args);
				timerId = setTimeout(() => {
					timerId = null;
				}, delay);
			}
		}
	},
	/**
	 *	@param   {StatixElement}                              statixInstance
	 * 	@param   {keyof GlobalEventHandlersEventMap}          type
	 *	@param   {EventListenerOrEventListenerObject}         handler
	 *	@param   {EventListenerOptions | undefined | boolean} options
	 *	@returns {void}
	 */
	delegateEvent(statixInstance, type, handler, options) {
		if(!isStatixElement(statixInstance)) {
			throw new StatixInvalidTypeOrInstance(statixInstance, StatixElement, "statixInstance");
		}

		if(!isString(type)) {
			throw new StatixInvalidTypeOrInstance(type, String, "type");
		}

		if(!isFunction(handler)) {
			throw new StatixInvalidTypeOrInstance(handler, Function, "handler");
		}

		if(!isUndefined(options) && (!isObject(options) || isBoolean(options))) {
			throw new StatixInvalidTypeOrInstance(options, "Undefined | Object | Boolean", "options");
		}

		statixInstance[G_ROOT_ELEMENT].addEventListener(type, (event) => {
			if(event.target.dataset.statixAction) {
				handler({ type: event.target.dataset.statixAction, signals: statixInstance.signals, event });
			}
		}, options);
	}
}

export default utils;