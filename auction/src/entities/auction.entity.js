import { v4 } from 'uuid';
import { STATUS } from '../lib/constants/auctionStatus';

export class Auction {
  _title;
  _body;
  _email;

  constructor(title, body, email) {
    this._title = title;
    this._body = body;
    this._email = email;
  }

  bundle() {
    const now = new Date();
    const endDate = new Date();
    endDate.setHours(now.getHours() + 1);

    return {
      id: v4(),
      title: this._title,
      body: this._body,
      status: STATUS.OPEN,
      createdAt: now.toISOString(),
      endingAt: endDate.toISOString(),
      seller: this._email,
      highestBid: {
        amount: 0,
      },
    };
  }
}
