import type { Metadata } from "next";
import { WebManagerFormFrame } from "../../components/webmanager/webmanager-form-frame";
import { webManagerUrls } from "../../lib/webmanager/urls";

export const metadata: Metadata = {
  title: "Sell or Trade Your Vehicle",
  description:
    "Sell or trade your vehicle with Repete Auto in Vernal, Utah. Send vehicle details so the dealership can review the opportunity.",
  alternates: {
    canonical: "/sell-us-your-car"
  }
};


export default function Page() {
  return (
    <WebManagerFormFrame
      title="Sell or Trade Your Vehicle"
      description="Have a vehicle you want to sell or trade? Send Repete Auto the details so the team can review the opportunity and follow up with the next step."
      src={webManagerUrls.sellUsYourCar}
      iframeHeight={1850}
      actions={[
        { label: "Browse Inventory", href: "/inventory", variant: "primary" },
        { label: "Vehicle Finder", href: "/vehicle-finder", variant: "ghost" },
      ]}
    />
  );
}
