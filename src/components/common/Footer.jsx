const Footer = () => (
  <footer className="bg-white relative">
    {/* Top border */}
    <div className="absolute border-t border-[rgba(66,66,66,0.36)] border-solid inset-x-0 top-0 pointer-events-none" />

    {/* Desktop Layout */}
    <div className="hidden md:block box-border flex-row items-center justify-between px-10 py-6 relative w-full">
      <div className="flex flex-row items-center justify-between w-full">
        {/* Left side - Copyright and navigation links */}
        <div className="box-border flex flex-row font-['Poppins',_sans-serif] gap-2 items-start justify-start leading-[0] not-italic overflow-clip px-1 py-[5px] relative shrink-0 text-[#1f1f1f] text-[14px] text-nowrap">
          <div className="flex flex-col justify-center relative shrink-0 text-left">
            <p className="block leading-[18px] text-nowrap whitespace-pre">
              © 2025 PGBee
            </p>
          </div>
          <div className="flex flex-col justify-center relative shrink-0 text-center">
            <p className="block leading-[18px] text-nowrap whitespace-pre">·</p>
          </div>
          <div className="flex flex-col justify-center relative shrink-0 text-left">
            <a
              href="#"
              className="block leading-[18px] text-nowrap whitespace-pre hover:underline"
            >
              Privacy
            </a>
          </div>
          <div className="flex flex-col justify-center relative shrink-0 text-center">
            <p className="block leading-[18px] text-nowrap whitespace-pre">·</p>
          </div>
          <div className="flex flex-col justify-center relative shrink-0 text-left">
            <a
              href="#"
              className="block leading-[18px] text-nowrap whitespace-pre hover:underline"
            >
              Terms
            </a>
          </div>
          <div className="flex flex-col justify-center relative shrink-0 text-center">
            <p className="block leading-[18px] text-nowrap whitespace-pre">·</p>
          </div>
          <div className="flex flex-col justify-center relative shrink-0 text-left">
            <a
              href="#"
              className="block leading-[18px] text-nowrap whitespace-pre hover:underline"
            >
              Company details
            </a>
          </div>
        </div>

        {/* Right side - Social media icons */}
        <div className="flex items-center gap-4">
          <a
            href="https://wa.me/916235401737"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#1f1f1f] hover:text-gray-600 transition-colors"
            aria-label="WhatsApp"
          >
            <img
              src="/icons/whatsapp.svg"
              alt="WhatsApp"
              className="w-[16px] h-[16px]"
            />
          </a>
          <a
            href="https://www.instagram.com/pgbe.e?utm_source=ig_web_button_share_sheet&igsh=ejlqYWMzZHFvanc5"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#1f1f1f] hover:text-gray-600 transition-colors"
            aria-label="Instagram"
          >
            <img
              src="/icons/instagram.svg"
              alt="Instagram"
              className="w-[16px] h-[16px]"
            />
          </a>
          <a
            href="#"
            className="text-[#1f1f1f] hover:text-gray-600 transition-colors"
            aria-label="Facebook"
          >
            <img
              src="/icons/facebook.svg"
              alt="Facebook"
              className="w-[16px] h-[16px]"
            />
          </a>
          <a
            href="#"
            className="text-[#1f1f1f] hover:text-gray-600 transition-colors"
            aria-label="Twitter"
          >
            <img
              src="/icons/twitter.svg"
              alt="Twitter"
              className="w-[16px] h-[16px]"
            />
          </a>
        </div>
      </div>
    </div>

    {/* Mobile Layout */}
    <div className="md:hidden box-border flex flex-col gap-4 items-center justify-start p-6 relative w-full">
      {/* Social media icons */}
      <div className="flex items-center gap-4">
        <a
          href="https://wa.me/916235401737"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#1f1f1f] hover:text-gray-600 transition-colors"
          aria-label="WhatsApp"
        >
          <img
            src="/icons/whatsapp.svg"
            alt="WhatsApp"
            className="w-[15px] h-[15px]"
          />
        </a>
        <a
          href="https://www.instagram.com/pgbe.e?utm_source=ig_web_button_share_sheet&igsh=ejlqYWMzZHFvanc5"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#1f1f1f] hover:text-gray-600 transition-colors"
          aria-label="Instagram"
        >
          <img
            src="/icons/instagram.svg"
            alt="Instagram"
            className="w-[30px] h-[30px]"
          />
        </a>
        <a
          href="#"
          className="text-[#1f1f1f] hover:text-gray-600 transition-colors"
          aria-label="Facebook"
        >
          <img
            src="/icons/facebook.svg"
            alt="Facebook"
            className="w-[16px] h-[16px]"
          />
        </a>
        <a
          href="#"
          className="text-[#1f1f1f] hover:text-gray-600 transition-colors"
          aria-label="Twitter"
        >
          <img
            src="/icons/twitter.svg"
            alt="Twitter"
            className="w-[13px] h-[13px]"
          />
        </a>
      </div>

      {/* Copyright and navigation links */}
      <div className="box-border flex flex-row font-['Poppins',_sans-serif] gap-2 items-center justify-center leading-[0] not-italic overflow-clip px-1 py-[5px] relative shrink-0 text-[#222222] text-nowrap">
        <div className="flex flex-col justify-center relative shrink-0 text-[9.6px] text-left">
          <p className="block leading-[18px] text-nowrap whitespace-pre">
            © 2025 PGBee
          </p>
        </div>
        <div className="flex flex-col justify-center relative shrink-0 text-[14px] text-center">
          <p className="block leading-[18px] text-nowrap whitespace-pre">·</p>
        </div>
        <div className="flex flex-col justify-center relative shrink-0 text-[9.6px] text-left">
          <a
            href="#"
            className="block leading-[18px] text-nowrap whitespace-pre hover:underline"
          >
            Privacy
          </a>
        </div>
        <div className="flex flex-col justify-center relative shrink-0 text-[14px] text-center">
          <p className="block leading-[18px] text-nowrap whitespace-pre">·</p>
        </div>
        <div className="flex flex-col justify-center relative shrink-0 text-[9.6px] text-left">
          <a
            href="#"
            className="block leading-[18px] text-nowrap whitespace-pre hover:underline"
          >
            Terms
          </a>
        </div>
        <div className="flex flex-col justify-center relative shrink-0 text-[14px] text-center">
          <p className="block leading-[18px] text-nowrap whitespace-pre">·</p>
        </div>
        <div className="flex flex-col justify-center relative shrink-0 text-[9.6px] text-left">
          <a
            href="#"
            className="block leading-[18px] text-nowrap whitespace-pre hover:underline"
          >
            Company details
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;