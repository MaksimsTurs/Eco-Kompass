import statix from "../../libs/statix/src/statix.core.js";

import Empty from "../Empty/Empty.js";
import ListItem from "./ListItem.js";
// import Pagination from "../Pagination/Pagination.js";

export default function List(props) {
	// const pagination = Pagination({ bindSelector: "ecokompass_list_pagination", pagesCount: ~~(props.data.length / 2) });
	const instance = new statix.Statix();
	const itemsSignal = instance.signal(props.data);
	const statixDOM = instance.getStatixDOM();

	// instance.registerSignal("items", props.data);

	// instance.signals.items.subscribe(renderListItems);
	// instance.signals.items.emit();
	
	statixDOM.setRoot(`[data-${statix.CONST.DATASET_BIND_ID}="${props.bindSelector}"]`);
	statixDOM.root().addEvent("click", instance.shareSignalToEvent(itemsSignal, listItemActionsHandler));

	itemsSignal.subscribe(renderListItems);
	itemsSignal.emit();

	return { instance, itemsSignal };
}

function getKey(item) {
	return item.id;
}

function changeChild(instance, item, child) {
	instance
		.getStatixDOM()
			.element(child).dataset([{ [statix.CONST.DATASET_LIST_ID]: item.id }])
			.childAt([0]).text(item.title)
			.childAt([1, 0, 1]).style([{ "backgroundColor": item.colorLevel }])
			.childAt([1, 1, 1]).text(item.sum)
			.childAt([1, 2]).text(item.description)
			.childAt([1, 3]).dataset([{ [statix.CONST.DATASET_LIST_ID]: item.id }]);
}

function createChild(instance, item) {
	let listItem = instance.getCache("list_item");
	
	if(!listItem) {
		listItem = ListItem(instance, item);
		instance.setCache("list_item", listItem);
	} else {
		instance
			.getStatixDOM()
				.element(listItem).dataset([{ [statix.CONST.DATASET_LIST_ID]: item.id }])
				.childAt([0]).text(item.title)
				.childAt([1, 0, 1]).style([{ "backgroundColor": item.colorLevel }])
				.childAt([1, 1, 1]).text(item.sum)
				.childAt([1, 2]).text(item.description)
				.childAt([1, 3]).dataset([{ [statix.CONST.DATASET_LIST_ID]: item.id }]);
	}

	return listItem;
}

function renderListItems(instance, curr, prev) {
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
			]);
	}
}

function filterList(prev, id) {
	const filteredList = prev.filter(item => item.id !== id);
				
	localStorage.setItem("ecokompass", JSON.stringify(filteredList));

	return filteredList;
}

function listItemActionsHandler(signal, _instance, event) {
	event.stopPropagation();

	if(event.target.classList.contains("ecokompass-list_item_delete_button")) {
		// Remove list item when delete button was clicked.
		signal.set(prev => filterList(prev, event.target.dataset[statix.CONST.DATASET_LIST_ID]));	
	} else if(event.target.classList.contains("ecokompass-list_item_title")) {
		// Expand list item when title was clicked.
		event.target?.parentNode
			?.querySelector(".ecokompass-list_item_data_container")
			?.parentNode
			?.classList
			?.toggle("ecokompass-list_item_data_container_open");
	}
}