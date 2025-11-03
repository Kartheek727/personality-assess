"use client";

import { Provider as ReduxProvider } from "react-redux";
import store from "@/redux/store";
import ThemeRegistry from "@/Providers/ThemeRegistry";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "react-hot-toast";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <AuthProvider>
        <ThemeRegistry>
          <div className="w-full min-w-0">
            {children}
            <Toaster position="top-right" />
          </div>
        </ThemeRegistry>
      </AuthProvider>
    </ReduxProvider>
  );
}