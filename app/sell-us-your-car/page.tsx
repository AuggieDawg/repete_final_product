import { WebManagerFormFrame } from "../../components/webmanager/webmanager-form-frame";
import { webManagerUrls } from "../../lib/webmanager/urls";

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
