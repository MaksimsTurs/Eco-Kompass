import List from "../List/List.js";
import Select from "../Select/Select.js";

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

const selectOptions = [{ key: "Einzelfall", value: 0 }, { key: "Geduldet", value: 0.5 }, { key: "Systemisch", value: 1 }];
const selectElementIds = [
	"#traditions-kult",
	"#ablehnung-der-moderne",
	"#widerspruchsverbot",
	"#konseskult",
	"#ablehnung-vom-fremden",
	"#elitendenken",
	"#heldentum-verherrlichen",
	"#machismus",
	"#selektiver-populismus",
	"#neuspruch-vereinfachung",
	"#nationalismus",
	"#feindbild",
	"#massenkontrolle",
	"#angst-als-macht",
	"#medieneinfluss"
];
const selectStatixInstances = [];

for(let index = 0; index < selectElementIds.length; index++) {
	selectStatixInstances.push(Select({ items: selectOptions, id: selectElementIds[index] }));
}

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

		const b = Number(bInput.value) || 0;

		newListItem.sum += selectStatixInstances[index].getState().selected * b * G_FACTOR[inputContainers[index].dataset.factorKey];

		bInput.value = "";
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
