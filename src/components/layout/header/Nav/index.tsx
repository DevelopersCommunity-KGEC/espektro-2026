import React, { useState } from "react";
import styles from "./styles.module.scss";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { menuSlide, slide } from "../animation";
import Link from "./link/Index";
import Curve from "./curve/Index";
import Magnetic from "@/components/layout/magnetic/Index";

const navItems = [
  {
    title: "About",
    href: "#about",
  },
  {
    title: "Schedule",
    href: "#schedule",
  },
  {
    title: "Artists",
    href: "#artists",
  },
  {
    title: "Gallery",
    href: "#gallery",
  },
  {
    title: "Sponsors",
    href: "#sponsors",
  },
  {
    title: "Contact",
    href: "#contact",
  },
  {
    title: "Events",
    href: "/events",
  },
  {
    title: "My Clubs",
    href: "/my-clubs",
  },
];

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User, Ticket, ScanLine, LayoutDashboard, ChevronDown } from "lucide-react";
import LinkNext from "next/link"; // Renamed to avoid conflict with local Link component

// ... (navItems definition - mostly same but I'll filter it inside component)

interface NavProps {
  clubRoles?: any[];
  userRole?: string;
  closeMenu: () => void;
}

export default function Index({ clubRoles = [], userRole, closeMenu }: NavProps) {
  const pathname = usePathname();
  const [selectedIndicator, setSelectedIndicator] = useState(pathname);
  const [isClubsDropdownOpen, setIsClubsDropdownOpen] = useState(false);
  const { data: session } = authClient.useSession();
  const hasClubs = clubRoles && clubRoles.length > 0;

  console.log(clubRoles);

  // Ref for the menu container
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // If menu is open and click is outside menuRef, close it
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeMenu]);


  const handleSignOut = async () => {
    await authClient.signOut();
    window.location.href = "/";
  };

  const handleSignIn = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/my-tickets"
    });
  };

  return (
    <motion.div
      ref={menuRef} // Attach ref here
      variants={menuSlide}
      initial="initial"
      animate="enter"
      exit="exit"
      className={styles.menu}
    >
      <div className={styles.body}>
        <div
          onMouseLeave={() => {
            setSelectedIndicator(pathname);
          }}
          className={styles.nav}
        >
          {/* Navigation Header Removed */}
          {navItems.filter(item => session || (item.href !== "/events")).filter(item => item.href !== "/my-clubs").map((data, index) => {
            return (
              <Link
                key={index}
                data={{ ...data, index }}
                isActive={selectedIndicator == data.href}
                setSelectedIndicator={setSelectedIndicator}
                closeMenu={closeMenu} // Pass closeMenu to Link
              ></Link>
            );
          })}

          {/* My Clubs Dropdown */}
          {hasClubs && (
            <div className="relative">
              <motion.div
                className={styles.link}
                custom={navItems.length - 1}
                variants={slide}
                initial="initial"
                animate="enter"
                exit="exit"
              >
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setIsClubsDropdownOpen(!isClubsDropdownOpen)}
                >
                  <Magnetic>
                    <span className="text-white/70 hover:text-white transition-colors text-xl font-light">
                      My Clubs
                    </span>
                  </Magnetic>
                  <motion.div
                    animate={{ rotate: isClubsDropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown size={18} className="text-white/50" />
                  </motion.div>
                </div>
              </motion.div>

              {/* Dropdown Menu */}
              {isClubsDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="ml-6 mt-2 flex flex-col gap-2"
                >
                  {clubRoles.map((role: any, i: number) => (
                    <Link
                      key={role.clubId}
                      data={{
                        title: role.clubId.toUpperCase(),
                        href: `/club/${role.clubId}/dashboard`,
                        index: navItems.length + i
                      }}
                      isActive={selectedIndicator == `/club/${role.clubId}/dashboard`}
                      setSelectedIndicator={setSelectedIndicator}
                      closeMenu={closeMenu}
                    />
                  ))}
                </motion.div>
              )}
            </div>
          )}
        </div>

        <div className={`flex flex-col gap-4 ${hasClubs ? 'mt-8' : 'mt-auto'} border-t border-gray-700 pt-6`}>
          {!session ? (
            <Button onClick={() => { handleSignIn(); closeMenu(); }} className="w-full bg-white text-black hover:bg-gray-200">
              Login
            </Button>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col mb-2">
                <div className={styles.header} style={{ marginBottom: '15px' }}>
                  <p>Account</p>
                </div>

                {/* User Info as a pseudo-header/card */}
                <div className="flex items-center gap-3 mb-4 p-2 rounded-lg bg-white/5 mx-[-8px]">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={session.user?.image || ""} />
                    <AvatarFallback>{session.user?.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-medium text-white truncate">{session.user?.name}</span>
                    <span className="text-xs text-white/50 truncate">{session.user?.email}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <LinkNext href="/my-tickets" className="flex items-center justify-between text-white/70 hover:text-white transition-colors group" onClick={closeMenu}>
                    <span className="text-xl font-light">My Tickets</span>
                    <Ticket size={18} className="text-white/50 group-hover:text-white transition-colors" />
                  </LinkNext>
                  <LinkNext href="/profile" className="flex items-center justify-between text-white/70 hover:text-white transition-colors group" onClick={closeMenu}>
                    <span className="text-xl font-light">Profile</span>
                    <User size={18} className="text-white/50 group-hover:text-white transition-colors" />
                  </LinkNext>
                  {hasClubs && (
                    <LinkNext href="/scan" className="flex items-center justify-between text-white/70 hover:text-white transition-colors group" onClick={closeMenu}>
                      <span className="text-xl font-light">Scan Ticket</span>
                      <ScanLine size={18} className="text-white/50 group-hover:text-white transition-colors" />
                    </LinkNext>
                  )}
                  {(userRole === "admin" || userRole === "super-admin") && (
                    <LinkNext href="/dashboard" className="flex items-center justify-between text-white/70 hover:text-white transition-colors group" onClick={closeMenu}>
                      <span className="text-xl font-light">Admin Dashboard</span>
                      <LayoutDashboard size={18} className="text-white/50 group-hover:text-white transition-colors" />
                    </LinkNext>
                  )}

                  {/* Logout */}
                  <div
                    onClick={() => { handleSignOut(); closeMenu(); }}
                    className="flex items-center justify-between text-white/70 hover:text-red-400 transition-colors group cursor-pointer mt-2"
                  >
                    <span className="text-xl font-light">Log out</span>
                    <LogOut size={18} className="text-white/50 group-hover:text-red-400 transition-colors" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
      <Curve />
    </motion.div>
  );
}
