self.addEventListener("install", installWorker);
self.addEventListener("fetch", fetchWorker);

function fetchWorker(event) {
	event.respondWith(
    (async () => {
      const cached = await caches.match(event.request);

			if(cached) {
        return cached;
      }

			const response = await fetch(event.request);
      const cache = await caches.open("0.0.1");

			cache.put(event.request, response.clone());

			return response;
    })()
	);
}

function installWorker(event) {
	event.waitUntil(caches.open("0.0.1").then(cache => {
		return cache.addAll([
			// HTML
			"/kompass.html",
			"/index.html",
			// Images
			"/src/imgs/PWA_1_Chrome_Mobile.webp",
			"/src/imgs/PWA_2_Chrome_Mobile.webp",
			"/src/imgs/PWA_3_Chrome_Mobile.webp",
			"/src/imgs/PWA_2_Chrome_PC.webp",
			"/src/imgs/PWA_1_Chrome_PC.webp",
			"/src/imgs/Umberto_Eco.webp",
			"/src/imgs/PWA_1_Edge.webp",
			"/src/imgs/PWA_2_Edge.webp",
			"/src/imgs/PWA_3_Edge.webp",
			// CSS
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
			"/kompass.css",
			"/index.css",
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
		])
	}))
}