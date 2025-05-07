import statix from "./src/libs/statix/src/statix.core.js";
import ImportManager from "./src/libs/ImportManager/src/ImportManager.js";

const imports = new ImportManager();

export default function App(props) {
	const instance = new statix.Statix(props);
	const statixDOM = instance.getStatixDOM();

	statixDOM.setRootBySelector("#app");
	statixDOM
		.root()
		.query(".ecokompass_about_container")
		.focus()
		.query("#ecokompass_calculator_button")
		.addEvent("click", openEcoKompassCalculator)
		.query("#ecokompass_description_button")
		.addEvent("click", openEcoKompassDescription)
		.reset();

	instance.onUpdate(onUpdate);

	return instance;
}

function onUpdate(instance, isOpen) {
	const statixDOM = instance.getStatixDOM();
	
	if(isOpen) {
		statixDOM
			.root()
			.query(".ecokompass_about_container")
			.addClass("ecokompass_content_hidden")
			.reset();
		statixDOM
			.root()
			.query(".ecokompass_calculator_container")
			.focus()
			.removeClass("ecokompass_content_hidden")
			.reset();
	} else {
		statixDOM
			.root()
			.query(".ecokompass_about_container")
			.focus()
			.removeClass("ecokompass_content_hidden")
			.reset();
		statixDOM
			.root()
			.query(".ecokompass_calculator_container")
			.addClass("ecokompass_content_hidden")
			.reset();
	}
}

function openEcoKompassDescription(instance) {
	instance.setState(false);
}

async function openEcoKompassCalculator(instance) {
	await imports.add("Calculator.component", "/src/element/Calculator/Calculator.js");
	await imports.add("Calculator.styles", "/src/element/Calculator/Calculator.css");

	instance.setState(true);
}