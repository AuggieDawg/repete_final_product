import { notFound } from "next/navigation";
import { WebManagerFormFrame } from "@/components/webmanager/webmanager-form-frame";
import { getInventorySnapshot } from "@/lib/inventory/get-inventory";
import {
  getCreditApplicationCopy,
  getCreditApplicationFrameUrl
} from "@/lib/webmanager/vehicle-action-urls";

export default async function CreditApplicationPage({
  params
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const { slug } = await Promise.resolve(params);
  const snapshot = await getInventorySnapshot();
  const vehicle = snapshot.vehicles.find((item) => item.slug === slug);

  if (!vehicle) notFound();

  const copy = getCreditApplicationCopy(vehicle);

  return (
    <WebManagerFormFrame
      title={copy.title}
      description={copy.description}
      src={getCreditApplicationFrameUrl(vehicle)}
      iframeHeight={2150}
      floatingBackHref={`/inventory/${vehicle.slug}`}
      floatingBackLabel="Back to Vehicle"
      actions={[
        { label: "Back to Vehicle", href: `/inventory/${vehicle.slug}`, variant: "primary" },
        { label: "View Inventory", href: "/inventory", variant: "ghost" }
      ]}
    />
  );
}
