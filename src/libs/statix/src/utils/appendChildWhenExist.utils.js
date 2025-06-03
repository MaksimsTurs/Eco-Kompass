import { isHTMLElement, isStatixDOM, isNull, isUndefined, isString } from "./is.utils.js";

import { G_ROOT_ELEMENT } from "../StatixElement.core.js";

export default function appendChildWhenExist(root, child) {
	if(!isNull(child) && !isUndefined(child)) {
		if(isString(child)) {
			const dummy = document.createElement("div");

			dummy.insertAdjacentHTML("afterbegin", child);

			root.appendChild(dummy.childNodes[0]);
		} else if(isStatixDOM(child)) {
			root.appendChild(child[G_ROOT_ELEMENT]);
		} else if(isHTMLElement(child)) {
			root.appendChild(child);
		}
	}
};