import { WebManagerFormFrame } from "../../components/webmanager/webmanager-form-frame";
import { webManagerUrls } from "../../lib/webmanager/urls";

export default function Page() {
  return (
    <WebManagerFormFrame
      title="Find the Right Vehicle"
      description="Looking for something specific? Tell Repete Auto what you want and the team can help watch for inventory that matches your budget, body style, and needs."
      src={webManagerUrls.vehicleFinder}
      iframeHeight={1450}
      actions={[
        { label: "Browse Current Inventory", href: "/inventory", variant: "primary" },
        { label: "Sell or Trade Your Vehicle", href: "/sell-us-your-car", variant: "secondary" },
        { label: "Call Repete Auto", href: "tel:+14357810388", variant: "ghost" },
      ]}
      highlights={[
        "Best when the exact vehicle you want is not currently listed.",
        "Share details like budget, mileage range, body style, drivetrain, and must-have features.",
        "This is a strong option for buyers who know what they want but need help finding it.",
      ]}
    />
  );
}
