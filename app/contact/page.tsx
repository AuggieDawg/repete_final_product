import { WebManagerFormFrame } from "../../components/webmanager/webmanager-form-frame";
import { webManagerUrls } from "../../lib/webmanager/urls";

export default function Page() {
  return (
    <WebManagerFormFrame
      title="Talk to Repete Auto"
      description="Have a question about a vehicle, trade-in, financing, or the dealership? Send the team a message and Repete Auto will follow up through the same workflow they already use today."
      src={webManagerUrls.contact}
      iframeHeight={1250}
      actions={[
        { label: "Call Repete Auto", href: "tel:+14357810388", variant: "primary" },
        { label: "View Inventory", href: "/inventory", variant: "secondary" },
        { label: "Get Directions", href: "/location", variant: "ghost" },
      ]}
      highlights={[
        "Best for general questions, dealership information, and quick follow-up.",
        "Use the inventory page first if you are asking about a specific vehicle.",
        "For urgent questions, calling the dealership is the fastest path.",
      ]}
    />
  );
}
