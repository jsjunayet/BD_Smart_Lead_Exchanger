import Image from "next/image";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 sm:py-12  md:px-0 px-2">
      <div className="max-w-6xl mx-auto ">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-1 sm:col-span-2 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8  rounded-lg flex items-center justify-center">
                <Image
                  className=" rounded-full"
                  src="/logo.png" // Image file from 'public' folder
                  alt="BDSmartLeadX logo" // More descriptive alt text for accessibility
                  width={60} // Width of the logo
                  height={60} // Height of the logo
                  layout="intrinsic" // Ensure the logo scales properly with its container
                  quality={75} // Adjust quality if needed (default is 75)
                />{" "}
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                BDSmartLeadX
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              Bangladesh&apos;s premier job exchange platform connecting
              talented individuals with opportunities.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link href="/about" className="hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/workplace" className="hover:text-white">
                  Workplace
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Marketing Tools
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="#" className="hover:text-white">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4 text-sm">
              {/* Email */}

              {/* WhatsApp */}
              <a
                href="https://wa.me/8801571141226"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
              >
                WhatsApp
              </a>

              {/* Telegram */}
              <a
                href="https://t.me/+8801571141226"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
              >
                Telegram
              </a>
            </div>
            <div>
              <a
                href="mailto:bdsmartleadexchanger@gmail.com"
                className="text-gray-400 hover:text-white"
              >
                bdsmartleadexchanger@gmail.com
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2025 BD Smart Lead Exchange. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
