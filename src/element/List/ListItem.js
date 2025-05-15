import statix from "../../libs/statix/src/statix.core.js";

export default function ListItem(instance, 	item) {
	const statixDOM = instance.getStatixDOM();

	return statixDOM
		.element("li")
	  .dataset([{ [statix.CONST.DATASET_LIST_ID]: item.id }])
	  .addClass("ecokompass-list_item flex-c-n-n-x")
		.addChilds([
	    statixDOM.element("p").text(item.title).addClass("ecokompass-list_item_title"),
			statixDOM.element("div").addClass("ecokompass-list_item_data_container flex-c-n-n-xs").addChilds([
				statixDOM.element("div").addClass("ecokompass-list_item_property ecokompass-list_item_color flex-r-sb-c-xs").addChilds([
					statixDOM.element("p").text("Stufe:"),
					statixDOM.element("p").style([{ "backgroundColor": item.colorLevel }])
				]),
				statixDOM.element("div").addClass("ecokompass-list_item_property flex-r-sb-c-xs").addChilds([
					statixDOM.element("p").text("Summe:"),
					statixDOM.element("p").text(item.sum)
				]),
				statixDOM.element("p").text(item.description),
				statixDOM.element("button").dataset([{ [statix.CONST.DATASET_LIST_ID]: item.id }]).text("Löschen").addClass("ecokompass-list_item_delete_button button")
			])
		]);
}