import List from "../List/List.js";

import statix from "../../libs/statix/src/statix.core.js";

import { 
	G_FACTOR 
} from "/NUMBER.const.js";
import { 
	G_WARNING_LVL 
} from "/STRING.const.js";

// DOM Elements
const ecoKompassForm = document.getElementById("ecokompass_form");
const inputContainers = ecoKompassForm.querySelectorAll("[data-factor-key]");
const ecoTitleInput = ecoKompassForm.querySelector('[name="title"]');
const ecoDescriptionInput = ecoKompassForm.querySelector('[name="description"]');
// Statix Elements
const list = List("#ecokompass_list");

list.setState(JSON.parse(localStorage.getItem("ecokompass") || "[]"));

ecoKompassForm.addEventListener("submit", createNewListItem);

function createNewListItem(event) {
	event.preventDefault();

	const newListItem = {
		id: statix.Utils.generateRandomValue(),
		title: ecoTitleInput.value || `#${list.getState().length + 1}`,
		description: ecoDescriptionInput.value,
		colorLevel:  "",
		sum: 0
	};

	for(let index = 0; index < inputContainers.length; index++) {
		const bInput = inputContainers[index].firstElementChild;
		const pInput = inputContainers[index].lastElementChild;

		const b = Number(bInput.value) || 0;
		const p = Number(pInput.value) || 0;

		newListItem.sum += p * b * G_FACTOR[inputContainers[index].dataset.factorKey];

		bInput.value = "";
		pInput.value = "";
	}

	ecoTitleInput.value = "";
	ecoDescriptionInput.value = "";

	if(newListItem.sum >= 7501) {
		newListItem.colorLevel = G_WARNING_LVL.DANGEROUS;
	} else if(newListItem.sum >= 4501) {
		newListItem.colorLevel = G_WARNING_LVL.DANGEROUS_MODERATE;
	} else if(newListItem.sum >= 3001) {
		newListItem.colorLevel = G_WARNING_LVL.MIDDLE;
	} else if(newListItem.sum >= 1501) {
		newListItem.colorLevel = G_WARNING_LVL.OK_MODERATE;
	} else {
		newListItem.colorLevel = G_WARNING_LVL.OK;
	}
	
	list.setState(curr => {
		const updatedList = [...curr, newListItem];

		localStorage.setItem("ecokompass", JSON.stringify(updatedList));
		
		return updatedList;
	});
}
