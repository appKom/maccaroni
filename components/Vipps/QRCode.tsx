import Image from "next/image";

const QRCode = () => {
  return (
    <div className="flex flex-col items-center py-0 lg:py-16">
      <Image
        src="/Vipps.png"
        alt="VippsQRKode"
        width={1000}
        height={1000}
        className="text-center hover:scale-105 transform transition-transform duration-300 size-52 lg:size-auto"
      />
    </div>
  );
};

export default QRCode;
