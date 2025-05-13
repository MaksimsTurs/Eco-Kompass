"use strict"

import Statix from "./Statix.js";
import StatixDOM from "./StatixDOM.js";
import Utils from "./Utils.js";

import {
	G_STATIX_DATASET_LIST_ID,
	G_STATIX_DATASET_BIND_ID
} from "../STRING.const.js";

const statix = { 
	CONST: { 
		DATASET_LIST_ID: G_STATIX_DATASET_LIST_ID,
		DATASET_BIND_ID: G_STATIX_DATASET_BIND_ID
	},
	Statix,
	StatixDOM,
	Utils 
};

export default statix;