import isFunction from "./isFunction.utils.js";

import { StatixInvalidArgumentsLength, StatixInvalidRendererName } from "../StatixErrors.js";

export function signal__val__(val) {
	return val;
}

export function signal__set__(newValueOrCallback, currSignal, statix) {
	let tmpValue = null;

	if(isFunction(newValueOrCallback)) {
		tmpValue = newValueOrCallback(currSignal[0])
	} else {
		tmpValue = newValueOrCallback;
	}

	if(!Object.is(tmpValue, currSignal[0])) {
		for(let rendererKey in currSignal[1]) {
			currSignal[1][rendererKey](statix, tmpValue, currSignal[0]);
		}

		currSignal[0] = tmpValue;
	}
}

export function signal__subscribe__(rendererMap, renderer) {
	if(!renderer.name) {
		throw new StatixInvalidRendererName(renderer.name);
	}

	if(renderer.length !== 3) {
		throw new StatixInvalidArgumentsLength(renderer.length, 3, renderer.name);
	}

	rendererMap[renderer.name] = renderer;
}

export function signal__unsubscribe__(rendererMap, renderer) {
	if(!renderer.name) {
		throw new StatixInvalidRendererName(renderer.name);
	}

	rendererMap[renderer.name] = renderer;
}

export function signal__emit__(currSignal, statix) {
	for(let rendererKey in currSignal[1]) {
		currSignal[1][rendererKey](statix, currSignal[0], currSignal[0]);
	}	
}