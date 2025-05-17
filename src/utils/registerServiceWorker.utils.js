import isJSSupport from "./isJSSupport.utils.js";

export default function registerServiceWorker(path) {
	if(isJSSupport("serviceWorker", navigator)) {
		navigator.serviceWorker.register(path);
	}
}