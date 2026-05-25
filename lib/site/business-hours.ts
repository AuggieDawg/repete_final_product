export type DayKey =
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday";

export type BusinessDay = {
  day: string;
  key: DayKey;
  open: string | null;
  close: string | null;
  label: string;
};

export const DEALER_TIME_ZONE =
  process.env.DEALER_TIME_ZONE || "America/Denver";

export const businessHours: BusinessDay[] = [
  { day: "Monday", key: "monday", open: "09:00", close: "18:00", label: "9:00 AM - 6:00 PM" },
  { day: "Tuesday", key: "tuesday", open: "09:00", close: "18:00", label: "9:00 AM - 6:00 PM" },
  { day: "Wednesday", key: "wednesday", open: "09:00", close: "18:00", label: "9:00 AM - 6:00 PM" },
  { day: "Thursday", key: "thursday", open: "09:00", close: "18:00", label: "9:00 AM - 6:00 PM" },
  { day: "Friday", key: "friday", open: "09:00", close: "18:00", label: "9:00 AM - 6:00 PM" },
  { day: "Saturday", key: "saturday", open: "10:00", close: "14:00", label: "10:00 AM - 2:00 PM" },
  { day: "Sunday", key: "sunday", open: null, close: null, label: "Closed" }
];

const dayMap: Record<string, DayKey> = {
  Sunday: "sunday",
  Monday: "monday",
  Tuesday: "tuesday",
  Wednesday: "wednesday",
  Thursday: "thursday",
  Friday: "friday",
  Saturday: "saturday"
};

function timeToMinutes(value: string): number {
  const [hour, minute] = value.split(":").map(Number);
  return hour * 60 + minute;
}

export function getDealerDateParts(date = new Date()) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: DEALER_TIME_ZONE,
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });

  const parts = formatter.formatToParts(date);
  const weekday = parts.find((part) => part.type === "weekday")?.value || "Sunday";
  const hour = Number(parts.find((part) => part.type === "hour")?.value || "0");
  const minute = Number(parts.find((part) => part.type === "minute")?.value || "0");

  return {
    weekday,
    dayKey: dayMap[weekday] || "sunday",
    hour,
    minute,
    minutesAfterMidnight: hour * 60 + minute
  };
}

export function getTodayBusinessHours(date = new Date()) {
  const { dayKey } = getDealerDateParts(date);
  return businessHours.find((item) => item.key === dayKey) || businessHours[6];
}

export function isDealerOpen(date = new Date()): boolean {
  const today = getTodayBusinessHours(date);

  if (!today.open || !today.close) {
    return false;
  }

  const { minutesAfterMidnight } = getDealerDateParts(date);
  return (
    minutesAfterMidnight >= timeToMinutes(today.open) &&
    minutesAfterMidnight < timeToMinutes(today.close)
  );
}

export function getInventoryCachePolicy(date = new Date()) {
  const today = getTodayBusinessHours(date);
  const open = isDealerOpen(date);

  if (open) {
    return {
      mode: "business-hours",
      ttlSeconds: 60 * 60,
      label: "Refresh target: every 60 minutes while Repete Auto is open."
    };
  }

  if (today.key === "sunday") {
    return {
      mode: "closed-sunday",
      ttlSeconds: 12 * 60 * 60,
      label: "Refresh target: every 12 hours on Sunday."
    };
  }

  return {
    mode: "after-hours",
    ttlSeconds: 6 * 60 * 60,
    label: "Refresh target: every 6 hours after business hours."
  };
}
