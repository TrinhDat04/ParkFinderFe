export const ENVIRONMENT = {
  serviceUrl: {
    default: 'http://localhost:3000/api',
    auth: 'https://dev-auth.example.com',
    user: 'https://dev-user.example.com',
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
