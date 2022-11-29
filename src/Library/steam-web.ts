import { COMMUNITY_BASE, MOBILEAUTH_GETWGTOKEN } from "./api-endpoints";
import { isNullOrUndefined, isNullOrUndefinedOrEmptyString } from "./utils";
import { net, session } from "electron";
import { HttpStatusCode } from "./enums/http-status-code.enum";
import { NameValueCollection } from "./types/name-value-collections.type";

export function mobileLoginRequest(
	url: string,
	method: string,
	data: NameValueCollection = null,
	cookies: Electron.CookiesSetDetails[] = null,
	headers: NameValueCollection = null
): string | null {
	return request(
		url,
		method,
		data,
		cookies,
		headers,
		COMMUNITY_BASE +
			"/mobilelogin?oauth_client_id=DE45CD61&oauth_scope=read_profile%20write_profile%20read_client%20write_client"
	);
}

export function request(
	url: string,
	method: string,
	data: NameValueCollection = null,
	cookies: Electron.CookiesSetDetails[] = null,
	headers: NameValueCollection = null,
	referer: string = COMMUNITY_BASE
): string | null {
	let request: Electron.ClientRequest;
	const query: string =
		isNullOrUndefined(data) === true
			? ""
			: Object.entries(data)
					.map(
						(e) => `${encodeURI(e[0])}=${encodeURI(e[1] as string)}`
					)
					.join("&");
	cookies.forEach((cookie) => session.defaultSession.cookies.set(cookie));

	if (method === "GET") {
		url += (url.includes("?") ? "&" : "?") + query;
		request = net.request({
			url: url,
			method: method,
			useSessionCookies: true,
		});
	}

	if (method === "POST") {
		request = net.request({
			url: url,
			method: method,
			useSessionCookies: true,
		});
	}

	request.setHeader(
		"User-Agent",
		"Mozilla/5.0 (Linux; U; Android 4.1.1; en-us; Google Nexus 4 - 4.1.1 - API 16 - 768x1280 Build/JRO03S) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30"
	);
	request.setHeader(
		"Accept",
		"text/javascript, text/html, application/xml, text/xml, */*"
	);
	request.setHeader("Referer", referer);
	Object.entries(headers).forEach(([key, value]) =>
		request.setHeader(key, value as string)
	);

	if (method === "POST") {
		request.setHeader(
			"Content-Type",
			"application/x-www-form-urlencoded; charset=UTF-8"
		);
		request.write(query);
	}
	let responseData: string | null;
	request.on("response", (response) => {
		if (response.statusCode !== HttpStatusCode.Ok) {
			handleFailedWebRequestResponse(response, url);
			responseData = null;
			return;
		}
		response.on("data", (data) => {
			responseData = data.toString();
		});
	});

	request.on("error", (error) => {
		console.error(error);
	});

	request.end();

	return responseData;
}

export function handleFailedWebRequestResponse(
	response: Electron.IncomingMessage,
	requestUrl: string
) {
	if (response == null) return;

	//Redirecting -- likely to a steammobile:// URI
	if (response.statusCode === HttpStatusCode.Found) {
		const location = response.headers["Location"];
		if (isNullOrUndefinedOrEmptyString(location) === false) {
			//Our OAuth token has expired. This is given both when we must refresh our session, or the entire OAuth Token cannot be refreshed anymore.
			//Thus, we should only throw this exception when we're attempting to refresh our session.
			if (
				location === "steammobile://lostauth" &&
				requestUrl === MOBILEAUTH_GETWGTOKEN
			) {
				throw new Error();
			}
		}
	}
}
