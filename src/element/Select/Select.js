import statix from "../../libs/statix/src/statix.core.js";
import { fragment, tag } from "../../libs/statix/src/element.core.js";

const G_STATIX_SELECT_OPTION_VALUE = "select-value";

export default function Select(props) {
	const select = new statix.Element();

	const options = new statix.Signal(props.options);
	const selected = new statix.Signal(props.default);

	select.addSignal("options", options);
	select.addSignal("selected", selected);

	select.bind(props.bind);
	
	statix.utils.delegateEvent(select, "click", actionHandler);

	options.subscribe(select, renderSelectOptions);
	selected.subscribe(select, renderSelectedOption);

	return { 
		reset: () => selected.value = props.default,
		selected: () => selected.value,
	};
}

function actionHandler(action) {
	const { event, signals, type } = action;

	switch(type) {
		case "close-open-select":
			toggleExpandList(event);
		break;
		case "select-value":
			signals.selected.value = { 
				text: event.target.textContent, 
				value: event.target.getAttribute(`data-${G_STATIX_SELECT_OPTION_VALUE}`) 
			};

			toggleExpandList(event);
		break;
	}	
}

function toggleExpandList(event) {
	event.currentTarget.classList.toggle("select-input_container_active");
	event.currentTarget.lastElementChild.classList.toggle("select-list_open")
}

function renderSelectedOption(instance) {
	instance.render(fragment().child(instance.signals.selected.value.text), { replaceRootWith: { at: 0 }});
}

function renderSelectOptions(instance) {
	const { options } = instance.signals;

	instance.render(
		fragment().childs(options.value.map(option => tag("li").stxtaction("select-value").text(option.text).dataset({ [G_STATIX_SELECT_OPTION_VALUE]: option.value }))),
		{ replaceRootWith: { at: 1 }}
	);
}

// 27u7E61)5h
// 27u7E61)5h