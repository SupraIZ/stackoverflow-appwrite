import env from "@/app/env";

import { Client, Avatars, Databases, Storage, Users } from "node-appwrite";

// eslint-disable-next-line prefer-const
let client = new Client();

client
  .setEndpoint(env.appwrite.endpoint) // Your API Endpoint
  .setProject(env.appwrite.projectid) // Your project ID
  .setKey(env.appwrite.apikey); // Your secret API key

const databases = new Databases(client);
const users = new Users(client);
const avatars = new Avatars(client);
const storage = new Storage(client);

export { client, databases, users, avatars, storage };
