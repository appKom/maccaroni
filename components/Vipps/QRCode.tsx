import Image from "next/image";

const QRCode = () => {
  return (
    <section className="flex flex-col items-center shadow-md">
      <Image
        src="/Vipps.png"
        alt="VippsQRKode"
        width={1000}
        height={1000}
        className="text-center md:hover:scale-105 transform transition-transform duration-300 w-4/5  lg:w-auto"
      />
      <h2 className="text-2xl font-semibold text-center mt-4 text-purple-100">
        Scan QR-koden for Vipps
      </h2>
    </section>
  );
};

export default QRCode;
