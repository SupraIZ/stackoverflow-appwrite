import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

import { AppwriteException, ID, Models } from "appwrite";
//user side
import { account } from "@/models/client/config";

export interface UserPrefs {
  reputation: number;
}

//THIS ARE ALL THE INTERFACE DEFINATIONS IN-ORDER TO CREATE THE ZUSTAND STORE
interface AuthStore {
  session: Models.Session | null;
  jwt: string | null;
  user: Models.User<UserPrefs> | null;
  hydrated: boolean;

  //this function simply checking things that are into hydration or not.
  setHydrated(): void;
  //to verify the session
  verifySession(): Promise<void>;
  //to login
  login(
    email: string,
    password: string
  ): Promise<{
    success: boolean;
    error?: AppwriteException | null;
  }>;
  //create a new account
  createAccount(
    name: string,
    email: string,
    password: string
  ): Promise<{
    success: boolean;
    error?: AppwriteException | null;
  }>;
  //logout
  logout(): Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    immer((set) => ({
      session: null,
      jwt: null,
      user: null,
      hydrated: false,

      setHydrated() {
        set({ hydrated: true });
      },

      async verifySession() {
        try {
          const session = await account.getSession("current");
          //set here is like the react state variable.
          set({ session });
        } catch (error) {
          console.log(error);
        }
      },

      async login(email: string, password: string) {
        try {
          const session = await account.createEmailPasswordSession(
            email,
            password
          );

          const [user, { jwt }] = await Promise.all([
            account.get<UserPrefs>(),
            account.createJWT(),
          ]);

          if (!user.prefs?.reputation)
            await account.updatePrefs<UserPrefs>({ reputation: 0 });

          set({ session, user, jwt });
          return { success: true };
        } catch (error) {
          console.log(error);
          return {
            success: false,
            error: error instanceof AppwriteException ? error : null,
          };
        }
      },

      async createAccount(name: string, email: string, password: string) {
        try {
          await account.create(ID.unique(), email, password, name);
          return { success: true };
        } catch (error) {
          console.log(error);
          return {
            success: false,
            error: error instanceof AppwriteException ? error : null,
          };
        }
      },

      async logout() {
        try {
          await account.deleteSessions();
          set({ session: null, user: null, jwt: null });
        } catch (error) {
          console.log(error);
        }
      },
    })),
    {
      name: "auth",
      onRehydrateStorage() {
        return (state, error) => {
          if (!error) state?.setHydrated();
        };
      },
    }
  )
);
