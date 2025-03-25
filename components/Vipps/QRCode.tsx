import Link from "next/link";
import Image from "next/image";

const QRCode = () => {
  return (
    <Link
      href={"https://qr.vipps.no/28/2/05/031/sbL1rCFrp"}
      className="flex flex-col items-center py-16"
    >
      <Image
        src="/Vipps.png"
        alt="VippsQRKode"
        width={256}
        height={256}
        className="text-center hover:scale-105 transform transition-transform duration-300"
      />
    </Link>
  );
};

export default QRCode;
