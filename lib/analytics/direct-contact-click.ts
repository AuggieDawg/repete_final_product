export type DirectContactClick = {
  name: "call_click" | "sms_click" | "email_click";
  destination: "phone" | "sms" | "email";
};

export function getDirectContactClick(href: string): DirectContactClick | null {
  if (href.startsWith("tel:")) {
    return { name: "call_click", destination: "phone" };
  }

  if (href.startsWith("sms:")) {
    return { name: "sms_click", destination: "sms" };
  }

  if (href.startsWith("mailto:")) {
    return { name: "email_click", destination: "email" };
  }

  return null;
}
