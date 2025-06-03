import StatixElement from "./StatixElement.core.js";
import { StatixInvalidTypeOrInstance } from "./StatixErrors.core.js";

import { isStatixElement } from "./utils/is.utils.js";

let contexts = [];

export function pushContext(statixInstance) {
	if(!isStatixElement(statixInstance)) {
    throw new StatixInvalidTypeOrInstance(statixInstance, StatixElement, "statixInstance");
	}

	contexts.push(statixInstance);
};

export const popContext = () => contexts.pop();

export const getCurrContext = () => contexts.at(-1);

export const getContextCount = () => contexts.length;