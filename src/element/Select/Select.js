import statix from "../../libs/statix/src/statix.core.js";

const G_STATIX_SELECT_OPTION_VALUE = "statix_select_value";

export default function Select(props) {
	const instance = new statix.Statix();
	const statixDOM = instance.getStatixDOM();

	const optionsSignal = instance.signal(props.options);
	const isSelectOpenSignal = instance.signal(false);
	const selectedSignal = instance.signal(props.default);

	statixDOM.setRoot(`[data-${statix.CONST.DATASET_BIND_ID}="${props.bindSelector}"]`);
	statixDOM.root().addClass(props.className).addEvent("click", instance.shareSignalToEvent({ selectedSignal, isSelectOpenSignal }, handleSelectOptionClick));

	isSelectOpenSignal.subscribe(renderIsSelectOpen);

	optionsSignal.subscribe(renderSelectOptions);
	optionsSignal.emit();

	selectedSignal.subscribe(renderSelectedOption);
	selectedSignal.emit();

	return { val: selectedSignal.val, reset: __reset__(selectedSignal, props.default) };
}

function __reset__(selectedSignal, defaultValue) {
	return function() {
		selectedSignal.set(defaultValue);
	}
}

function renderSelectedOption(instance, curr, _prev) {
	instance
		.getStatixDOM()
		.root()
		.query(".select-selected")
		.text(curr.text);
}

function renderIsSelectOpen(instance, _curr, _prev) {
	instance
		.getStatixDOM()
		.root()
		.query(".select-list")
		.toggleClass("select-list_open");
}

function handleSelectOptionClick(signals, _nstance, event) {
	const { selectedSignal, isSelectOpenSignal } = signals;

	// Handle click on option.
	if(event.target !== event.currentTarget) {
		selectedSignal.set({ text: event.target.textContent, value: event.target.dataset[G_STATIX_SELECT_OPTION_VALUE] });
	}

	isSelectOpenSignal.set(curr => !curr);
}

function renderSelectOptions(instance, curr, _prev) {
	const STATIX_SELECT_LIST_SELECTOR = ".select-list";

	let index = 0;
	let length = curr.length;

	const statixDOM = instance.getStatixDOM();
	const fragment = statixDOM.fragment();

	while(index < length) {
		fragment
			.addChilds([
				statixDOM
					.element("li")
					.dataset([{ [G_STATIX_SELECT_OPTION_VALUE]: curr[index].value }])
					.text(curr[index].text)
				]);
		index++;
	}

	statixDOM.root().query(STATIX_SELECT_LIST_SELECTOR).addChilds([fragment]);
}