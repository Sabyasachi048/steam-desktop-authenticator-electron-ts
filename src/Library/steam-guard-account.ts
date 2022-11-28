class SessionData{}

export class SteamGuardAccount {
    sharedSecret: string;
    serialNumber: string;
    revocationCode: string;
    uri: string;
    serverTime: number;
    accountName: string;
    tokenGID:string;
    identitySecret: string;
    secret1:string;
    status:string;
    deviceId: string;
    fullyEnrolled: boolean;
    session: SessionData;
    steamGuardCodeTranslations = [50, 51, 52, 53, 54, 55, 56, 57, 66, 67, 68, 70, 71, 72, 74, 75, 77, 78, 80, 81, 82, 84, 86, 87, 88, 89];
}


public class WGTokenInvalidException : Exception
{
}

public class WGTokenExpiredException : Exception
{
}

private class RefreshSessionDataResponse
{
    [JsonProperty("response")]
    public RefreshSessionDataInternalResponse Response { get; set; }
    internal class RefreshSessionDataInternalResponse
    {
        [JsonProperty("token")]
        public string Token { get; set; }

        [JsonProperty("token_secure")]
        public string TokenSecure { get; set; }
    }
}

private class RemoveAuthenticatorResponse
{
    [JsonProperty("response")]
    public RemoveAuthenticatorInternalResponse Response { get; set; }

    internal class RemoveAuthenticatorInternalResponse
    {
        [JsonProperty("success")]
        public bool Success { get; set; }
    }
}

private class SendConfirmationResponse
{
    [JsonProperty("success")]
    public bool Success { get; set; }
}

private class ConfirmationDetailsResponse
{
    [JsonProperty("success")]
    public bool Success { get; set; }

    [JsonProperty("html")]
    public string HTML { get; set; }
}