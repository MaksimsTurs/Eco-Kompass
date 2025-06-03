"use strict"

/**
 * 	@template K, V
 * 	@typedef {Object<K, T>} StatixKeyValue
 * 
 * 	@typedef {(HTMLElement | DocumentFragment | StatixElement | null | undefined)} StatixElementChild
 */

import appendChildWhenExist from "./utils/appendChildWhenExist.utils.js";
import define from "./utils/define.utils.js";
import { isArray } from "./utils/is.utils.js";

import StatixElement, { G_ROOT_ELEMENT } from "./StatixElement.core.js";

class StatixDOM {
	/**
	 *  @type {StatixElement}
	 *  @private
	 * 	@constant
	 */
	#mStatix = null;
	/**
	 *	@param {HTMLElement | DocumentFragment} element
	 *	@param {StatixElement}                  statixInstance
	 */
	constructor(element, statixInstance) {
		this.#mStatix = statixInstance;

		define(this, G_ROOT_ELEMENT, element);
	}
	/**
	 * 	Set a text content to the node.
	 * 	@method
	 *	@param   {string} text
	 *	@returns {StatixDOM}
	 */
	text(text) {
		this[G_ROOT_ELEMENT].textContent = text;

		return this;
	}
	/**
	 *	Set a focus to the node.
	 *	@method
	 * 	@param   {boolean}   preventScroll
	 *	@returns {StatixDOM} 
	 */
	focus(preventScroll) {
		this[G_ROOT_ELEMENT].focus({ preventScroll });

		return this;
	}
	/**
	 * 	Set a couple of styles to the node.
	 * 	@method
	 * 	@param   {StatixKeyValue<string, string>} styles
	 *	@returns {StatixDOM} 
	 */
	styles(styles) {
		for(let styleName in styles) {
			this[G_ROOT_ELEMENT].style[styleName] = styles[styleName];
		}

		return this;
	}
	/**
	 *  Set a couple of attributes to the node.
	 * 	@method
	 *	@param   {StatixKeyValue<string, string | number | symbol | boolean>} attributes 
	 *	@returns {void}
	 */
	attrs(attributes) {
		for(let attributeName in attributes) {
			this[G_ROOT_ELEMENT].setAttribute(attributeName, attributes[attributeName]);
		}

		return this;
	}
	/**
	 * 	Set a couple of dataset attributes to the node.
	 * 	@method
	 * 	@param   {StatixKeyValue<string, string | number | symbol | boolean>} datasets
	 *	@returns {StatixDOM} 
	 */
	dataset(datasets) {
		for(let datasetName in datasets) {
			this[G_ROOT_ELEMENT].setAttribute(`data-${datasetName}`, datasets[datasetName]); 
		}

		return this;
	}
	/**
	 * 	Set a statix id to the node, this id will be used by rendering function.
	 * 	@method
	 *	@param   {string | number | symbol} statixId
	 *	@returns {StatixDOM} 
	 */
	stxtid(statixId) {
		this[G_ROOT_ELEMENT].dataset.statixId = statixId;

		return this;
	}
	/**
	 * 	Set a statix id to the node, this id will be used by rendering function.
	 * 	@method
	 *	@param   {string} actionName
	 *	@returns {StatixDOM} 
	 */
	stxtaction(actionName) {
		this[G_ROOT_ELEMENT].dataset.statixAction = actionName;

		return this;
	}
	/**
	 * 	Set a couple of css classes to the node.
	 * 	@method
	 *  @param   {string[]}  classes
	 *  @returns {StatixDOM} 
	 */
	class(classes) {
		this[G_ROOT_ELEMENT].classList.add(...classes);

		return this;
	}
	/**
	 *	Add a event to the node.
	 *	@method
	 *  @param   {keyof GlobalEventHandlersEventMap}  type
	 *  @param   {EventListenerOrEventListenerObject} callback
	 *  @param   {AddEventListenerOptions}            options
	 *  @returns {StatixDOM} 
	 */
	event(type, callback, options) {
		this[G_ROOT_ELEMENT].addEventListener(type, callback.bind(null, this.#mStatix), options);

		return this;
	}
	/**
	 * 	Append a single child to the node.
	 * 	@method
	 *	@param   {StatixElementChild} child
	 *	@returns {StatixDOM} 
	 */
	child(child) {
		appendChildWhenExist(this[G_ROOT_ELEMENT], child?.[G_ROOT_ELEMENT] || child);

		return this;
	}
	/**
	 * 	Append a couple of childs to the node.
	 * 	@method
	 *	@param   {StatixElementChild[] || StatixElementChild[][]} childs
	 *	@returns {StatixDOM} 
	 */
	childs(...childs) {
		// 42.2 ms

		let outerIndex = 0;

		const outerLength = childs.length;
		const fragment = document.createDocumentFragment();
		
		while(outerIndex < outerLength) {
			if(isArray(childs[outerIndex])) {
				let innerIndex = 0;
				
				const innerLength = childs[outerIndex].length;
				
				while(innerIndex < innerLength) {
					appendChildWhenExist(fragment, childs[outerIndex][innerIndex]?.[G_ROOT_ELEMENT] || childs);
					innerIndex++;
				}
			} else {
				appendChildWhenExist(fragment, childs[outerIndex]);
			}

			outerIndex++;
		}

		this[G_ROOT_ELEMENT].appendChild(fragment);

		return this;
	}
};

export default StatixDOM;