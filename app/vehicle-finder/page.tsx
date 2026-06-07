import { WebManagerFormFrame } from "../../components/webmanager/webmanager-form-frame";
import { webManagerUrls } from "../../lib/webmanager/urls";

export default function Page() {
  return (
    <WebManagerFormFrame
      title="Vehicle Finder"
      description="Tell Repete Auto what you are looking for. This is for buyers who want a specific car, truck, SUV, budget range, drivetrain, or feature set."
      src={webManagerUrls.vehicleFinder}
      iframeHeight={1850}
      actions={[
        { label: "Browse Inventory", href: "/inventory", variant: "primary" },
        { label: "Schedule Test Drive", href: "/schedule-test-drive", variant: "ghost" },
      ]}
    />
  );
}
