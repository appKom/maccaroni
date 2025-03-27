import ErrorPage from "@/components/ErrorPage";

export default function NotFound() {
  return (
    <ErrorPage
      code={404}
      title="Siden ble ikke funnet"
      description="Oops! Siden du leter etter kan ha blitt fjernet eller er midlertidig utilgjengelig."
    />
  );
}
