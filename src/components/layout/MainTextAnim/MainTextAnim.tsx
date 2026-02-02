import { motion } from "framer-motion";
import "./style.scss";

type MainTextAnimationProps = {
  text: string;
  className?: string;
};

const MainTextAnimation: React.FC<MainTextAnimationProps> = ({
  text,
  className = "",
}) => {
  return (
    <div className={`flex space-x-1 z-[39]`}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 6 + i * 0.1 }}
          className={`relative mainText ${className}`}
          // style={{
          //   textShadow: "0 0 5px #75fff4, 0 0 10px #75fff4, 0 0 15px #75fff4",
          // }}
        >
          {char === " " ? "\u00A0" : char} {/* Preserve spaces */}
        </motion.span>
      ))}
    </div>
  );
};

export default MainTextAnimation;
