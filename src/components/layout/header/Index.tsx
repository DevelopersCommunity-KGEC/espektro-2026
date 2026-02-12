"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import Nav from "./Nav";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Rounded from "@/components/ui/rounded-button";
// import Magnetic from "@/components/ui/magnetic";
import { NavbarLinks } from "@/data/Navbar";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Magnetic from "@/components/layout/magnetic/Index";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Ticket, User } from "lucide-react";


export default function Header() {
  const header = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const pathname = usePathname();
  const button = useRef(null);
  const { data } = authClient.useSession();
  const session = data;

  const handleSignOut = async () => {
    await authClient.signOut();
    window.location.href = "/";
  };

  const handleSignIn = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/my-tickets",
    });
  };

  useEffect(() => {
    if (isActive) setIsActive(false);
  }, [pathname]);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.to(button.current, {
      scrollTrigger: {
        trigger: document.documentElement,
        start: 0,
        end: window.innerHeight,
        onLeave: () => {
          gsap.to(button.current, {
            scale: 1,
            duration: 0.25,
            ease: "power1.out",
          });
        },
        onEnterBack: () => {
          gsap.to(button.current, {
            scale: 0,
            duration: 0.25,
            ease: "power1.out",
          });
          setIsActive(false);
        },
      },
    });
    gsap.to(header.current, {
      scrollTrigger: {
        trigger: document.documentElement,
        start: 0,
        end: window.innerHeight,
        onLeave: () => {
          gsap.to(header.current, {
            scale: 0,
          });
        },
        onEnterBack: () => {
          gsap.to(header.current, {
            scale: 1,
          });
        },
      },
    });
  }, []);

  return (
    <div className="w-[100%] z-50 nav">
      <div ref={header} className={styles.header}>
        <div className={styles.nav}>
          {NavbarLinks.map((link, index) => (
            <Magnetic key={index}>
              <div className={styles.el}>
                <a href={link.url}>{link.text}</a>
                <div className={styles.indicator}></div>
              </div>
            </Magnetic>
          ))}
          {!session ? (
            <Magnetic>
              <div className={styles.el}>
                <Button
                  onClick={handleSignIn}
                  className="bg-[#1C1D20] hover:bg-[#1C1D20]/90 text-white px-4 py-2 text-xs"
                >
                  Login
                </Button>
              </div>
            </Magnetic>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={session.user?.image || ""} alt={session.user?.name || "User"} />
                    <AvatarFallback>{session.user?.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-background" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{session.user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="focus:bg-primary/10 focus:text-primary focus:outline-none focus:[&_svg]:text-primary">
                  <a href="/my-tickets" className="cursor-pointer">
                    <Ticket className="mr-2 h-4 w-4" />
                    <span>My Tickets</span>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="focus:bg-primary/10 focus:text-primary focus:outline-none focus:[&_svg]:text-primary">
                  <a href="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 focus:outline-none focus:[&_svg]:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <div className={styles.menuSmall}>
          {!isActive && (
            <Magnetic>
              <div
                onClick={() => {
                  setIsActive(!isActive);
                }}
                className={styles.el}
              >
                <p>Menu</p>
                <div className={styles.indicator}></div>
              </div>
            </Magnetic>
          )}
        </div>
      </div>
      {isActive && (
        <div className={styles.navButton}>
          <Rounded
            onClick={() => {
              setIsActive(!isActive);
            }}
            className={`${styles.button}`}
          >
            <div
              className={`${styles.burger} ${isActive ? styles.burgerActive : ""
                }`}
            ></div>
          </Rounded>
        </div>
      )}
      <div ref={button} className={styles.headerButtonContainer}>
        <Magnetic>
          <Rounded
            onClick={() => {
              setIsActive(!isActive);
            }}
            className={`${styles.button}`}
          >
            <div
              className={`${styles.burger} ${isActive ? styles.burgerActive : ""
                }`}
            ></div>
          </Rounded>
        </Magnetic>
      </div>
      <AnimatePresence mode="wait">{isActive && <Nav />}</AnimatePresence>
    </div>
  );
}
