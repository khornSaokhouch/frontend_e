import Image from "next/image";

export default function PaymentMethods() {
  return (
    <section className="mt-2">
      <div className="flex items-center justify-center lg:justify-start gap-6 w-full">
        <div className="relative h-60 flex-1">
          <Image src="/visa.png" alt="Visa" fill className="object-contain" />
        </div>
        <div className="relative h-60 flex-1">
          <Image src="/acleda.png" alt="ACLEDA" fill className="object-contain" />
        </div>
      </div>
    </section>
  );
}