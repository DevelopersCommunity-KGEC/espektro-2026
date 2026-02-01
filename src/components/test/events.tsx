import "./events.css";

export default function QuiXinePage() {
  return (
    <div className="page">
      <div className="poster">

        {/* outer decorative border */}
        <img
          src="/outer-frame.svg"
          alt="outer frame"
          className="outerFrame"
        />

        <div className="content">

          {/* top title plaque */}
          <div className="plaque">
            <img
              src="/title-plaque.svg"
              alt="QuiXine title"
            />
          </div>

          {/* main two column layout */}
          <div className="mainGrid">

            {/* left framed showcase */}
            <div className="leftShowcase">
              <img
                src="/inner-frame.svg"
                alt="inner frame"
                className="innerFrame"
              />

              {/* image inside the inner frame */}
              <div className="eventImageWrapper">
                <img
                  src="/event.webp"
                  alt="event"
                  className="eventImage"
                />
              </div>
            </div>

            {/* right story / description */}
            <div className="rightText">
              <h2>Welcome to QuiXine</h2>
              <p>
                A celebration of flavors, stories, and craft. Step into a
                world where every dish feels illustrated and every bite reads
                like a line from an ancient culinary manuscript.
              </p>
              <p>
                Join the feast, explore the art, and let the page turn into a
                journey.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
