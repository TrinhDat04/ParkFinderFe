export const ENVIRONMENT = {
  serviceUrl: {
    default: 'https://localhost:7135/api/User',
    auth: 'https://dev-auth.example.com',
    user: 'https://localhost:7135/api/User',
    payment: 'https://dev-payment.example.com',
    products: 'https://dev-product.example.com',
  },
  logLevel: 'debug',
  enableBetaFeatures: true,
  authConfig: {
    clientId: 'dev-client-id',
    clientSecret: 'dev-secret',
  },
  enableAnalytics: false,
};
