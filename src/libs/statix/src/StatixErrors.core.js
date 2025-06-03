import { isFunction, isObject } from "./utils/is.utils.js";

import { G_STATIX_RENDER_PHASE_NAMES } from "../STRING.const.js";

class StatixInvalidTypeOrInstance extends Error {
	constructor(currObject, mustBe, were) {
		super();

		this.name = "[Statix]";

		if(isFunction(mustBe)) {
			mustBe = mustBe.name;
		}

		if(currObject?.constructor.name) {
			currObject = currObject.constructor.name;
		} else if(isObject(currObject)) {
			currObject = currObject.toString().replace(/\[object (.*)\]/, "$1");
		}

		this.message = `"${were}" must be type of or instance of "${mustBe}" but is "${currObject}"!`;
	}
};

class StatixInvalidKey extends Error {
	constructor(currKey, description) {
		super();

		this.name = "[Statix]";
		this.message = `"${currKey}" is not valid, ${description}!`;
	}
};

class StatixTargetInInvalidPhase extends Error {
	constructor(phaseId) {
		super();

		this.name = "[Statix]";
		this.message = `Target is in \"${G_STATIX_RENDER_PHASE_NAMES[phaseId]}\" phase!`;
	}
};

class StatixInvalidSubscriberName extends Error {
	constructor() {
		super();

		this.name = "[Statix]";
		this.message = `Subscriber have invalid name!`;
	}
};

class StatixElementIsBinded extends Error {
	constructor() {
		super();

		this.name = "[Statix]";
		this.message = "Statix element is binded!";
	}
};

class StatixError extends Error {
	constructor(message) {
		super();

		this.name = "[Statix]"
		this.message = message;
	}
}

export { 
	StatixInvalidSubscriberName,
	StatixInvalidTypeOrInstance,
	StatixTargetInInvalidPhase,
	StatixElementIsBinded,
	StatixInvalidKey,
	StatixError
};