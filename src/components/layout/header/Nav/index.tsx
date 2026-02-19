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
    title: "Home",
    href: "/",
  },
  {
    title: "About",
    href: "/#about",
  },
  {
    title: "Schedule",
    href: "/#schedule",
  },
  {
    title: "Artists",
    href: "/#artists",
  },
  {
    title: "Sponsors",
    href: "/#sponsors",
  },
  {
    title: "Contact",
    href: "/#contact",
  },
  {
    title: "Events",
    href: "/events",
  },
  // {
  //   title: "My Clubs",
  //   href: "/my-clubs",
  // },
];

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LogOut,
  User,
  Ticket,
  ScanLine,
  LayoutDashboard,
  ChevronDown,
  Shield,
  Handshake,
  PenLine,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LinkNext from "next/link"; // Renamed to avoid conflict with local Link component

// ... (navItems definition - mostly same but I'll filter it inside component)

interface NavProps {
  clubRoles?: any[];
  userRole?: string;
  closeMenu: () => void;
  toggleButtonRef?: React.RefObject<HTMLDivElement | null>;
}

export default function Index({
  clubRoles = [],
  userRole,
  closeMenu,
  toggleButtonRef,
}: NavProps) {
  const pathname = usePathname();
  const [selectedIndicator, setSelectedIndicator] = useState(pathname);
  const [isClubsDropdownOpen, setIsClubsDropdownOpen] = useState(false);
  const { data: session } = authClient.useSession();
  const hasClubs = clubRoles && clubRoles.length > 0;

  // Ref for the menu container
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // If menu is open and click is outside menuRef, close it
      // But IGNORE clicks on the toggle button itself to avoid race conditions with Header's onClick
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        (!toggleButtonRef?.current || !toggleButtonRef.current.contains(target))
      ) {
        closeMenu();
      }
    };

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeMenu, toggleButtonRef]);

  const handleSignOut = async () => {
    await authClient.signOut();
    window.location.href = "/";
  };

  const handleSignIn = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: pathname || "/",
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
          {navItems
            // .filter((item) => session || item.href !== "/events")
            .filter((item) => item.href !== "/my-clubs")
            .map((data, index) => {
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
            <div
              className={`relative ${styles.link}`}
              style={{ marginTop: "10px" }}
            >
              <DropdownMenu
                open={isClubsDropdownOpen}
                onOpenChange={setIsClubsDropdownOpen}
                modal={false}
              >
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center justify-between cursor-pointer w-full group outline-none py-1">
                    <Magnetic>
                      <span className="text-[#2C1810]/70 hover:text-[#B7410E] transition-colors text-sm font-bold font-[family-name:var(--font-medieval-sharp)] uppercase group-hover:text-[#B7410E]">
                        My Clubs
                      </span>
                    </Magnetic>
                    <ChevronDown
                      size={18}
                      className={`text-[#2C1810]/50 group-hover:text-[#B7410E] transition-transform duration-300 ${isClubsDropdownOpen ? "-rotate-90" : ""
                        }`}
                    />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 bg-[#ffffff] border-[#2C1810]/10 shadow-lg z-[3000]"
                  align="start"
                  sideOffset={5}
                >
                  {clubRoles.map((role: any) => {
                    const RoleIcon =
                      role.role === "club-admin"
                        ? Shield
                        : role.role === "volunteer"
                          ? Handshake
                          : role.role === "event-editor"
                            ? PenLine
                            : LayoutDashboard;
                    const roleLabel =
                      role.role === "club-admin"
                        ? "Admin"
                        : role.role === "volunteer"
                          ? "Volunteer"
                          : role.role === "event-editor"
                            ? "Editor"
                            : role.role;
                    return (
                      <DropdownMenuItem
                        key={role.clubId}
                        asChild
                        className="focus:bg-[#B7410E]/10 focus:text-[#B7410E] cursor-pointer"
                      >
                        <LinkNext
                          href={`/club/${role.clubId}/dashboard`}
                          className="flex items-center gap-2.5 py-2 px-2 w-full font-[family-name:var(--font-medieval-sharp)]"
                          onClick={() => {
                            setIsClubsDropdownOpen(false);
                            closeMenu();
                          }}
                        >
                          <RoleIcon size={14} className="shrink-0 opacity-70" />
                          <span className="text-sm font-bold uppercase text-[#2C1810]">
                            {role.clubId}
                          </span>
                          <span className="text-[10px] opacity-60 ml-auto uppercase bg-[#2C1810]/5 px-1.5 py-0.5 rounded">
                            {roleLabel}
                          </span>
                        </LinkNext>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        <div
          className={`flex flex-col gap-4 ${hasClubs ? "mt-8" : "mt-auto"} border-t border-[#2C1810]/10 pt-6`}
        >
          {!session ? (
            <Button
              onClick={() => {
                handleSignIn();
                closeMenu();
              }}
              variant="theatrical"
              className="w-full bg-[#B7410E] hover:bg-[#8B2635] text-white font-bold h-10 uppercase text-[10px] tracking-[0.2em] shadow-md hover:shadow-xl hover:-translate-y-1 font-[family-name:var(--font-roboto-slab)] transition-all duration-300"
            >
              Login
            </Button>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col mb-2">
                <div className={styles.header} style={{ marginBottom: "15px" }}>
                  <p>Account</p>
                </div>

                {/* User Info as a pseudo-header/card */}
                <div className="flex items-center gap-3 mb-4 p-2 rounded-lg bg-[#2C1810]/5 mx-[-8px]">
                  <Avatar className="h-10 w-10 ring-1 ring-[#2C1810]/10">
                    <AvatarImage src={session.user?.image || ""} />
                    <AvatarFallback className="bg-[#B7410E] text-white">
                      {session.user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-bold text-[#2C1810] truncate">
                      {session.user?.name}
                    </span>
                    <span className="text-xs text-[#2C1810]/50 truncate">
                      {session.user?.email}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <LinkNext
                    href="/my-tickets"
                    className="flex items-center justify-between text-[#2C1810]/40 hover:text-[#2C1810] transition-colors group"
                    onClick={closeMenu}
                  >
                    <span className="text-sm font-bold font-[family-name:var(--font-medieval-sharp)] uppercase">
                      My Tickets
                    </span>
                    <Ticket
                      size={18}
                      className="text-[#2C1810]/30 group-hover:text-[#B7410E] transition-colors"
                    />
                  </LinkNext>
                  <LinkNext
                    href="/profile"
                    className="flex items-center justify-between text-[#2C1810]/40 hover:text-[#2C1810] transition-colors group"
                    onClick={closeMenu}
                  >
                    <span className="text-sm font-bold font-[family-name:var(--font-medieval-sharp)] uppercase">
                      Profile
                    </span>
                    <User
                      size={18}
                      className="text-[#2C1810]/30 group-hover:text-[#B7410E] transition-colors"
                    />
                  </LinkNext>
                  {hasClubs && (
                    <LinkNext
                      href="/scan"
                      className="flex items-center justify-between text-[#2C1810]/40 hover:text-[#2C1810] transition-colors group"
                      onClick={closeMenu}
                    >
                      <span className="text-sm font-bold font-[family-name:var(--font-medieval-sharp)] uppercase">
                        Scan Ticket
                      </span>
                      <ScanLine
                        size={18}
                        className="text-[#2C1810]/30 group-hover:text-[#B7410E] transition-colors"
                      />
                    </LinkNext>
                  )}
                  {(userRole === "admin" || userRole === "super-admin") && (
                    <LinkNext
                      href="/dashboard"
                      className="flex items-center justify-between text-[#8B2635] hover:text-[#B7410E] transition-colors group"
                      onClick={closeMenu}
                    >
                      <span className="text-sm font-bold font-[family-name:var(--font-medieval-sharp)] uppercase">
                        Admin Dashboard
                      </span>
                      <LayoutDashboard
                        size={18}
                        className="text-[#8B2635]/50 group-hover:text-[#B7410E] transition-colors"
                      />
                    </LinkNext>
                  )}

                  {/* Logout */}
                  <div
                    onClick={() => {
                      handleSignOut();
                      closeMenu();
                    }}
                    className="flex items-center justify-between text-[#2C1810]/30 hover:text-red-500 transition-colors group cursor-pointer mt-2"
                  >
                    <span className="text-sm font-bold font-[family-name:var(--font-medieval-sharp)] uppercase">
                      Log out
                    </span>
                    <LogOut
                      size={18}
                      className="text-[#2C1810]/30 group-hover:text-red-500 transition-colors"
                    />
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
