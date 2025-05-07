import statix from "../../libs/statix/src/statix.core.js";

import Empty from "../Empty/Empty.js";
import ListItem from "./ListItem.js";

export default function List(selector) {
	const instance = new statix.Statix();
	const statixDOM = instance.getStatixDOM();

	instance.onUpdate(onListUpdate);

	statixDOM.setRootBySelector(selector);
	statixDOM.root().addEvent("click", listItemActionsHandler).reset();

	return instance;
}

function getKey(item) {
	return item.id;
}

function changeChild(instance, currItem, child) {
	instance
		.getStatixDOM()
		.element(child).dataset(statix.CONST.DATASET_KEY, currItem.id)
		.childAt([0]).text(currItem.title)
		.childAt([1, 0, 1]).style("backgroundColor", currItem.colorLevel)
		.childAt([1, 1, 1]).text(currItem.sum)
		.childAt([1, 2]).text(currItem.description)
		.childAt([1, 3]).dataset(statix.CONST.DATASET_KEY, currItem.id).reset();
}

function createChild(instance, item) {
	let listItem = instance.getCache("list_item");
	
	if(!listItem) {
		listItem = ListItem(instance, item);
		instance.setCache("list_item", listItem);
	} else {
		instance
			.getStatixDOM()
			.element(listItem).dataset(statix.CONST.DATASET_KEY, item.id)
			.childAt([0]).text(item.title)
			.childAt([1, 0, 1]).style("backgroundColor", item.colorLevel)
			.childAt([1, 1, 1]).text(item.sum)
			.childAt([1, 2]).text(item.description)
			.childAt([1, 3]).dataset(statix.CONST.DATASET_KEY, item.id).reset();
	}

	return listItem;
}

function onListUpdate(instance, curr, prev) {
	const statixDOM = instance.getStatixDOM();

	document.querySelector(".empty_container")?.remove();
	statixDOM.each(curr, prev || [], getKey, null, changeChild, createChild);
	
	if(!curr.length) {
		statixDOM
			.root()
			.addChilds([
				Empty({
					icon: '<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M12 20h9M16 4a1 1 0 0 1 3 3L7 19a2 2 0 0 1 0 0l-3 1a1 1 0 0 1-1-1l1-3a2 2 0 0 1 0 0zM15 5l3 3"/></svg>',
					text: "Es wurden noch keine rechnungen gemacht!"
				})
			])
			.reset();
	}
}

function filterList(prev, id) {
	const filteredList = prev.filter(item => item.id !== id);
				
	localStorage.setItem("ecokompass", JSON.stringify(filteredList));

	return filteredList;
}

function listItemActionsHandler(instance, event) {
	event.stopPropagation();

	if(event.target.classList.contains("ecokompass_list_item_delete_button")) {
		// Remove list item when delete button was clicked.
		instance.setState(prev => filterList(prev, event.target.dataset[statix.CONST.DATASET_KEY]));	
	} else if(event.target.classList.contains("ecokompass_list_item_title")) {
		// Expand list item when title was clicked.
		event.target?.parentNode
			?.querySelector(".ecokompass_list_item_data_container")
			?.parentNode
			?.classList
			?.toggle("ecokompass_list_item_data_container_open");
	}
}