import { businessHours } from "@/lib/site/business-hours";
import { siteConfig } from "@/lib/site/site";
import { createAbsoluteUrl, getBaseUrl } from "@/lib/seo/site-url";

function getOpeningHoursSpecification() {
  return businessHours
    .filter((item) => item.open && item.close)
    .map((item) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: item.day,
      opens: item.open,
      closes: item.close
    }));
}

export function LocalBusinessJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    "@id": `${getBaseUrl()}/#business`,
    name: siteConfig.name,
    url: getBaseUrl(),
    telephone: siteConfig.phoneDisplay,
    email: siteConfig.email,
    image: createAbsoluteUrl("/repete-logo.png"),
    logo: createAbsoluteUrl("/repete-logo.png"),
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.addressLine1,
      addressLocality: "Vernal",
      addressRegion: "UT",
      postalCode: "84078",
      addressCountry: "US"
    },
    areaServed: [
      "Vernal, Utah",
      "Uintah Basin",
      "Naples, Utah",
      "Roosevelt, Utah",
      "Duchesne County, Utah"
    ],
    openingHoursSpecification: getOpeningHoursSpecification(),
    sameAs: []
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c")
      }}
    />
  );
}
