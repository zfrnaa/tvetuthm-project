import { Client, Account, ID, Databases } from "appwrite";

const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_PROJECT_ENDPOINT) // Appwrite API Endpoint
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID); // Project ID

export const account = new Account(client);
const databases = new Databases(client);

export { client, ID, databases };
