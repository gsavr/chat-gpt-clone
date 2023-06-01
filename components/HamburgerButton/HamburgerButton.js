export const HamburgerButton = (props) => {
  const { open, setOpen, setOpening, menuOpen, setMenuOpen } = props;

  const openMobileMenu = () => {
    if (open === "hidden") {
      setOpen("flex");
      setMenuOpen("open");
      setTimeout(() => {
        setOpening("opening");
      }, 100);
    } else if (open === "flex") {
      setOpening("closing");
      setMenuOpen("closed");
      setTimeout(() => {
        setOpen("hidden");
      }, 500);
    }
  };

  return (
    <div className="absolute right-4 z-50 mt-4 flex items-center  md:hidden">
      <div className="pb-2 pl-5"></div>
      <button
        id="menu-btn"
        onClick={openMobileMenu}
        type="button"
        className={`${menuOpen} hamburger z-40 block rounded-md focus:outline-none md:hidden`}
      >
        <span className="hamburger-top border border-white "></span>
        <span className="hamburger-middle border border-white "></span>
        <span className="hamburger-bottom border border-white "></span>
      </button>
    </div>
  );
};
