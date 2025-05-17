import statix from "../../libs/statix/src/statix.core.js";

export default function Pagination(props) {
	const instance = new statix.Statix();
	const statixDOM = instance.getStatixDOM();
	const pagesCount = instance.signal(props.pagesCount);

	statixDOM.setRoot(`[data-${statix.CONST.DATASET_BIND_ID}="${props.bindSelector}"]`);

	pagesCount.subscribe(renderPagesCountList);
	pagesCount.emit();

	return { pagesCount };
}

function getKey(item) {
	return item;
}

function changeChild(instance, item, child, index) {
	instance
		.getStatixDOM()
			.element(child)
			.dataset([{ [statix.CONST.DATASET_LIST_ID]: statix.Utils.generateRandomValue() }])
			.childAt([0])
			.addClass("button")
			.removeClass("ecokompass-active_page")
			.text(index);
}

function createChild(instance, __item__, index) {
	let paginationButton = instance.getCache("pagination_button");

	const statixDOM = instance.getStatixDOM();

	if(!paginationButton) {
		paginationButton = statixDOM
			.element("li")
			.dataset([{ [statix.CONST.DATASET_LIST_ID]: statix.Utils.generateRandomValue() }])
			.addChilds([
				statixDOM
					.element("button")
					.addClass("button ecokompass-active_page")
					.text(index)
			]);
		instance.setCache("pagination_button", paginationButton);
	} else {
		statixDOM
			.element(paginationButton)
			.dataset([{ [statix.CONST.DATASET_LIST_ID]: statix.Utils.generateRandomValue() }])
			.childAt([0])
			.addClass("button")
			.removeClass("ecokompass-active_page")
			.text(index);
	}

	return paginationButton;
}

function renderPagesCountList(instance, curr, prev) {
	const statixDOM = instance.getStatixDOM();

	statixDOM.each([...Array(curr)], [...Array(prev || 0)], getKey, null, changeChild, createChild);
}