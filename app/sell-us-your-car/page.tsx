import { WebManagerFormFrame } from "../../components/webmanager/webmanager-form-frame";
import { webManagerUrls } from "../../lib/webmanager/urls";

export default function Page() {
  return (
    <WebManagerFormFrame
      title="Sell or Trade Your Vehicle"
      description="Have a vehicle you want to sell or trade? Send Repete Auto the details so the team can review the vehicle and follow up with the next step."
      src={webManagerUrls.sellUsYourCar}
      iframeHeight={1450}
      actions={[
        { label: "Start Vehicle Details", href: "#form", variant: "primary" },
        { label: "Browse Inventory", href: "/inventory", variant: "secondary" },
        { label: "Call Repete Auto", href: "tel:+14357810388", variant: "ghost" },
      ]}
      highlights={[
        "Best for sellers and trade-in customers who want a direct follow-up.",
        "Accurate mileage, condition, payoff status, and photos help the dealership respond faster.",
        "If you are trading in, browse current inventory first so the team knows what you are interested in.",
      ]}
    />
  );
}
