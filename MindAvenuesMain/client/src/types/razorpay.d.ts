declare global {
    interface Window {
      Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
    }
  }
  
  interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    handler?: (response: PaymentResponse) => void;
    theme?: { color: string };
  }
  
  interface RazorpayInstance {
    on(event: 'payment.failed', callback: (response: PaymentFailureResponse) => void): void;
    open(): void;
  }
  
  interface PaymentResponse {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }
  
  interface PaymentFailureResponse {
    error: {
      description: string;
      [key: string]: unknown;
    };
  }