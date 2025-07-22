import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class PaypalService {
  private readonly clientId = process.env.PAYPAL_CLIENT_ID;
  private readonly secret = process.env.PAYPAL_SECRET;
  private readonly baseUrl = 'https://api-m.sandbox.paypal.com';

  async getAccessToken(): Promise<string> {
    const response = await axios.post(
      `${this.baseUrl}/v1/oauth2/token`,
      'grant_type=client_credentials',
      {
        auth: {
          username: this.clientId,
          password: this.secret,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );
    return response.data.access_token;
  }

  async getSubscription(subscriptionId: string): Promise<any> {
    const token = await this.getAccessToken();
    const response = await axios.get(
      `${this.baseUrl}/v1/billing/subscriptions/${subscriptionId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  }


  async verifyOrder(orderId: string): Promise<any> {
    const token = await this.getAccessToken();

    const response = await axios.get(
      `${this.baseUrl}/v2/checkout/orders/${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  }

}
