import List from "./src/element/List/List.js";
import Select from "./src/element/Select/Select.js";

import statix from "./src/libs/statix/src/statix.core.js";

import isInRange from "./src/utils/isInRange.utils.js";

import { 
	G_FACTOR 
} from "./NUMBER.const.js";
import { 
	G_WARNING_LVL 
} from "./STRING.const.js";

// DOM Elements
const kompassForm = document.getElementById("ecokompass_form");
const kompassFormInputs = kompassForm.querySelectorAll("input, textarea");

const list = List({ selector: "#ecokompass_list", data: JSON.parse(localStorage.getItem("ecokompass") || "[]") });

const selectStatixInstances = [];

kompassForm
	.querySelectorAll(".select-input_container")
	.forEach(function(select) {
		selectStatixInstances.push(Select({ 
			options: [{ text: "Einzelfall", value: 0 }, { text: "Geduldet", value: 0.5 }, { text: "Systemisch", value: 1 }],
			bindSelector: select.dataset[statix.CONST.DATASET_BIND_ID],
			default: { text: "P", value: 0 }
		}));
	});

kompassForm.addEventListener("submit", createNewListItem);

function createNewListItem(event) {
	event.preventDefault();

	const kompassTitleInput = kompassForm.querySelector('[name="title"]');
	const kompassDescriptionInput = kompassForm.querySelector('[name="description"]');

	const newListItem = {
		id: statix.Utils.generateRandomValue(),
		title: kompassTitleInput.value || `#${list.itemsSignal.val().length + 1}`,
		description: kompassDescriptionInput.value,
		colorLevel:  "",
		sum: 0
	};

	let index = 2;
	let statixInstanceIndex = 0;

	const length = kompassFormInputs.length;

	while(index < length) {
		const PInput = selectStatixInstances[statixInstanceIndex++];
		const BInput = kompassFormInputs.item(index + 3);

		const P = +PInput.val().value;
		const B = Number(BInput.value) || 0;

		const errorMessageP = BInput.parentNode.parentNode.querySelector(".error_message");

		if(!isInRange(B, +BInput.min, +BInput.max) && !BInput.classList.contains("error_input")) {
			BInput.classList.add("error_input");
			errorMessageP.textContent = "B ist zu groß oder zu klein!";
			errorMessageP.classList.add("error_message_visible");
			return;
		} else if(BInput.classList.contains("error_input")) {
			BInput.classList.remove("error_input");
			errorMessageP.classList.remove("error_message_visible");
		}

		const FInput = kompassFormInputs.item(index);
		const VInput = kompassFormInputs.item(index + 1);
		const GInput = kompassFormInputs.item(index + 2);
	
		const F = +FInput.checked;
		const V = +VInput.checked;
		const G = +GInput.checked;		

		newListItem.sum += ((F * G_FACTOR.FREIHEIT) + (V * G_FACTOR.VERSTAND) + (G * G_FACTOR.GLEICHHEIT)) * P * B;

		PInput.reset();
		BInput.value = "";
		FInput.checked = false;
		VInput.checked = false;
		GInput.checked = false;

		index += 4;
	}

	kompassTitleInput.value = "";
	kompassDescriptionInput.value = "";

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

	list.itemsSignal.set(function(curr) {
		const updatedList = [...curr, newListItem];
	
		localStorage.setItem("ecokompass", JSON.stringify(updatedList));
		
		return updatedList;
	});
}
