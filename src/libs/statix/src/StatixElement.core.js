"use strict"

/**
 * 	@typedef {(oldChild: HTMLElement, newChild: HTMLElement) => boolean} ShouldChildChangeCallback
 * 
 * 	@typedef {Object<string, any>} MemoStorage
 * 
 * 	@typedef {Object} Metadata
 * 	@property {HTMLElement | null} mNextElement
 * 	@property {HTMLElement | null} mPrevElement
 * 
 * 	@typedef {Object<string, StatixSignal>} ElementSignals
 * 
 * 	@typedef {Object} ReplaceRootWithOptions
 * 	@property {string | undefined} selector
 * 	@property {number | number[] | undefined} at
 * 
 *	@typedef {Object} RenderOptions
 *	@property {ReplaceRootWithOptions | undefined} replaceRootWith
 */

import StatixDOM from "./StatixDOM.core.js";
import StatixSignal from "./StatixSignal.core.js";
import { StatixInvalidTypeOrInstance, StatixElementIsBinded, StatixError } from "./StatixErrors.core.js";

import {
	isHTMLFragment,
	isHTMLElement,
	isNull,
	isString,
	isUndefined,
	isStatixDOM,
	isStatixElement,
	isStatixSignal
} from "./utils/is.utils.js";
import diff from "./utils/diff.utils.js";
import define from "./utils/define.utils.js";
import getRootFromOptions from "./utils/getRootFromOptions.utils.js";

import { G_RENDERING_PHASES } from "../NUMBER.const.js";
import { G_STATIX_DATASET_BIND_ID } from "../STRING.const.js";

export const G_ROOT_ELEMENT    = Symbol("__mRoot__");
export const G_RENDER_PHASE_ID = Symbol("__mRenderPhaseId__");

// TODO: Check for memo implemintation.
class StatixElement {
	/**
	 *	@private
	 *	@type {MemoStorage | null} 
	 */
	#mMemo = null;
	/**
	 *	@private
	 *	@type {Metadata | null} 
	 */
	#mMetadata = null;
	/**
	 *	@private
	 *	@type {ElementSignals | null} 
	 */
	#mSignals = null;
	
	constructor() {
		this.#mMemo = {};
		this.#mSignals = {};
		this.#mMetadata = { mNextElement: null, mPrevElement: null };

		define(this, G_RENDER_PHASE_ID, G_RENDERING_PHASES.INIT);
		define(this, G_ROOT_ELEMENT, null);
	}
	/**
	 * 	Returns a bool value if element in "Init" phase.
	 *	@returns {boolean} 
	 */
	get isInInitPhase() {
		return this[G_RENDER_PHASE_ID] === G_RENDERING_PHASES.IDLE;
	}
	/**
	 * 	Returns a bool value if element in "Idle" phase.
	 *	@returns {boolean} 
	 */
	get isInIdlePhase() {
		return this[G_RENDER_PHASE_ID] === G_RENDERING_PHASES.IDLE;
	}
	/**
	 * 	Returns a bool value if element in "Render" phase.
	 *	@returns {boolean} 
	 */
	get isInRenderPhase() {
		return this[G_RENDER_PHASE_ID] === G_RENDERING_PHASES.RENDER;
	}
	/**
	 * 	Returns a bool value if element in "Mount" phase.
	 *	@returns {boolean} 
	 */
	get isInMountPhase() {
		return this[G_RENDER_PHASE_ID] === G_RENDERING_PHASES.MOUNT;
	}
	/**
	 * 	Returns a bool value if element in "Unmount" phase.
	 *	@returns {boolean} 
	 */
	get isInUnmountPhase() {
		return this[G_RENDER_PHASE_ID] === G_RENDERING_PHASES.UNMOUNT;
	}
	/**
	 * 	Returns a bool value if a element is mounted.
	 *	@returns {boolean} 
	 */
	get isMounted() {
		return Boolean(this[G_ROOT_ELEMENT].parentNode);
	}
	/**
	 * 	Returns the id of the rendering phase the element is currently in.
	 *	@returns {boolean} 
	 */
	get renderPhaseId() {
		return this[G_RENDER_PHASE_ID];
	}
	/**
	 *	Returns the signals.
	 *	@returns {ElementSignals} 
	 */
	get signals() {
		return this.#mSignals
	}
	/**
	 *  When only key was passed, returns a data that was saved under the passed is. 
	 *  When both params was passed, save the data under the passed key.
	 *	@param {string} key
	 *	@param {any} value 
	 *	@returns {any | void}
	 */
 	memo(key, value) {
		if(!isString(key)) {
			throw new StatixInvalidTypeOrInstance(key, String, "key");
		}
		
		if(isStatixElement(value) || isStatixDOM(value) || isStatixSignal(value)) {
			throw new StatixInvalidTypeOrInstance(value, "Any", "value");	
		}
		
		if(isUndefined(value)) {
			if(isHTMLElement(this.#mMemo[key])) {
				return this.#mMemo[key].cloneNode(true);
			}

			return this.#mMemo[key];
		}
		
		this.#mMemo[key] = value;
	}
	/**
	 *	Remove data from cache.
	 *	@param {string} key 
	 */
	unmemo(key) {
		delete this.#mMemo[key];
	}
	/**
	 *	Add a signal and save him under the passed key, this signal can be used in event listeners or rendering functions.
	 *	@param {string} key
	 *	@param {StatixSignal} signal 
	 *	@returns {void}
	 */
	addSignal(key, signal) {
		if(!isString(key)) {
			throw new StatixInvalidTypeOrInstance(key, String, "key");
		}
		
		if(!isStatixSignal(signal)) {
			throw new StatixInvalidTypeOrInstance(value, StatixSignal, "signal");	
		}

		this.#mSignals[key] = signal;
	}
	/**
	 * 	Bind the existing DOM element with StatixElement class instance.
	 *	@param {string} key
	 *	@returns {void} 
	 */
	bind(key) {
		if(!isNull(this[G_ROOT_ELEMENT]) && !isUndefined(this[G_ROOT_ELEMENT])) {
			throw new StatixElementIsBinded();
		}

		this.#setRenderPhaseId(G_RENDERING_PHASES.MOUNT);

		const maybeExistedElement = document.querySelector(`[data-${G_STATIX_DATASET_BIND_ID}="${key}"]`);

		if(!isHTMLElement(maybeExistedElement)) {
			this.#setRenderPhaseId(G_RENDERING_PHASES.IDLE);
			throw new StatixInvalidTypeOrInstance(maybeExistedElement, HTMLElement, "maybeExistedElement");
		}

		this[G_ROOT_ELEMENT] = maybeExistedElement;
		this.#mMetadata.mNextElement = this[G_ROOT_ELEMENT].nextElementSibling;
		this.#mMetadata.mPrevElement = this[G_ROOT_ELEMENT].previousElementSibling;

		this.#setRenderPhaseId(G_RENDERING_PHASES.IDLE);
	}
	/**
	 *	@returns {void} 
	 */
	mount() {
		if(!this.isMounted) {
			this.#setRenderPhaseId(G_RENDERING_PHASES.MOUNT);

			if(this.#mMetadata.mNextElement) {
				this.#mMetadata.mNextElement.insertAdjacentElement("beforebegin", this[G_ROOT_ELEMENT]);
			} else if(this.#mMetadata.mPrevElement) {
				this.#mMetadata.mPrevElement.insertAdjacentElement("afterend", this[G_ROOT_ELEMENT]);
			}

			this.#setRenderPhaseId(G_RENDERING_PHASES.IDLE);
		}
	}
	/**
	 * 	Remove element from the DOM.
	 *	@returns {void} 
	 */
	unmount() {
		if(this[G_ROOT_ELEMENT].parentNode) {
			this.#setRenderPhaseId(G_RENDERING_PHASES.UNMOUNT);
			
			this[G_ROOT_ELEMENT].remove();

			this.#setRenderPhaseId(G_RENDERING_PHASES.IDLE);
		}
	}
	/**
	 * 	Apply a changes to the root element.
	 *	@param {DocumentFragment | StatixDOM} newDOMTree
	 *	@param {RenderOptions} options
	 *	@returns {void}
	 */
	render(newElement, options) {
		if((!Object.hasOwn(options?.replaceRootWith || {}, "selector") ||
			 !Object.hasOwn(options?.replaceRootWith || {}, "at")) &&
			 isHTMLFragment(newElement)) {
			throw new StatixError('If you want to use fragment you should use the "replaceRootWith" option to set new root or use current one.');
		}
		
		this.#setRenderPhaseId(G_RENDERING_PHASES.RENDER);

		const rootElement = getRootFromOptions(this[G_ROOT_ELEMENT], options);

		if(isStatixDOM(newElement)) {
			newElement = newElement[G_ROOT_ELEMENT];
		}

		diff([rootElement], [newElement], rootElement);

		this.#setRenderPhaseId(G_RENDERING_PHASES.IDLE);
	}
	/**
	 * 	Set the render phase id.
	 *	@param {number} phaseId 
	 */
	#setRenderPhaseId(phaseId) {
		this[G_RENDER_PHASE_ID] = phaseId;
	}
}

export default StatixElement;