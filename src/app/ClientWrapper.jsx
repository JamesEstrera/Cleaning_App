"use client";

import React from "react";

export default function ClientWrapper({ children }) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // optional: prevent rendering until mounted:
  if (!mounted) return null;

  return <>{children}</>;
}

