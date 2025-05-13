import statix from "./src/libs/statix/src/statix.core.js";
import ImportManager from "./src/libs/ImportManager/src/ImportManager.js";

const imports = new ImportManager();

export default function App(props) {
	const instance = new statix.Statix();
	const isMainTab = instance.signal(props.activeTab);
	const statixDOM = instance.getStatixDOM();

	statixDOM.setRoot("#app");
	statixDOM
		.root()
		.query(".ecokompass_about_container")
		.focus()
		.query("#ecokompass_calculator_button")
		.addEvent("click", instance.shareSignalToEvent(isMainTab, openEcoKompassDescription))
		.query("#ecokompass_description_button")
		.addEvent("click", instance.shareSignalToEvent(isMainTab, openEcoKompassCalculator));

	isMainTab.subscribe(showActiveTab);
	isMainTab.emit();

	return instance;
}

function showActiveTab(instance, activeTab, _prevActiveTab) {
	const statixDOM = instance.getStatixDOM();

	if(activeTab === "Main") {
		statixDOM
			.root()
			.query(".ecokompass_about_container")
			.focus()
			.removeClass("ecokompass_content_hidden");
		statixDOM
			.root()
			.query(".ecokompass_calculator_container")
			.addClass("ecokompass_content_hidden");
	} else {
		statixDOM
			.root()
			.query(".ecokompass_about_container")
			.addClass("ecokompass_content_hidden");
		statixDOM
			.root()
			.query(".ecokompass_calculator_container")
			.focus()
			.removeClass("ecokompass_content_hidden");
	}
}

function openEcoKompassDescription(signal, _instance, _event) {
	signal.set("Main");
}

async function openEcoKompassCalculator(signal, _instance, _event) {
	await imports.add("Calculator.component", "/src/element/Calculator/Calculator.js");
	await imports.add("Calculator.styles", "/src/element/Calculator/Calculator.css");

	signal.set("Calculator");
}

