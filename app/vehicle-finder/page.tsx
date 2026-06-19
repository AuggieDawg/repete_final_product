import type { Metadata } from "next";
import { WebManagerFormFrame } from "../../components/webmanager/webmanager-form-frame";
import { webManagerUrls } from "../../lib/webmanager/urls";

export const metadata: Metadata = {
  title: "Vehicle Finder",
  description:
    "Tell Repete Auto what kind of used car, truck, or SUV you are searching for in Vernal, Utah.",
  alternates: {
    canonical: "/vehicle-finder"
  }
};


export default function Page() {
  return (
    <WebManagerFormFrame
      title="Vehicle Finder"
      description="Looking for something specific? Tell Repete Auto what you are searching for, including budget, body style, drivetrain, mileage range, and must-have features."
      src={webManagerUrls.vehicleFinder}
      iframeHeight={1850}
      actions={[
        { label: "Browse Inventory", href: "/inventory", variant: "primary" },
        { label: "Schedule Test Drive", href: "/schedule-test-drive", variant: "ghost" },
      ]}
    />
  );
}
