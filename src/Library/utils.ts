import Base64 from "crypto-js/enc-base64";
import Hex from "crypto-js/enc-hex";
import WordArray from "crypto-js/lib-typedarrays";

export function getSystemUnixTime(): number {
	return Math.floor(Date.now() / 1000);
}

export function hexStringToByteArray(hex: string): WordArray {
	return Hex.parse(hex);
}

export function base64ToArrayBuffer(base64: string): WordArray {
	return Base64.parse(base64);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isNullOrUndefined(input: any): boolean {
	return input === null || input === undefined;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isNullOrUndefinedOrEmptyString(input: any): boolean {
	return isNullOrUndefined(input) || input === "";
}
