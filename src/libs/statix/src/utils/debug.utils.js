import { isHTMLElement, isHTMLList } from "./is.utils.js";

let __DEBUG_MODE__ = false;

export function debug(onOrOff) {
	__DEBUG_MODE__ = onOrOff;
}

export function time(callback, ...params) {
	let res = null;

	if(__DEBUG_MODE__) {
		console.time(`time(${callback.name})`);
		
		res = callback(...params);

		console.timeEnd(`time(${callback.name})`);
	} else {
		res = callback(...params);
	}
	
	return res;
}

export function log(text, ...data) {
	if(__DEBUG_MODE__) {
		const logData = [];
		const length = data.length;
	
		let index = 0;
	
		while(index < length) {
			if(isHTMLElement(data[index])) {
				logData.push(data[index].cloneNode(true));
			} else if(isHTMLList(data[index])) {
				const listCopy = [];
				const length = data[index].length;
	
				let listIndex = 0;
	
				while(listIndex < length) {
					listCopy.push(data[index][listIndex].cloneNode(true));
					listIndex++;
				}
	
				logData.push(listCopy);
			} else {
				logData.push(data[index]);
			}
	
			index++;
		}
	
		console.log(text, ...logData);
	}
}
