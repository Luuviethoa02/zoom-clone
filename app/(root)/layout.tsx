import { ThemeProvider } from "@/components/ThemeStream";
import StreamVideoProvider from "@/providers/StreamClientProvider";
import { ReactNode } from "react";

const RootLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <main>
      <StreamVideoProvider>
        <ThemeProvider> {children}</ThemeProvider>
      </StreamVideoProvider>
    </main>
  );
};

export default RootLayout;
