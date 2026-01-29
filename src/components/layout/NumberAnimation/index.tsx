import { useEffect, useMemo, useRef, useState } from "react";

function useIsInViewport(
  ref: React.MutableRefObject<HTMLDivElement | null>
) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  const observer = useMemo(
    () =>
      new IntersectionObserver(([entry]) =>
        setIsIntersecting(entry.isIntersecting)
      ),
    []
  );

  useEffect(() => {
    if (ref.current) observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref, observer]);

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
    setInterval(() => {
      if (onScreen)
        setCurrentValue((prev) => {
          if (prev < endValue)
            return prev + (endValue/10);
          else return endValue;
        });

    }, 80);
  }, [onScreen]);

  return (
    <div ref={divRef}>
      {Math.floor(currentValue)} {unit}
    </div>
  );
};

export default NumberAnimation;
