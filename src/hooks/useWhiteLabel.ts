
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

// Type definitions
interface WhiteLabelConfig {
  logoUrl?: string;
  companyName?: string;
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
  darkMode?: boolean;
  customDomain?: string;
}

interface DomainMapping {
  [domain: string]: WhiteLabelConfig;
}

// Default configuration
const defaultConfig: WhiteLabelConfig = {
  logoUrl: "/logo.svg",
  companyName: "Vitale Health Concierge",
  primaryColor: "#0284c7",
  secondaryColor: "#e11d48",
  fontFamily: "Inter, system-ui, sans-serif",
  darkMode: false,
};

// Domain-specific configurations
const domainConfigs: DomainMapping = {
  "acme-health.example.com": {
    logoUrl: "/acme-logo.svg",
    companyName: "ACME Health Solutions",
    primaryColor: "#2563eb",
    secondaryColor: "#7c3aed",
  },
  "wellness-plus.example.com": {
    logoUrl: "/wellness-logo.svg",
    companyName: "Wellness Plus",
    primaryColor: "#059669",
    secondaryColor: "#0891b2",
    darkMode: true,
  },
};

export const useWhiteLabel = () => {
  const [config, setConfig] = useState<WhiteLabelConfig>(defaultConfig);
  const [isCustomDomain, setIsCustomDomain] = useState(false);
  const location = useLocation();

  // Function to get configuration based on hostname
  const getConfigForDomain = (hostname: string): WhiteLabelConfig => {
    // Check if we have a specific config for this domain
    if (domainConfigs[hostname]) {
      return { ...defaultConfig, ...domainConfigs[hostname] };
    }
    
    return defaultConfig;
  };

  useEffect(() => {
    const hostname = window.location.hostname;
    
    // Check if we're on a custom domain
    const isCustom = hostname !== "localhost" && 
                    !hostname.includes("vitalehealth.app") &&
                    !hostname.endsWith(".vercel.app");
    
    setIsCustomDomain(isCustom);
    
    // Get and apply the configuration
    const domainConfig = getConfigForDomain(hostname);
    setConfig({ ...domainConfig, customDomain: isCustom ? hostname : undefined });
    
    // Apply some global styles based on the config
    if (domainConfig.primaryColor) {
      document.documentElement.style.setProperty('--primary', domainConfig.primaryColor);
    }
    
    if (domainConfig.secondaryColor) {
      document.documentElement.style.setProperty('--secondary', domainConfig.secondaryColor);
    }
    
    if (domainConfig.fontFamily) {
      document.documentElement.style.setProperty('--font-family', domainConfig.fontFamily);
    }
    
  }, [location]);

  return {
    ...config,
    isCustomDomain,
  };
};
