import Image from "next/image";
import Marquee from "react-fast-marquee";

export const HeroSection = () => {
  return (
    <section className="my-4">
      {/* Hero Image */}
      <div className="relative w-full max-w-6xl mx-auto overflow-hidden rounded-xl">
        <Image
          height={300}
          width={800}
          src="/hero.png"
          alt="CashFlow BD - Exchange your leads here"
          className="w-full h-auto object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent rounded-2xl"></div>
      </div>

      {/* Marquee Section */}
      <div className=" bg-gradient-to-r from-red-600 to-pink-600 py-3 mt-5 max-w-6xl mx-auto rounded-xl">
        <Marquee pauseOnHover={true} gradient={false} speed={50}>
          <span className="text-sm md:text-base text-white font-medium">
            মেথা থাকলেই আকর্ষে মেধাবী হলা যায় না, মেধাবী হলো সেই যার মেতো না
            থাকো সত্ত্বও টাকা দিয়ে ঘরে নিয়ে আসতে পারে টাকা!
          </span>
        </Marquee>
      </div>
    </section>
  );
};
