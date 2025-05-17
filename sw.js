const G_CACHE_CURR_VERSION = "v0.0.1";
const G_CACHE_PREV_VERSION = "v0.0.0";

async function __fetchResource__(event) {
	try {
		let resource = await caches.match(event.request);
	
		if(resource) {
			return resource;
		}

		caches.delete()
	
		resource = await fetch(event.request);
	
		(await caches.open(G_CACHE_CURR_VERSION)).put(event.request, resource.clone());
	
		return resource;
	} catch(error) {
		console.error("[WORKER]:", error);
	}
}

self.addEventListener("install", installWorker);
self.addEventListener("fetch", fetchWorker);
self.addEventListener("activate", activateWorker);

function activateWorker(event) {
	console.log("[WORKER]: Activate", event);
}

async function fetchWorker(event) {
	console.log("[WORKER]: Fetch", event.request);

	event.respondWith((async () => __fetchResource__(event))());
}

async function installWorker(event) {
	console.log("[WORKER]: Install!", event);

	if(caches.has(G_CACHE_PREV_VERSION)) {
		await caches.delete(G_CACHE_PREV_VERSION);
	}

	const STATIC_RESOURCE_PATHS = [
		// Pages
		"/kompass.html",
		"/index.html",
		// Images
		"/src/imgs/PWA_1_Chrome_Mobile.webp",
		"/src/imgs/PWA_2_Chrome_Mobile.webp",
		"/src/imgs/PWA_3_Chrome_Mobile.webp",
		"/src/imgs/PWA_2_Chrome_PC.webp",
		"/src/imgs/PWA_1_Chrome_PC.webp",
		"/src/imgs/PWA_1_Edge.webp",
		"/src/imgs/PWA_2_Edge.webp",
		"/src/imgs/PWA_3_Edge.webp",
		"/src/imgs/Umberto_Eco.webp",
		"/favico32x32.webp",
		"/favico144x144.webp",
		"/favico192x192.webp",
		"/favico512x512.webp",
		"/favico1024x1024.webp",
		// CSS
		"/kompass.css",
		"/index.css",
		"/src/css/flex-column.css",
		"/src/css/media-query.css",
		"/src/css/variable.css",
		"/src/css/flex-row.css",
		"/src/css/position.css",
		"/src/css/common.css",
		"/src/css/reset.css",
		"/src/css/font.css",
		"/src/element/Button/Button.css",
		"/src/element/Checkbox/Checkbox.css",
		"/src/element/Empty/Empty.css",
		"/src/element/Error/Error.css",
		"/src/element/List/List.css",
		"/src/element/Select/Select.css",
		"/src/element/Text-Area/TextArea.css",
		"/src/element/Text-Input/TextInput.css",
		// Manifest
		"/index.manifest.json",
		"/kompass.manifest.json",
		// Fonts
		"/src/fonts/Poppins-Black.woff2",
		"/src/fonts/Poppins-ExtraBold.woff2",
		"/src/fonts/Poppins-Bold.woff2",
		"/src/fonts/Poppins-ExtraLight.woff2",
		"/src/fonts/Poppins-Light.woff2",
		"/src/fonts/Poppins-Medium.woff2",
		"/src/fonts/Poppins-Regular.woff2",
		"/src/fonts/Poppins-SemiBold.woff2",
		"/src/fonts/Poppins-Thin.woff2",
		// JS
		"/sw.js",
		"/index.js",
		"/kompass.js",
		"/NUMBER.const.js",
		"/STRING.const.js",
		"/src/utils/isInRange.utils.js",
		"/src/element/Checkbox/Checkbox.js",
		"/src/element/Empty/Empty.js",
		"/src/element/List/List.js",
		"/src/element/List/ListItem.js",
		"/src/element/Select/Select.js",
		"/src/libs/statix/STRING.const.js",
		"/src/libs/statix/src/statix.core.js",
		"/src/libs/statix/src/Statix.js",
		"/src/libs/statix/src/StatixDOM.js",
		"/src/libs/statix/src/StatixDOMManipulation.js",
		"/src/libs/statix/src/StatixErrors.js",
		"/src/libs/statix/src/Utils.js",
		"/src/libs/statix/src/utils/isDocumentFragment.utils.js",
		"/src/libs/statix/src/utils/isElement.utils.js",
		"/src/libs/statix/src/utils/isFunction.utils.js",
		"/src/libs/statix/src/utils/isNull.utils.js",
		"/src/libs/statix/src/utils/isObject.utils.js",
		"/src/libs/statix/src/utils/isStatix.utils.js",
		"/src/libs/statix/src/utils/isStatixDOMManipulation.utils.js",
		"/src/libs/statix/src/utils/isString.utils.js",
		"/src/libs/statix/src/utils/isUndefined.utils.js",
		"/src/libs/statix/src/utils/precompiled.utils.js",
	];

	try {
		await (await caches.open(G_CACHE_CURR_VERSION)).addAll(STATIC_RESOURCE_PATHS);
	} catch(error) {
		console.error("[WORKER]:", error);
	}
}