export const ENVIRONMENT = {
  serviceUrl: {
    default: 'https://localhost:7135/api',
    auth: 'https://localhost:7135/api/user',
    user: 'https://dev-user.example.com',
    payment: 'https://dev-payment.example.com',
    products: 'https://dev-product.example.com',
    tile: 'https://localhost:7135',
    parkingLot: 'https://localhost:7135/api/parkingLot',
  },
  logLevel: 'debug',
  enableBetaFeatures: true,
  authConfig: {
    clientId: 'dev-client-id',
    clientSecret: 'dev-secret',
  },
  enableAnalytics: false,
  mapboxAccessToken:
    'pk.eyJ1IjoibmhhdG5tMTIzIiwiYSI6ImNtODJkdzdrYjBiZzEya3NhZXBvNzV4eWYifQ.T-cwvyhjH_EdZ-c6tKYRaQ',
  tileSetStyle: 'mapbox://styles/nhatnm123/cm7n5ry8s00xy01r3g2azhk07',
  firebaseConfig: {
    apiKey: "AIzaSyCfPFbD42eVouxySAlaIWA8SBbET1eUziU",
    authDomain: "park-finder-b94fa.firebaseapp.com",
    projectId: "park-finder-b94fa",
    storageBucket: "park-finder-b94fa.firebasestorage.app",
    messagingSenderId: "301214425383",
    appId: "1:301214425383:web:89e115649d2062408f0902",
    measurementId: "G-YQV3DN336Z"
  }
};
