import Logo from "@/components/shadcn-studio/logo";

const Footer = () => {
  return (
    <footer>
      <div className="mx-auto flex items-center justify-between gap-3 px-4 py-4 max-md:flex-col sm:px-6 sm:py-6 md:gap-6 md:py-8">
        <a href="#">
          <div className="flex items-center gap-3">
            <Logo className="gap-3" />
          </div>
        </a>

        {/* These links can be updated later to show proper navigation */}

        <div className="flex items-center gap-5 whitespace-nowrap">
          <a
            href="#"
            className="opacity-80 transition-opacity duration-300 hover:opacity-100"
          >
            About
          </a>
          <a
            href="#"
            className="opacity-80 transition-opacity duration-300 hover:opacity-100"
          >
            Features
          </a>
          <a
            href="#"
            className="opacity-80 transition-opacity duration-300 hover:opacity-100"
          >
            Works
          </a>
          <a
            href="#"
            className="opacity-80 transition-opacity duration-300 hover:opacity-100"
          >
            Career
          </a>
        </div>
      </div>

      <div className="mx-auto flex justify-center px-4 py-8 sm:px-6">
        <p className="text-center font-medium text-balance">
          {`©${new Date().getFullYear()}`}{" "}
          <a href="#" className="hover:underline">
            HarmonyHub
          </a>
          , Bringing Harmony to Your Music Listening Experience.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
