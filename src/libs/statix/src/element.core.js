import { isString, isUndefined } from "./utils/is.utils.js";

import StatixElement, { G_ROOT_ELEMENT } from "./StatixElement.core.js";
import StatixDOM from "./StatixDOM.core.js";
import { StatixInvalidTypeOrInstance } from "./StatixErrors.core.js";
import { getCurrContext } from "./StatixContext.core.js";

export function fragment() {
	const currContext = getCurrContext();

	if(isUndefined(currContext)) {
		throw new StatixInvalidTypeOrInstance(currContext, StatixElement, "currContext");
	}

	return new StatixDOM(document.createDocumentFragment(), currContext);
}

export function root() {
	const currContext = getCurrContext();

	if(isUndefined(currContext)) {
		throw new StatixInvalidTypeOrInstance(currContext, StatixElement, "currContext");
	}

	return new StatixDOM(currContext[G_ROOT_ELEMENT].cloneNode(false), currContext);
}

export function tag(tagName) {
	const currContext = getCurrContext();

	if(!isString(tagName)) {
		throw new StatixInvalidTypeOrInstance(tagName, String, "tagName");
	}

	if(isUndefined(currContext)) {
		throw new StatixInvalidTypeOrInstance(currContext, StatixElement, "currContext");
	}

	return new StatixDOM(document.createElement(tagName), currContext);
}