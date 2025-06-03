"use strict"

import StatixElement from "./StatixElement.core.js";
import StatixSignal from "./StatixSignal.core.js";
import utils from "./utils.core.js";

const statix = { 
	CONST: { 
		DATASET_LIST_ID: "statixId",
		DATASET_BIND_ID: "statixBind"
	},
	Signal: StatixSignal,
	Element: StatixElement,
	utils,
};

export default statix;