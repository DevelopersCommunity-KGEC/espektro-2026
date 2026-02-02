"use client";

import { useEffect, useState } from "react";
import "./events.css";

export default function QuiXinePage() {
  const events = [
    {
      name: "Espektro",
      image: "/event1.webp",
      description: "Immerse yourself in a spectrum of experiences that blend art, technology, and wonder. Where light meets shadow and imagination takes form, creating moments that linger in memory long after the curtain falls."
    },
    {
      name: "Exotica",
      image: "/event2.webp",
      description: "Venture into realms of wonder and mystique. Where distant lands converge with imagination, creating extraordinary narratives woven through time and space. Discover the extraordinary hidden within the ordinary."
    },
    {
      name: "QuiXine",
      image: "/event3.webp",
      description: "Embark on a sensory voyage through innovation and tradition. Experience the alchemy of moments transformed into memories, where each element dances with purpose and passion. Let wonder guide your journey."
    },
    {
      name: "TechTix",
      image: "/event1.webp",
      description: "A celebration of innovation, stories, and craft. Step into a world where technology meets creativity and every moment feels like a glimpse into the future. Experience the fusion of possibility and imagination."
    },
  ];

  const [currentEvent, setCurrentEvent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const handleNext = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setIsPaused(true);
      setTimeout(() => {
        setCurrentEvent((prev) => (prev + 1) % events.length);
        setTimeout(() => setIsTransitioning(false), 100);
      }, 100);
    }
  };

  const handlePrev = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setIsPaused(true);
      setTimeout(() => {
        setCurrentEvent((prev) => (prev - 1 + events.length) % events.length);
        setTimeout(() => setIsTransitioning(false), 100);
      }, 100);
    }
  };

  const goToEvent = (index: number) => {
    if (index !== currentEvent && !isTransitioning) {
      setIsTransitioning(true);
      setIsPaused(true);
      setTimeout(() => {
        setCurrentEvent(index);
        setTimeout(() => setIsTransitioning(false), 100);
      }, 100);
    }
  };

  // Auto-scroll functionality
  useEffect(() => {
    if (isPaused) {
      const resumeTimer = setTimeout(() => {
        setIsPaused(false);
      }, 10000);
      return () => clearTimeout(resumeTimer);
    }

    const autoScrollInterval = setInterval(() => {
      if (!isTransitioning) {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentEvent((prev) => (prev + 1) % events.length);
          setTimeout(() => setIsTransitioning(false), 100);
        }, 100);
      }
    }, 5000); // Auto-scroll every 5 seconds

    return () => clearInterval(autoScrollInterval);
  }, [isPaused, isTransitioning, events.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentEvent, isTransitioning]);

  return (
    <div className="page">
      <div
        className="poster"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="content">
          {/* top title plaque with event name */}
          <div className="plaque">
            <img
              src="/title-plaque.png"
              alt="title plaque"
              className="plaqueImage"
            />
            <div className="plaqueContent">
              <h1
                className="eventTitle"
                key={currentEvent}
                style={{
                  animation: 'titleFade 0.6s ease-in-out'
                }}
              >
                {events[currentEvent].name}
              </h1>
            </div>
          </div>

          {/* carousel container */}
          <div className="scrollContainer">
            <div
              className="carousel"
              style={{
                transform: `translateX(-${currentEvent * 100}%)`,
                transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              {events.map((event, index) => (
                <div key={index} className="carouselSlide">
                  <div className="mainGrid">
                    {/* left framed showcase */}
                    <div className="leftShowcase">
                      <img
                        src="/inner-frame.png"
                        alt="inner frame"
                        className="innerFrame"
                      />

                      {/* image inside the inner frame */}
                      <div className="eventImageWrapper">
                        <img
                          src={event.image}
                          alt={event.name}
                          className="eventImage"
                          loading="lazy"
                        />
                      </div>
                    </div>

                    {/* right story / description */}
                    <div className="rightText">
                      <img
                        src="/text-frame2.png"
                        alt="text frame"
                        className="textFrame"
                      />
                      <div className="textContent">
                        <h2>{event.name}</h2>
                        <p>
                          {event.description}
                        </p>
                        <p>
                          Join the celebration, explore the artistry, and let each page turn into an unforgettable journey.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation buttons - now loop infinitely */}
          <button
            className="navButton navPrev"
            onClick={handlePrev}
            disabled={isTransitioning}
            aria-label="Previous event"
          >
            <img src="/leftarrow.png" alt="Previous" />
          </button>
          <button
            className="navButton navNext"
            onClick={handleNext}
            disabled={isTransitioning}
            aria-label="Next event"
          >
            <img src="/rightarrow.png" alt="Next" />
          </button>

          {/* Navigation dots */}
          <div className="navDots">
            {events.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentEvent ? 'active' : ''}`}
                onClick={() => goToEvent(index)}
                disabled={isTransitioning}
                aria-label={`Go to event ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}