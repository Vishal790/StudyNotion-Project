import { useEffect, useState } from "react";
import { AiOutlineMenu, AiOutlineShoppingCart } from "react-icons/ai";
import { BsChevronDown } from "react-icons/bs";
import { useSelector } from "react-redux";
import { Link, matchPath, useLocation } from "react-router-dom";

import logo from "../../assets/Logo/Logo-Full-Light.png";
import { NavbarLinks } from "../../data/navbar-links";
import { apiConnector } from "../../services/apiconnector";
import { categories } from "../../services/apis";
import { ACCOUNT_TYPE } from "../../utils/constants";
import ProfileDropdown from "../core/Auth/ProfileDropDown";

function Navbar() {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);
  const location = useLocation();

  const [subLinks, setSubLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [showCategories, setShowCategories] = useState(false); // New state to manage category visibility

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API);
        setSubLinks(res.data.data);
      } catch (error) {
        console.log("Could not fetch Categories.", error);
      }
      setLoading(false);
    })();
  }, []);

  // console.log("sub links", subLinks)

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  return (
    <div
      className={`flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 ${
        location.pathname !== "/" ? "bg-richblack-800" : ""
      } transition-all duration-200`}
    >
      <div className="flex w-11/12 max-w-maxContent items-center justify-between">
        {/* Logo */}
        <Link to="/">
          <img src={logo} alt="Logo" width={160} height={32} loading="lazy" />
        </Link>
        {/* Navigation links */}
        <nav className="hidden md:block">
          <ul className="flex gap-x-6 text-richblack-25">
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                {link.title === "Catalog" ? (
                  <>
                    <div
                      className={`group relative flex cursor-pointer items-center gap-1 ${
                        matchRoute("/catalog/:catalogName")
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                    >
                      <p>{link.title}</p>
                      <BsChevronDown />
                      <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                        <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                        {loading ? (
                          <p className="text-center">Loading...</p>
                        ) : subLinks.length ? (
                          <>
                            {subLinks
                              ?.filter(
                                (subLink) => subLink?.courses?.length > 0
                              )
                              ?.map((subLink, i) => (
                                <Link
                                  to={`/catalog/${subLink.name
                                    .split(" ")
                                    .join("-")
                                    .toLowerCase()}`}
                                  className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                                  key={i}
                                >
                                  <p>{subLink.name}</p>
                                </Link>
                              ))}
                          </>
                        ) : (
                          <p className="text-center">No Courses Found</p>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link to={link?.path}>
                    <p
                      className={`${
                        matchRoute(link?.path)
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                    >
                      {link.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        {/* Login / Signup / Dashboard */}
        <div className="hidden items-center gap-x-4 md:flex">
          {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
            <Link to="/dashboard/cart" className="relative">
              <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
              {totalItems > 0 && (
                <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
          {token === null && (
            <Link to="/login">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                Log in
              </button>
            </Link>
          )}
          {token === null && (
            <Link to="/signup">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                Sign up
              </button>
            </Link>
          )}
          {token !== null && <ProfileDropdown />}
        </div>

        {/* button for mobile */}
        <button className="mr-4 md:hidden ">
          <div className="flex items-center justify-between  py-4">
            <nav>
              <section className="MOBILE-MENU flex lg:hidden">
                <div
                  className="HAMBURGER-ICON space-y-2"
                  onClick={() => {
                    setIsNavOpen((prev) => !prev);
                    setShowCategories(false);
                  }}
                >
                  <span className="block h-0.5 w-8   bg-richblack-200"></span>
                  <span className="block h-0.5 w-8   bg-richblack-200"></span>
                  <span className="block h-0.5 w-8   bg-richblack-200"></span>
                </div>

                <div
                  className={
                    isNavOpen
                      ? "showMenuNav border-[1px] bg-richblack-800 text-richblack-25 z-[1000]"
                      : "hideMenuNav"
                  }
                >
                  <div
                    className="absolute top-0 right-0 px-8 py-8 "
                    onClick={() => setIsNavOpen(false)}
                  >
                    <svg
                      className="h-8 w-8 text-gray-600"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </div>
                  <ul className="flex flex-col w-9/12  items-center  justify-around min-h-[250px] mt-10">
                    {token === null && (
                      <>
                        <li onClick={() => setIsNavOpen(false)}>
                          <Link to="/login">Log in</Link>
                        </li>
                        <li onClick={() => setIsNavOpen(false)}>
                          <Link to="/signup">Sign up</Link>
                        </li>
                      </>
                    )}

                    {token !== null && (
                      <>
                        <ProfileDropdown setIsNavOpen={setIsNavOpen}/>
                      </>
                    )}
                    {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
                      <Link
                        to="/dashboard/cart"
                        className="relative"
                        onClick={() => setIsNavOpen(false)}
                      >
                        <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
                        {totalItems > 0 && (
                          <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                            {totalItems}
                          </span>
                        )}
                      </Link>
                    )}

                    <li onClick={() => setShowCategories((prev) => !prev)}>
                      Categories
                    </li>
                    {showCategories &&
                      subLinks.map((category, index) => (
                        <li
                          key={index}
                          className="bg-richblack-700 w-full rounded-xl"
                          onClick={() => setIsNavOpen(false)}
                        >
                          <Link
                            to={`/catalog/${category.name
                              .toLowerCase()
                              .replace(/\s+/g, "-")}`}
                          >
                            {category.name}
                          </Link>
                        </li>
                      ))}
                    <li onClick={() => setIsNavOpen(false)}>
                      <Link to="/contact">Contact</Link>
                    </li>
                    <li onClick={() => setIsNavOpen(false)}>
                      <Link to="/about">About</Link>
                    </li>
                  </ul>
                </div>
              </section>
            </nav>
            <style>{`
              .hideMenuNav {
                display: none;
              }
              .showMenuNav {
                display: block;
                position: absolute;
                width: 100%;
                height: fit-content;
                top: 0;
                right: 0;
                left: 0;
                z-index: 101 ;
                display: flex;
                flex-direction: column;
                justify-content: space-evenly;
                align-items: center;
              }
            `}</style>
          </div>
        </button>
      </div>
    </div>
  );
}

export default Navbar;
