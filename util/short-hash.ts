// modified https://stackoverflow.com/a/7616484
export const shortHash = (str: string): string => {
	// tslint:disable:no-bitwise
	let hash = 0;
	if (typeof str !== "string" || str.length === 0) {
		return String(hash);
	}
	for (let i = 0; i < str.length; i++) {
		const char = str.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash = hash & hash; // convert to 32bit integer
	}
	hash = hash >>> 0; // convert signed to unsigned https://stackoverflow.com/a/1908655
	return Number(hash).toString(32).toUpperCase(); // make the hash small, convert base10 to base32
	// tslint:enable:no-bitwise
};
