export class Confirmation {
	id: number;
	key: number;
	intType: number;
	creator: number;
	confType: ConfirmationType;

	constructor(id: number, key: number, type: number, creator: number) {
		this.id = id;
		this.key = key;
		this.intType = type;
		this.creator = creator;

		//Do a switch simply because we're not 100% certain of all the possible types.
		switch (type) {
			case 1:
				this.confType = ConfirmationType.GenericConfirmation;
				break;
			case 2:
				this.confType = ConfirmationType.Trade;
				break;
			case 3:
				this.confType = ConfirmationType.MarketSellTransaction;
				break;
			default:
				this.confType = ConfirmationType.Unknown;
				break;
		}
	}
}

enum ConfirmationType {
	GenericConfirmation,
	Trade,
	MarketSellTransaction,
	Unknown,
}
