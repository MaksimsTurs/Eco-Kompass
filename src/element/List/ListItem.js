import { tag } from "../../libs/statix/src/element.core.js";

export default function ListItem(item) {
	return(
		tag("li")
		.stxtid(item.id)
	  .class(["ecokompass-list_item", "flex-c-n-n-x"])
		.childs(
	    tag("p").stxtaction("expand-item").text(item.title).class(["ecokompass-list_item_title"]),
			tag("div").class(["ecokompass-list_item_data_container", "flex-c-n-n-xs"]).childs(
				tag("div").class(["ecokompass-list_item_property", "ecokompass-list_item_color", "flex-r-sb-c-xs"]).childs(
					tag("p").text("Stufe:"),
					tag("p").styles({ "backgroundColor": item.colorLevel })
				),
				tag("div").class(["ecokompass-list_item_property", "flex-r-sb-c-xs"]).childs(
					tag("p").text("Summe:"),
					tag("p").text(item.sum)
				),
				tag("p").text(item.description),
				tag("button").stxtaction("remove-item").stxtid(item.id).text("Löschen").class(["ecokompass-list_item_delete_button", "button"])
			)
		)
	);
}