export default function registerSW(path) {
	if("serviceWorker" in navigator) {
		navigator.serviceWorker.register(path);
	}
}