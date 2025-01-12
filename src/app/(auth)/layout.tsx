import { useAuthStore } from "@/store/Auth";
import { useRouter } from "next/router";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { session } = useAuthStore();
  const router = useRouter();

  //redirect if user is logged in
  React.useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  //if user is logged in, do not show the layout
  if (session) {
    return null;
  }

  return (
    <div className="">
      <div className="">{children}</div>
    </div>
  );
};

export default Layout;
