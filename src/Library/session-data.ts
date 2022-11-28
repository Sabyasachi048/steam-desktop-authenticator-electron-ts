const steamcommunityUrl = `https://steamcommunity.com/`;
const defaultPath = `/`;
const defaultDomain = `.steamcommunity.com`;

export class SessionData {
	sessionId: string;
	steamLogin: string;
	steamLoginSecure: string;
	webCookie: string;
	oAuthToken: string;
	steamId: number;

	addCookies(cookies: Electron.Cookies) {
		const cookiesToSet: Electron.CookiesSetDetails[] = [
			{
				url: steamcommunityUrl,
				name: "mobileClientVersion",
				value: "0 (2.1.3)",
				path: defaultPath,
				domain: defaultDomain,
			},
			{
				url: steamcommunityUrl,
				name: "mobileClient",
				value: "android",
				path: defaultPath,
				domain: defaultDomain,
			},
			{
				url: steamcommunityUrl,
				name: "steamid",
				value: this.steamId.toString(),
				path: defaultPath,
				domain: defaultDomain,
			},
			{
				url: steamcommunityUrl,
				name: "steamLogin",
				value: this.steamLogin,
				path: defaultPath,
				domain: defaultDomain,
			},
			{
				url: steamcommunityUrl,
				name: "steamLoginSecure",
				value: this.steamLoginSecure,
				path: defaultPath,
				domain: defaultDomain,
				httpOnly: true,
				secure: true,
			},
			{
				url: steamcommunityUrl,
				name: "Steam_Language",
				value: "english",
				path: defaultPath,
				domain: defaultDomain,
			},
			{
				url: "dob",
				value: "",
				path: defaultPath,
				domain: defaultDomain,
			},
			{
				url: "sessionid",
				value: this.sessionId,
				path: defaultPath,
				domain: defaultDomain,
			},
		];

		cookiesToSet.forEach((cookie) => cookies.set(cookie));
	}
}
