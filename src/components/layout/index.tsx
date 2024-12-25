import React from "react";
import { ThemedTitleV2, ThemedLayoutV2 } from "@refinedev/antd";
import Header from "./Header";

function Layout({ children }: React.PropsWithChildren) {
  return (
    <ThemedLayoutV2
      Header={Header}
      Title={(titleProps) => <ThemedTitleV2 {...titleProps} text="Dashboard" />}
    >
      {children}
    </ThemedLayoutV2>
  );
}

export default Layout;
