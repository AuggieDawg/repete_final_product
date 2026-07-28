import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WebManagerFormFrame } from "@/components/webmanager/webmanager-form-frame";
import {
  findVehicleOrThrowWhenUnhealthy,
  getInventorySnapshot
} from "@/lib/inventory/get-inventory";
import { webManagerUrls } from "@/lib/webmanager/urls";

export const metadata: Metadata = {
  title: "Schedule a Test Drive",
  robots: {
    index: false,
    follow: false
  }
};


export default async function VehicleScheduleTestDrivePage({
  params
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const { slug } = await Promise.resolve(params);
  const snapshot = await getInventorySnapshot();
  const vehicle = findVehicleOrThrowWhenUnhealthy(snapshot, slug);

  if (!vehicle) notFound();

  return (
    <WebManagerFormFrame
      title="Schedule a Test Drive"
      description={`Request a time to see this ${vehicle.title} in person. If you are driving from outside Vernal, call first to confirm availability before making the trip.`}
      src={webManagerUrls.scheduleTestDrive}
      iframeHeight={1750}
      floatingBackHref={`/inventory/${vehicle.slug}`}
      floatingBackLabel="Back to Vehicle"
      formIntent="schedule_test_drive"
      formContext="vehicle"
      actions={[
        { label: "Back to Vehicle", href: `/inventory/${vehicle.slug}`, variant: "primary" },
        { label: "View Inventory", href: "/inventory", variant: "ghost" }
      ]}
    />
  );
}
