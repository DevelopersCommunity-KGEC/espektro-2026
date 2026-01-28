import React from "react";

import styles from "./styles.module.scss";

interface SectionWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.JSX.Element;
  elementPosition?: "center" | "top" | "bottom";
  variant?: "light" | "dark";
}
function SectionWrapper({
  children,
  elementPosition = "center",
  variant = "dark",
  ...props
}: SectionWrapperProps) {
  function getClassName() {
    switch (elementPosition) {
      case "center":
        return styles.section__divider__center;
      case "top":
        return styles.section__divider__top;
      case "bottom":
        return styles.section__divider__bottom;
      default:
        return styles.section__divider__center;
    }
  }
  function getVariantClassName() {
    switch (variant) {
      case "light":
        return styles.section__divider__light;
      case "dark":
        return styles.section__divider__dark;
      default:
        return styles.section__divider__light;
    }
  }
  return (
    <div
      {...props}
      // style={{
      //   padding: 0,
      // }}
      className={`${getClassName()} ${getVariantClassName()}`}
    >
      {children}
    </div>
  );
}

export default SectionWrapper;
