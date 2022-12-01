import { Confirmation } from "./confirmation";
import { NameValueCollection } from "./types/name-value-collections.type";
import { SessionData } from "./session-data";
import * as SteamWeb from "./steam-web";
import { COMMUNITY_BASE, STEAMAPI_BASE } from "./api-endpoints";
import {
	base64ToArrayBuffer,
	hexStringToByteArray,
	isNullOrUndefined,
	isNullOrUndefinedOrEmptyString,
} from "./utils";
import { TimeAligner } from "./time-aligner";
import { HmacSHA1 } from "crypto-js";

export class SteamGuardAccount {
	sharedSecret: string;
	serialNumber: string;
	revocationCode: string;
	uri: string;
	serverTime: number;
	accountName: string;
	tokenGID: string;
	identitySecret: string;
	secret1: string;
	status: string;
	deviceId: string;
	fullyEnrolled: boolean;
	session: SessionData;
	steamGuardCodeTranslations = [
		50, 51, 52, 53, 54, 55, 56, 57, 66, 67, 68, 70, 71, 72, 74, 75, 77, 78,
		80, 81, 82, 84, 86, 87, 88, 89,
	];

	/**
	 *
	 * @param scheme
	 * @returns a boolean indicating if deactivation of the authenticator was successful
	 */
	deactivateAuthenticator(scheme = 2): boolean {
		const postData: NameValueCollection = {
			steamid: this.session.steamId.toString(),
			steamguard_scheme: scheme.toString(),
			revocation_code: this.revocationCode,
			access_token: this.session.oAuthToken,
		};
		try {
			const response = SteamWeb.mobileLoginRequest(
				`${STEAMAPI_BASE}/ITwoFactorService/RemoveAuthenticator/v0001`,
				"POST",
				postData
			);
			const removeResponse = JSON.parse(
				response
			) as RemoveAuthenticatorResponse;
			if (
				isNullOrUndefined(removeResponse) === true ||
				isNullOrUndefined(removeResponse.response) === true ||
				removeResponse.response.success !== true
			) {
				return true;
			}
		} catch (err) {
			return false;
		}
	}
	/**
	 *
	 * @returns the generated steam guard code
	 */
	generateSteamGuardCode(): string {
		return this.generateSteamGuardCodeForTime(TimeAligner.getSteamTime());
	}
	/**
	 *
	 * @param time the current steam time
	 * @returns the generated steam guard code
	 */
	generateSteamGuardCodeForTime(time: number): string {
		if (
			isNullOrUndefined(this.sharedSecret) === true ||
			isNullOrUndefinedOrEmptyString(this.sharedSecret) === true
		) {
			return "";
		}
		const sharedSecretUnescaped: string = encodeURI(this.sharedSecret);
		const sharedSecretArray = base64ToArrayBuffer(sharedSecretUnescaped);
		const timeArray = new Uint8Array(8);
		time = Math.floor(time / 30);
		for (let i = 8; i > 0; i--) {
			timeArray[i - 1] = time;
			time = time >> 8;
		}
		const hashedData = HmacSHA1(
			sharedSecretArray,
			hexStringToByteArray(timeArray.toString())
		);
		const codeArray = [];
		try {
			const b = hashedData.words[19] & 0xf;
			let codePoint =
				((hashedData.words[b] & 0x7f) << 24) |
				((hashedData.words[b + 1] & 0xff) << 16) |
				((hashedData.words[b + 2] & 0xff) << 8) |
				(hashedData.words[b + 3] & 0xff);
			for (let i = 0; i < 5; i++) {
				codeArray.push(
					this.steamGuardCodeTranslations[
						codePoint % this.steamGuardCodeTranslations.length
					]
				);
				codePoint /= this.steamGuardCodeTranslations.length;
			}
		} catch (err) {
			return null;
		}
		const codeArrayString = codeArray.join("").toString();
		return CryptoJS.enc.Utf8.stringify(
			CryptoJS.enc.Hex.parse(codeArrayString)
		);
	}
	generateConfirmationURL(tag = "conf"): string {
		const endpoint = `${COMMUNITY_BASE}/mobileconf/conf?`;
		const queryString = this.generateConfirmationQueryParams(tag);
		return `${endpoint}${queryString}`;
	}

	generateConfirmationQueryParams(tag: string): string {
		if (isNullOrUndefinedOrEmptyString(this.deviceId)) {
			throw new Error("Device ID is not present");
		}

		const queryParams = this.generateConfirmationQueryParamsAsNVC(tag);

		return (
			"p=" +
			queryParams["p"] +
			"&a=" +
			queryParams["a"] +
			"&k=" +
			queryParams["k"] +
			"&t=" +
			queryParams["t"] +
			"&m=android&tag=" +
			queryParams["tag"]
		);
	}
	generateConfirmationQueryParamsAsNVC(tag: string) {
		if (isNullOrUndefinedOrEmptyString(this.deviceId)) {
			throw new Error("Device ID is not present");
		}
		const time = TimeAligner.getSteamTime();

		const ret: NameValueCollection = {
			p: this.deviceId,
			a: this.session.steamId.toString(),
			k: this._generateConfirmationHashForTime(time, tag),
			t: time.toString(),
			m: "android",
			tag: tag,
		};

		return ret;
	}
	private _generateConfirmationHashForTime(time: number, tag: string): any {
		throw new Error("Method not implemented.");
	}
	/**
	 *
	 * @returns
	 */
	fetchConfirmation(): Confirmation[] {
		const url = this.generateConfirmationURL();
		const cookies: Electron.CookiesSetDetails[] = this.session.addCookies(
			[]
		);
		const response = SteamWeb.request(url, "GET", null, cookies);
		return this.fetchConfirmationInternal(response);
	}
	/**
	 *
	 * @param response
	 */
	fetchConfirmationInternal(response: string): Confirmation[] {
		const confRegex = new RegExp(
			'<div class="mobileconf_list_entry" id="conf[0-9]+" data-confid="(\\d+)" data-key="(\\d+)" data-type="(\\d+)" data-creator="(\\d+)"'
		);

		if (
			isNullOrUndefined(response) === true ||
			confRegex.test(response) === false
		) {
			if (
				isNullOrUndefined(response) === true ||
				response.includes("<div>Nothing to confirm</div>") === false
			) {
				throw new Error();
			}
			return [];
		}

		const confirmations = confRegex.exec(response);
	}
}

class RefreshSessionDataResponse {
	response: RefreshSessionDataInternalResponse;
}
class RefreshSessionDataInternalResponse {
	token: string;
	tokenSecure: string;
}

class RemoveAuthenticatorResponse {
	response: RemoveAuthenticatorInternalResponse;
}
class RemoveAuthenticatorInternalResponse {
	success: boolean;
}

class SendConfirmationResponse {
	success: boolean;
}

class ConfirmationDetailsResponse {
	success: boolean;
	HTML: boolean;
}
