import React from "react";

const Footer = () => {
  return (
    <div className="sticky top-[72px] mt-6 px-3">
      <nav aria-label="Footer Navigation">
        <ul className="flex flex-wrap justify-center lg:justify-start text-xs font-medium text-gray-500 gap-x-4 gap-y-2">
          <li>
            <a
              href="#"
              className="hover:text-black hover:underline transition-all duration-200"
            >
              About
            </a>
          </li>
          <li>
            <a
              href="#"
              className="hover:text-black hover:underline transition-all duration-200"
            >
              Accessibility
            </a>
          </li>
          <li>
            <a
              href="#"
              className="hover:text-black hover:underline transition-all duration-200"
            >
              Help Center
            </a>
          </li>
          <li>
            <a
              href="#"
              className="hover:text-black hover:underline transition-all duration-200"
            >
              Privacy &amp; Terms
            </a>
          </li>
        </ul>
      </nav>

      <div className="mt-5 flex flex-col items-center justify-center lg:flex-row lg:justify-start text-xs text-black-400 group cursor-pointer">
        <img
          src="../public/NamedLogo.png"
          alt="Job Portal Logo"
          className="h-5 w-auto object-contain opacity-90 group-hover:opacity-100 transition-opacity duration-300"
        />
        <span className="mt-2 lg:mt-0 lg:ml-3 font-medium">
          Corporation © 2026
        </span>
      </div>
    </div>
  );
};

export default Footer;
