import statix from "../../libs/statix/src/statix.core.js";

export default function ListItem(instance, 	item) {
	const statixDOM = instance.getStatixDOM();

	return statixDOM
		.element("li")
	  .dataset(statix.CONST.DATASET_KEY, item.id)
	  .addClass("ecokompass_list_item flex-c-n-n-x")
		.addChilds([
	    statixDOM.element("p").text(item.title).addClass("ecokompass_list_item_title").create(),
			statixDOM.element("div").addClass("ecokompass_list_item_data_container flex-c-n-n-xs").addChilds([
				statixDOM.element("div").addClass("ecokompass_list_item_property ecokompass_list_item_color flex-r-sb-c-xs").addChilds([
					statixDOM.element("p").text("Stufe:").create(),
					statixDOM.element("p").style("backgroundColor", item.colorLevel).create()
				]).create(),
				statixDOM.element("div").addClass("ecokompass_list_item_property flex-r-sb-c-xs").addChilds([
					statixDOM.element("p").text("Summe:").create(),
					statixDOM.element("p").text(item.sum).create()
				]).create(),
				statixDOM.element("p").text(item.description).create(),
				statixDOM.element("button").dataset(statix.CONST.DATASET_KEY, item.id).text("Löschen").addClass("ecokompass_list_item_delete_button button").create()
			]).create()
		]).create();
}