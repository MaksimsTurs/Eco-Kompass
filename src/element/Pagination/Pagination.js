import statix from "../../libs/statix/src/statix.core.js";
import { root, tag } from "../../libs/statix/src/element.core.js";

export default function Pagination(props) {
	const pagination = new statix.Element();

	pagination.addSignal("pagination", props.signals.pagination);
	pagination.bind(props.bind);

	statix.utils.delegateEvent(pagination, "click", actionHandler);

	pagination.signals.pagination.subscribe(pagination, renderPageList);

	return pagination;
}

function actionHandler(action) {
	const { event, signals, type } = action;

	switch(type) {
		case "change-page":
			signals.pagination.value = {
				...signals.pagination.value, 
				currPage: +event.target.textContent
			};
		break;
	}
}

function renderPageList(instance) {
	const { pagination } = instance.signals;

	if(!pagination.value.items.length) {
		instance.unmount();
	} else {
		instance.mount();

		const pagesCount = Math.ceil(pagination.value.items.length / pagination.value.itemsPerPage);
		const baseIndex = (pagination.value.currPage + 1) === pagesCount ? -1 : pagination.value.currPage === 0 ? 1 : 0;
		const pageButtons = Array
			.from({ length: pagesCount })
			.map((_, index) => tag("button").stxtaction("change-page").class(index === pagination.value.currPage ? ["button", "ecokompass-curr_page"] : ["button"]).text(index));

		instance.render(root().childs(
			pageButtons[(pagination.value.currPage - 1) + baseIndex], 
			pageButtons[pagination.value.currPage + baseIndex], 
			pageButtons[(pagination.value.currPage + 1) + baseIndex])
		);
	}
}