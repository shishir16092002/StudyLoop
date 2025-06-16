// src/components/core/Navbar.jsx
import { useEffect, useState } from "react";
import { AiOutlineMenu, AiOutlineShoppingCart } from "react-icons/ai";
import { BsChevronDown } from "react-icons/bs";
import { useSelector } from "react-redux";
import { Link, matchPath, useLocation } from "react-router-dom";

import logo from "../../assets/Logo/Logo-Full-Dark-Navbar.png";
import { NavbarLinks } from "../../data/navbar-links";
import { apiConnector } from "../../services/apiconnector";
import { categories } from "../../services/apis";
import { ACCOUNT_TYPE } from "../../utils/constants";
import ProfileDropdown from "../core/Auth/ProfileDropDown";

export default function Navbar() {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);
  const location = useLocation();

  const [subLinks, setSubLinks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API);
        setSubLinks(res.data.data);
      } catch (error) {
        console.error("Could not fetch Categories.", error);
      }
      setLoading(false);
    })();
  }, []);

  const matchRoute = (route, opts = { end: true }) =>
    !!matchPath({ path: route, ...opts }, location.pathname);

  return (
    <div
      className={`flex h-16 items-center justify-center border-b border-richblack-900 ${
        location.pathname !== "/" ? "bg-richblack-900" : ""
      } transition-all duration-200`}
    >
      <div className="flex w-11/12 max-w-maxContent items-center justify-between">
        {/* Logo */}
        <Link to="/">
          <img
            src={logo}
            alt="Logo"
            className="h-10 lg:h-9 w-auto object-contain"
            loading="lazy"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex gap-x-10">
            {NavbarLinks.map((link, idx) => {
              const isCatalog = link.title === "Catalog";
              const active = isCatalog
                ? matchRoute("/catalog", { end: false })
                : matchRoute(link.path);

              return (
                <li key={idx} className="relative group">
                  {isCatalog ? (
                    <>
                      <div
                        className={`flex items-center gap-1 cursor-pointer ${
                          active ? "text-yellow-25" : "text-richblack-25"
                        }`}
                      >
                        <span className="text-lg font-medium">{link.title}</span>
                        <BsChevronDown className="text-lg" />
                      </div>

                      {/* Catalog submenu */}
                      <div
                        className="
                          absolute top-full left-1/2 z-50 mt-2
                          w-52 lg:w-72 -translate-x-1/2
                          rounded-lg bg-richblack-5 p-4 text-richblack-900
                          opacity-0 invisible
                          transition-all duration-150
                          group-hover:visible group-hover:opacity-100
                        "
                      >
                        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-2 rotate-45 bg-richblack-5 h-4 w-4" />
                        {loading ? (
                          <p className="text-center">Loading...</p>
                        ) : subLinks.filter((s) => s.courses?.length).length ? (
                          subLinks
                            .filter((s) => s.courses?.length)
                            .map((sub, i) => (
                              <Link
                                key={i}
                                to={`/catalog/${sub.name
                                  .split(" ")
                                  .join("-")
                                  .toLowerCase()}`}
                                className="block rounded-lg py-2 px-3 hover:bg-richblack-50 text-base"
                              >
                                {sub.name}
                              </Link>
                            ))
                        ) : (
                          <p className="text-center">No Courses Found</p>
                        )}
                      </div>
                    </>
                  ) : (
                    <Link to={link.path}>
                      <span
                        className={`text-lg font-medium ${
                          active ? "text-yellow-25" : "text-richblack-25"
                        }`}
                      >
                        {link.title}
                      </span>
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Cart / Auth */}
        <div className="hidden items-center gap-x-6 md:flex">
          {user && user.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
            <Link to="/dashboard/cart" className="relative">
              <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
              {totalItems > 0 && (
                <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center rounded-full bg-richblack-900 text-xs font-bold text-yellow-100">
                  {totalItems}
                </span>
              )}
            </Link>
          )}

          {token === null ? (
            <>
              <Link to="/login">
                <button className="text-base font-medium rounded-md border border-richblack-700 bg-richblack-900 px-4 py-2 text-richblack-100">
                  Log in
                </button>
              </Link>
              <Link to="/signup">
                <button className="text-base font-medium rounded-md border border-richblack-700 bg-richblack-900 px-4 py-2 text-richblack-100">
                  Sign up
                </button>
              </Link>
            </>
          ) : (
            <ProfileDropdown />
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden">
          <AiOutlineMenu fontSize={28} fill="#AFB2BF" />
        </button>
      </div>
    </div>
  );
}
