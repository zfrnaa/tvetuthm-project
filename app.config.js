import 'dotenv/config';

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
      clerkPublishableKey: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
      expoClientId: "794069632485-1sq9tbcl34ftkkfb9nq1vv16ma1lq3v9.apps.googleusercontent.com",
      redirectUrl: "exp://127.0.0.1:19000/--/clerk-callback",
    },
    platforms: [
      'ios',
      'android',
      'web'
    ],
    plugins: ["expo-localization"]
  },
};
