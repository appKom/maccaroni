import CountdownTimer from "@/components/Countdown";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const targetDate = new Date("2025-03-29T16:00:00+01:00");

  if (Date.now() < targetDate.getTime()) {
    return <CountdownTimer targetDate={targetDate} />;
  } else {
    return <>{children}</>;
  }
}
