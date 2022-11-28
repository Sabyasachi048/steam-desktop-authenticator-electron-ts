import { SessionData } from "./session-data";

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
}

class RefreshSessionDataResponse {
	response: RefreshSessionDataInternalResponse;
}
class RefreshSessionDataInternalResponse {
	token: string;
	tokenSecure: string;
}

class RemoveAuthenticatorResponse {
	response: RefreshSessionDataInternalResponse;
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
