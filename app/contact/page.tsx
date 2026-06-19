import type { Metadata } from "next";
import { WebManagerFormFrame } from "../../components/webmanager/webmanager-form-frame";
import { webManagerUrls } from "../../lib/webmanager/urls";

export const metadata: Metadata = {
  title: "Contact Repete Auto",
  description:
    "Contact Repete Auto in Vernal, Utah with questions about vehicles, availability, trade-ins, financing, or visiting the lot.",
  alternates: {
    canonical: "/contact"
  }
};


export default function Page() {
  return (
    <WebManagerFormFrame
      title="Contact Repete Auto"
      description="Have a question about a vehicle, availability, trade-ins, financing, or visiting the lot? Send Repete Auto a message and the team will follow up."
      src={webManagerUrls.contact}
      iframeHeight={1650}
      actions={[
        { label: "View Inventory", href: "/inventory", variant: "primary" },
        { label: "Location", href: "/location", variant: "ghost" },
      ]}
    />
  );
}
