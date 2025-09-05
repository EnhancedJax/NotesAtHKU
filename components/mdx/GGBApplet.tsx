"use client";

import React, { useEffect, useRef, useState } from "react";

interface GGBAppletProps {
  material_id: string;
  width?: number;
  height?: number;
  appletParameters?: {
    showToolBar?: boolean;
    showAlgebraInput?: boolean;
    showMenuBar?: boolean;
    // Add other parameters as needed
  };
}

const GGBApplet: React.FC<GGBAppletProps> = ({
  material_id,
  width = 800,
  height = 600,
  appletParameters = {
    showToolBar: false,
    showAlgebraInput: false,
    showMenuBar: false,
  },
}) => {
  const appletRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);

    // Load GeoGebra script if not already loaded
    if (!window.GGBApplet) {
      const script = document.createElement("script");
      script.src = "https://www.geogebra.org/apps/deployggb.js";
      script.async = true;
      script.onload = () => setScriptLoaded(true);
      script.onerror = () => setError("Failed to load GeoGebra");
      document.head.appendChild(script);
      return () => {
        document.head.removeChild(script);
      };
    } else {
      setScriptLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (appletRef.current && isClient && scriptLoaded && window.GGBApplet) {
      const params = {
        ...appletParameters,
        appName: "geometry",
        material_id: material_id,
        width: width,
        height: height,
      };

      const ggbApplet = new window.GGBApplet(params, true);
      ggbApplet.inject(appletRef.current);
    }
  }, [appletParameters, material_id, width, height, isClient, scriptLoaded]);

  if (!isClient) {
    return <div style={{ width, height }} />;
  }

  if (error) {
    return <div style={{ width, height }}>Error: {error}</div>;
  }

  return <div ref={appletRef} style={{ width, height }} />;
};

// Add TypeScript declaration for window.GGBApplet
declare global {
  interface Window {
    GGBApplet: any;
  }
}

export default GGBApplet;
