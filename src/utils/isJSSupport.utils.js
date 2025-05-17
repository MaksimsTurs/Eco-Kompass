const isJSSupport = (feauterName, target = null) => (window || target)[feauterName] !== undefined;

export default isJSSupport;