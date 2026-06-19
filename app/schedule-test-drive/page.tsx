import type { Metadata } from "next";
import { WebManagerFormFrame } from "../../components/webmanager/webmanager-form-frame";
import { webManagerUrls } from "../../lib/webmanager/urls";

export const metadata: Metadata = {
  title: "Schedule a Test Drive",
  description:
    "Schedule a test drive with Repete Auto in Vernal, Utah. Call ahead to confirm vehicle availability before making the trip.",
  alternates: {
    canonical: "/schedule-test-drive"
  }
};


export default function Page() {
  return (
    <WebManagerFormFrame
      title="Schedule a Test Drive"
      description="Request a time to see a vehicle in person. If you are driving from outside Vernal, call first to confirm availability before making the trip."
      src={webManagerUrls.scheduleTestDrive}
      iframeHeight={1750}
      actions={[
        { label: "View Inventory", href: "/inventory", variant: "primary" },
        { label: "Location", href: "/location", variant: "ghost" },
      ]}
    />
  );
}
