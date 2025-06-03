import statix from "../../libs/statix/src/statix.core.js";
import { root } from "../../libs/statix/src/element.core.js";

import Empty from "../Empty/Empty.js";
import ListItem from "./ListItem.js";

export default function List(props) {
	const list = new statix.Element();

	list.addSignal("items", props.signals.pagination);
	list.bind(props.bind);

	statix.utils.delegateEvent(list, "click", actionHandler);

	list.signals.items.subscribe(list, renderListItems);

	return list;
}

function actionHandler(action) {
	const { event, signals, type } = action;
	
	switch(type) {
		case "expand-item":
			event.target.parentNode.classList.toggle("ecokompass-list_item_data_container_open");
		break;
		case "remove-item":
			signals.items.value = (curr) => {
				const filtered = filterList(signals.items.value.items, event.target.dataset.statixId);
				const currPage = 
					!(filtered.length % curr.itemsPerPage) && curr.currPage === 0 ? 0 :
					!(filtered.length % curr.itemsPerPage) ? curr.currPage - 1 : curr.currPage;
			
				return {...curr, currPage, items: filtered };
			}
		break;
	}
	
}

function filterList(prev, id) {
	const filteredList = prev.filter(item => item.id !== id);
				
	localStorage.setItem("ecokompass", JSON.stringify(filteredList));

	return filteredList;
}

function renderListItems(instance) {
	const { items } = instance.signals;

	if(!items.value.items.length) {
		instance.render(root().child(Empty({ text: "Die Liste ist Leer!", icon: '<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M12 20h9M16 4a1 1 0 0 1 3 3L7 19a2 2 0 0 1 0 0l-3 1a1 1 0 0 1-1-1l1-3a2 2 0 0 1 0 0zM15 5l3 3"/></svg>' })));
	} else {
		let start = items.value.itemsPerPage * items.value.currPage;

		const newRoot = root();
		const end = start + items.value.itemsPerPage;
		
		while(start < end) {
			if(items.value.items[start]) {
				newRoot.child(ListItem(items.value.items[start]));
			} else {
				break;
			}

			start++;
		}

		instance.render(newRoot);
	}
}