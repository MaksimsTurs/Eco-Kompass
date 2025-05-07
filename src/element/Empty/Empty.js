export default function Empty(props) {
	const container = document.createElement("div");

	container.classList.add(...["empty_container", "flex-r-c-c-xs"]);
	
	if(props?.icon && props?.icon instanceof HTMLElement) {
		container.appendChild(props.icon);
	} else if(props?.icon && typeof props?.icon === "string") {
		container.insertAdjacentHTML("beforeend", props.icon);
	}

	container.append(props.text);

	return container
}