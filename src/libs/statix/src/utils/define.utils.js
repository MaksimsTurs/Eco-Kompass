export default function define(target, name, value) {
	Object.defineProperty(target, name, { configurable: false, enumerable: false, writable: true, value });
}