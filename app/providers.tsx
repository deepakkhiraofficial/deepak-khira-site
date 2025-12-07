"use client";

import { ChakraProvider, extendTheme, ColorModeScript } from "@chakra-ui/react";
import theme from "./theme";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Inject Chakra UI color mode script */}
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />

      <ChakraProvider theme={theme}>{children}</ChakraProvider>
    </>
  );
}
