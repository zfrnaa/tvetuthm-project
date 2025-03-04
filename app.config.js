import 'dotenv/config';
import plugin from 'tailwindcss';

// console.log("ENV - APPWRITE_PROJECT_ENDPOINT:", process.env.APPWRITE_PROJECT_ENDPOINT);
// console.log("ENV - APPWRITE_PROJECT_ID:", process.env.APPWRITE_PROJECT_ID);
// console.log("ENV - APPWRITE_GOOGLE_PROVIDER_ID:", process.env.APPWRITE_GOOGLE_PROVIDER_ID);

export default {
  expo: {
    name: "tvet-asmt-admin",
    slug: "my-app",
    extra: {
      appwriteEndpoint: process.env.APPWRITE_PROJECT_ENDPOINT,
      appwriteProjectId: process.env.APPWRITE_PROJECT_ID,
      appwriteGoogleProvider: process.env.APPWRITE_GOOGLE_PROVIDER_ID,
    },
    platforms: [
      'ios',
      'android',
      'web'
    ],
    plugins: ["expo-localization"]
  },
};
