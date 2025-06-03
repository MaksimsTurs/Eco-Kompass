import { tag } from "../../libs/statix/src/element.core.js";

export default function Empty(props) {
	return tag("div").class(["flex-r-c-c-xs", "empty_container"]).childs(props?.icon, props.text);
}