import statix from "../../libs/statix/src/statix.core.js";

export default function Select(props) {
	const state = { items: props?.items, isOpen: false, selected: null };
	const instance = new statix.Statix();
	const statixDOM = instance.getStatixDOM();

	statixDOM.setRootBySelector(props.id);
	statixDOM
		.root()
		.addEvent("click", toggleSelectVisibility)
		.reset();

	instance.onUpdate(onUpdate);
	instance.setState(state);

	return instance;
}

function onUpdate(instance, curr, prev) {
	let index = 0;
	let length = curr.items.length;

	let optionWithBiggesLength = 0;

	const statixDOM = instance.getStatixDOM();
	const fragment = document.createDocumentFragment();

	if(curr.items.length !== prev?.items?.length) {
		while(index < length) {
			fragment
				.appendChild(statixDOM
					.element("li")
					.dataset("select_value", curr.items[index].value)
					.dataset(statix.CONST.DATASET_KEY, curr.items[index].key)
					.text(curr.items[index].key)
					.create());
				
			if(curr.items[index].key.length > optionWithBiggesLength) {
				optionWithBiggesLength = curr.items[index].key.length;
			}
	
			index++;
		}
	}

	statixDOM
		.root()
		.query(".select_input_list")
		.addChilds([fragment])
		.reset();
}

function toggleSelectVisibility(instance, event) {
	const statixDOM = instance.getStatixDOM();
	const state = instance.getState();

	if(!state.isOpen) {
		instance.setState(prev => ({...prev, isOpen: true }));
	} else {
		// Handle click on option.
		if(event.target !== event.currentTarget) {
			statixDOM.root().query(".select_curr_value").text(event.target.textContent).reset();
			statixDOM.root().query(".select_placeholder").addClass("select_placeholder_hidden").reset();
			instance.setState(prev => ({...prev, isOpen: !prev.isOpen, selected: +event.target.dataset["select_value"] }));
		} else if(!state.selected) {
			statixDOM.root().query(".select_placeholder").removeClass("select_placeholder_hidden").reset();
		}
	}

	event.currentTarget.querySelector(".select_input_list").classList.toggle("select_input_list_open");
}