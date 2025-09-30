"use client";
import { CheckCircle, Play, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const FeaturesSection = () => {
  const features = [
    "Free registration – start exchanging leads instantly",
    "All listings are manually verified for authenticity",
    "Real-time chat and secure deal negotiation",
    "Private, personalized, and highly secure transactions",
    "The first lead exchange platform in Bangladesh with trust & transparency",
  ];

  const [showVideo, setShowVideo] = useState(false);

  return (
    <>
      {/* Main Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-6xl mx-auto  ">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Features */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold text-gray-800 mb-4">
                  Why choose{" "}
                  <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                    BDSmartLeadX
                  </span>
                </h2>
              </div>

              <div className="space-y-6">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-4 animate-fade-in"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <div className="flex-shrink-0 mt-1">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <span className="text-lg text-gray-700 font-medium">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-6">
                <button className="bg-gradient-to-r from-blue-600 to-green-600  text-white px-8 py-4 rounded-xl font-semibold hover:from-red-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                  Register Now
                </button>
              </div>
            </div>

            {/* Right side - Video Preview */}
            <div className="relative">
              <div
                className="relative bg-gradient-to-br from-blue-100 to-green-100 rounded-3xl p-8 shadow-2xl cursor-pointer"
                onClick={() => setShowVideo(true)}
              >
                <Image
                  width={800}
                  height={600}
                  src="/video.jpg"
                  alt="Happy couple illustration"
                  className="w-full h-auto rounded-2xl"
                />

                {/* Animated Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-white/20 rounded-full animate-ping"></div>
                    <div className="absolute inset-2 bg-white/30 rounded-full animate-ping animation-delay-150"></div>
                    <div className="relative bg-white/90 backdrop-blur-sm p-6 rounded-full shadow-lg hover:bg-white transition-all duration-300 transform hover:scale-110">
                      <Play className="w-8 h-8 text-red-600 ml-1" />
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white p-3 rounded-full shadow-lg animate-bounce">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 rounded-full shadow-lg animate-bounce animation-delay-300">
                  <CheckCircle className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {showVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="relative w-full max-w-4xl mx-auto aspect-video">
            <iframe
              className="w-full h-full rounded-lg"
              src="https://www.youtube.com/embed/9rVaxS23hhk?autoplay=1"
              title="YouTube video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
            {/* Close Button */}
            <button
              onClick={() => setShowVideo(false)}
              className="absolute top-2 right-2 bg-white p-2 rounded-full shadow hover:bg-red-600 hover:text-white transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FeaturesSection;
