import styles from "./styles.module.scss";
import Link from "next/link";
import { motion } from "framer-motion";
import { slide, scale } from "../../animation";
import Magnetic from "@/components/layout/magnetic/Index";

interface IndexProps {
  data: {
    title: string;
    href: string;
    index: number;
  };
  isActive: boolean;
  setSelectedIndicator: (href: string) => void;
  closeMenu: () => void;
}

export default function Index({
  data,
  isActive,
  setSelectedIndicator,
  closeMenu,
}: IndexProps) {
  const { title, href, index } = data;

  return (
    <motion.div
      className={styles.link}
      onMouseEnter={() => setSelectedIndicator(href)}
      custom={index}
      variants={slide}
      initial="initial"
      animate="enter"
      exit="exit"
      onClick={closeMenu} // Close menu on click
    >
      <motion.div
        variants={scale}
        animate={isActive ? "open" : "closed"}
        className={styles.indicator}
      />
      <Magnetic>
        <Link
          href={href}
          className="text-sm font-bold font-[family-name:var(--font-medieval-sharp)] text-[#2C1810]/40 hover:text-[#B7410E] transition-all uppercase no-magnetic-mobile"
        >
          {title}
        </Link>
      </Magnetic>
    </motion.div>
  );
}
