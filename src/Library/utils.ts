export function getSystemUnixTime(): number {
	return Math.floor(Date.now() / 1000);
}

export function hexStringToByteArray(hex: string): Uint8Array {
	if (isNullOrUndefinedOrEmptyString(hex)) {
		return new Uint8Array(0);
	}
	const ret: number[] = [];
	for (let i = 0, len = hex.length; i < len; i += 2) {
		ret.push(parseInt(hex.substring(i, i + 2), 16));
	}
	return new Uint8Array(ret);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isNullOrUndefined(input: any): boolean {
	return input === null || input === undefined;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isNullOrUndefinedOrEmptyString(input: any): boolean {
	return isNullOrUndefined(input) || input === "";
}
