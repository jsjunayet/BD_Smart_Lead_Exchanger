import Image from "next/image";
import Marquee from "react-fast-marquee";

export const HeroSection = () => {
  return (
    <section className="my-4">
      <div className=" bg-gradient-to-r from-blue-600 to-green-600 mb-4 py-3 mt-5 max-w-6xl mx-auto rounded-xl">
        <Marquee pauseOnHover={true} gradient={false} speed={50}>
          <span className="text-sm md:text-base text-white font-medium">
            পরিশ্রম সৌভাগ্যের প্রসূতি ও সময় এবং সততা মূল্যবান ।
            পরিশ্রম,সময়,সততার সাথে শ্রম দিলে প্রতিটি ব্যক্তি অবশ্যই
            সফলতা অর্জন করবেই।
          </span>
        </Marquee>
      </div>
      {/* Hero Image */}
      <div className="relative w-full max-w-6xl mx-auto overflow-hidden rounded-xl">
        <Image
          height={300}
          width={500}
          src="/hero_1.png"
          alt="CashFlow BD - Exchange your leads here"
          className="w-full sm:h-[600px] h-auto object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent rounded-2xl"></div>
      </div>

      {/* Marquee Section */}
    </section>
  );
};
