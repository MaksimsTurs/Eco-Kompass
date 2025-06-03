"use strict"

/**
 *	@typedef {Object<string, (instance: StatixElement) => void>} Subscribers 
 *
 * 	@typedef {any | ((value: any) => any)} NewValueOrUpdateCallback
 */

import {
	popContext,
	pushContext,
} from "./StatixContext.core.js"
import {
	StatixInvalidSubscriberName,
	StatixInvalidTypeOrInstance,
	StatixTargetInInvalidPhase,
} from "./StatixErrors.core.js";
import StatixElement from "./StatixElement.core.js";

import { isFunction, isStatixElement } from "./utils/is.utils.js";

class StatixSignal {
	/**
	 *	@private
	 *	@type {any | null}
	 */
	#value = null;
	/**
	 *	@private
	 *	@type {Subscribers | null}
	 */
	#subscribers = null;
	/**
	 *	@param {any} initValue 
	 */
	constructor(initValue) {
		this.#value = initValue;
		this.#subscribers = {};
	}
	/**
	 *	@returns {any} 
	 */
	get value() {
		return this.#value;
	}
	/**
	 *	@param   {NewValueOrUpdateCallback} newValueOrCallback
	 *	@returns {void}
	 */
	set value(newValueOrCallback) {
		let tmp = null;

		if(isFunction(newValueOrCallback)) {
			tmp = newValueOrCallback(this.#value);
		} else {
			tmp = newValueOrCallback;
		}
		
		if(!Object.is(this.#value, tmp)) {
			this.#value = tmp;

			for(let subscriberName in this.#subscribers) {
				const subscriber = this.#subscribers[subscriberName][0];
				const context = this.#subscribers[subscriberName][1];

				pushContext(context);
				subscriber(context);
				popContext();
			}
		}
	}
	/**
	 * 	Subscribe to the signal and bind the subscribers to the target.
	 *	@param {StatixElement} target
	 *	@param {Subscribers[]} subscribers
	 *	@returns {void} 
	 */
	subscribe(target, ...subscribers) {
		if(!isStatixElement(target)) {
			throw new StatixInvalidTypeOrInstance(target, StatixElement, "target");
		} else if(!target.isInInitPhase) {
			throw new StatixTargetInInvalidPhase(target.renderPhaseId)
		}

		let index = 0;

		const length = subscribers.length;

		pushContext(target);

		while(index < length) {
			const subscriber = subscribers[index];

			if(!isFunction(subscriber)) {
				throw new StatixInvalidTypeOrInstance(subscriber, Function, "subscribers[index");
			} else if(!subscriber.name) {
				throw new StatixInvalidSubscriberName();
			}
			
			subscriber(target);
			this.#subscribers[subscriber.name] = [subscriber, target];

			index++;
		}

		popContext();
	}
	/**
	 * 	Remove subscribers from the subcribers list.
	 * 	@param {Subscribers[]} subscribers
	 *	@returns {void} 
	 */
	unsubscribe(...subscribers) {
		let index = 0;

		const length = subscribers.length;

		while(index < length) {
			if(!isFunction(subscribers[index])) {
				throw new StatixInvalidTypeOrInstance(subscribers[index], Function, "subscribers[index");
			} else if(!subscribers[index].name) {
				throw new StatixInvalidSubscriberName();
			}

			delete this.#subscribers[subscribers[index].name];

			index++;
		}
	}
};

export default StatixSignal;