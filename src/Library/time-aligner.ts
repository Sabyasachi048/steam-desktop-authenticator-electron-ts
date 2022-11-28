import axios from "axios";
import { TWO_FACTOR_TIME_QUERY } from "./api-endpoints";
import { getSystemUnixTime } from "./utils";

export class TimeAligner {
	static _aligned = false;
	static _timeDifference = 0;

	static async alignTimeAsync() {
		const currentTime = getSystemUnixTime();

		try {
			const response = await axios.post(
				TWO_FACTOR_TIME_QUERY,
				"steam_id=0"
			);
			const {
				response: { server_time: serverTime },
			} = response.data;
			this._timeDifference = serverTime - currentTime;
			this._aligned = true;
			console.log(this);
		} catch (error) {
			console.log(error);
		}
	}
}
