export const STEAMAPI_BASE = "https://api.steampowered.com";
export const COMMUNITY_BASE = "https://steamcommunity.com";
export const MOBILEAUTH_BASE = STEAMAPI_BASE + "/IMobileAuthService/%s/v0001";
export const MOBILEAUTH_GETWGTOKEN = MOBILEAUTH_BASE.replace(
	"%s",
	"GetWGToken"
);
export const TWO_FACTOR_BASE = STEAMAPI_BASE + "/ITwoFactorService/%s/v0001";
export const TWO_FACTOR_TIME_QUERY = TWO_FACTOR_BASE.replace("%s", "QueryTime");
