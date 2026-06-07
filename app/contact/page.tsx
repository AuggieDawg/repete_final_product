import { WebManagerFormFrame } from "../../components/webmanager/webmanager-form-frame";
import { webManagerUrls } from "../../lib/webmanager/urls";

export default function Page() {
  return (
    <WebManagerFormFrame
      title="Contact Repete Auto"
      description="Send a direct message to the dealership. This page is for general questions, vehicle questions, hours, location, and next steps."
      src={webManagerUrls.contact}
      iframeHeight={1650}
      actions={[
        { label: "View Inventory", href: "/inventory", variant: "primary" },
        { label: "Location", href: "/location", variant: "ghost" },
      ]}
    />
  );
}
