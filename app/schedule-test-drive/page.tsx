import { WebManagerFormFrame } from "../../components/webmanager/webmanager-form-frame";
import { webManagerUrls } from "../../lib/webmanager/urls";

export default function Page() {
  return (
    <WebManagerFormFrame
      title="Schedule a Test Drive"
      description="Ready to see a vehicle in person? Request a test drive and Repete Auto will follow up to help confirm availability, timing, and next steps."
      src={webManagerUrls.scheduleTestDrive}
      iframeHeight={1350}
      actions={[
        { label: "View Inventory First", href: "/inventory", variant: "primary" },
        { label: "Call to Confirm Availability", href: "tel:+14357810388", variant: "secondary" },
        { label: "Get Directions", href: "/location", variant: "ghost" },
      ]}
      highlights={[
        "Best when you already know which vehicle you want to see.",
        "Inventory can change, so calling is smart if you are coming from out of town.",
        "Bring your license and any trade-in details if you are serious about buying.",
      ]}
    />
  );
}
