export class Confirmation {
	/// <summary>
	/// The ID of this confirmation
	/// </summary>
	id: number;

	/// <summary>
	/// The unique key used to act upon this confirmation.
	/// </summary>
	key: number;

	/// <summary>
	/// The value of the data-type HTML attribute returned for this contribution.
	/// </summary>
	intType: number;

	/// <summary>
	/// Represents either the Trade Offer ID or market transaction ID that caused this confirmation to be created.
	/// </summary>
	creator: number;

	/// <summary>
	/// The type of this confirmation.
	/// </summary>
	confType: ConfirmationType;

	public Confirmation(
		id: number,
		key: number,
		type: number,
		creator: number
	) {
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
