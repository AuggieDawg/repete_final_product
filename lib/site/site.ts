export const siteConfig = {
  name: "Repete Auto",
  phoneDisplay: "435-789-2886",
  phoneHref: "tel:14357892886",
  /** E.164 format for structured data (schema.org prefers this). */
  phoneE164: "+14357892886",
  textDisplay: "435-621-2553",
  textHref: "sms:+14356212553",
  email: "pete@repeteauto.com",
  addressLine1: "2295 US-40",
  cityStateZip: "Vernal, UT 84078",
  mapsUrl: "https://maps.google.com/?q=2295+US-40+Vernal+UT+84078",
  /**
   * Coordinates from the Repete Auto Google Business Profile listing.
   * Address string "2295 US-40" matches the GBP formatted address.
   */
  geo: { latitude: 40.4337951, longitude: -109.5713835 },
  instagramUrl: "https://www.instagram.com/repeteauto/",
  inventoryLabel: "Inventory",
  scheduleTestDriveLabel: "Schedule Test Drive",
  vehicleFinderLabel: "Vehicle Finder",
  sellUsYourCarLabel: "Sell or Trade",
  contactLabel: "Contact Us",
  locationLabel: "Location",
  noDocFeesLabel: "NO DOC FEES",
  noDocFeesDescription:
    "Repete Auto does not add a separate dealer documentation fee. Taxes, title, registration, lender fees, and applicable government fees may still apply."
};

export function buildTextHref(message?: string) {
  if (!message) return siteConfig.textHref;

  return `${siteConfig.textHref}?body=${encodeURIComponent(message)}`;
}
