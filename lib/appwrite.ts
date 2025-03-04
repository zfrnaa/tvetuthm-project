import { Client, Account, ID } from 'react-native-appwrite';
import Constants from "expo-constants";

const client = new Client()
    .setEndpoint(Constants.expoConfig?.extra?.appwriteEndpoint) // Appwrite API Endpoint
    .setProject(Constants.expoConfig?.extra?.appwriteProjectId) // Project ID
    .setPlatform('com.tvet.asmt.admin');

const account = new Account(client);

export { client, account, ID };
