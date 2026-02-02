"use client";

import { useEffect, useRef, useState } from "react";

function useIsInViewport(
  ref: React.MutableRefObject<HTMLDivElement | null>
) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    // SSR + safety guard
    if (!ref.current || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    });

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref]);

  return isIntersecting;
}

const NumberAnimation = ({
  endValue,
  unit,
}: {
  endValue: number;
  unit: string;
}) => {
  const [currentValue, setCurrentValue] = useState(0);
  const divRef = useRef<HTMLDivElement>(null);
  const onScreen = useIsInViewport(divRef);

  useEffect(() => {
    if (!onScreen) return;

    const interval = setInterval(() => {
      setCurrentValue((prev) => {
        if (prev >= endValue) {
          clearInterval(interval);
          return endValue;
        }
        return prev + endValue / 10;
      });
    }, 80);

    return () => clearInterval(interval);
  }, [onScreen, endValue]);

  return (
    <div ref={divRef}>
      {Math.floor(currentValue)} {unit}
    </div>
  );
};

export default NumberAnimation;


// "use client"

// import { useEffect, useMemo, useRef, useState } from "react";

// function useIsInViewport(
//   ref: React.MutableRefObject<HTMLDivElement | null>
// ) {
//   const [isIntersecting, setIsIntersecting] = useState(false);

//   const observer = useMemo(
//     () =>
//       new IntersectionObserver(([entry]) =>
//         setIsIntersecting(entry.isIntersecting)
//       ),
//     []
//   );

//   useEffect(() => {
//     if (ref.current) observer.observe(ref.current);

//     return () => {
//       observer.disconnect();
//     };
//   }, [ref, observer]);

//   return isIntersecting;
// }

// const NumberAnimation = ({
//   endValue,
//   unit,
// }: {
//   endValue: number;
//   unit: string;
// }) => {
//   const [currentValue, setCurrentValue] = useState(0);
//   const divRef = useRef<HTMLDivElement>(null);
//   const onScreen = useIsInViewport(divRef);

//   useEffect(() => {
//     setInterval(() => {
//       if (onScreen)
//         setCurrentValue((prev) => {
//           if (prev < endValue)
//             return prev + (endValue/10);
//           else return endValue;
//         });

//     }, 80);
//   }, [onScreen]);

//   return (
//     <div ref={divRef}>
//       {Math.floor(currentValue)} {unit}
//     </div>
//   );
// };

// export default NumberAnimation;
