import { net } from "electron";
import { TWO_FACTOR_TIME_QUERY } from "./api-endpoints";
import { getSystemUnixTime } from "./utils";

export class TimeAligner {
	static _aligned = false;
	static _timeDifference = 0;

	static getSteamTime() {
		if (this._aligned === false) {
			this.alignTime();
		}
		return getSystemUnixTime() + this._timeDifference;
	}

	static alignTime() {
		const currentTime = getSystemUnixTime();
		const request = net.request({
			method: "POST",
			url: TWO_FACTOR_TIME_QUERY,
		});
		request.on("response", (res) => {
			res.on("data", (data) => {
				const response = JSON.parse(data.toString("utf-8"));
				console.log(response);
				console.log(response["response"]["server_time"]);
				this._aligned = true;
				this._timeDifference =
					response["response"]["server_time"] - currentTime;
				console.log(this._timeDifference);
			});
		});
		request.on("error", (error) => {
			console.log(error);
		});
		request.write("steam_id=0");
		request.end();
	}
}
