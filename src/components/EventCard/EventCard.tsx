import "./eventCard.scss";

import moment from "moment";

import EventImg from "@/assets/images/espektro_poster.jpeg";
import { Button } from "@/components/ui/button";

import { EventData } from "@/types";
import { useMemo } from "react";
// import Coin from "@/components/Coin/Coin";

const EventCard = (event: EventData) => {
  const eventPrice = useMemo(() => {
    const price = event?.eventPrice ?? 0;

    if (!Number(price))
      return (
        <span className="text" style={{ fontWeight: 600 }}>
          FREE
        </span>
      );

    return (
      <div className="coin-details text">
        <span>₹ {price}</span>
        {
          //<Coin />
        }
      </div>
    );
  }, [event]);
  const eventPrize = useMemo(() => {
    const price = event?.eventPrize ?? 0;

    if (!Number(price))
      return (
        <span className="text" style={{ fontWeight: 600 }}>
          FREE
        </span>
      );

    return (
      <div className="coin-details text">
        <span>{price}</span>
        {
          //<Coin />
        }
      </div>
    );
  }, [event]);

  return (
    <div className="event-card">
      <div
        className="image"
        style={{
          backgroundImage:
            (event.eventImages?.length ?? 0) > 0
              ? `url(${event.eventImages?.[0].url})`
              : `url(${EventImg})`,
        }}
      >
        <img
          src={
            (event.eventImages?.length ?? 0) > 0
              ? event.eventImages?.[0].url
              : typeof EventImg === 'string' ? EventImg : EventImg.src
          }
          alt=""
        />
      </div>
      <div className="details">
        <span
          className="left-border-element"
          style={{
            backgroundColor: "#ec7a46",
          }}
        ></span>
        <div className="event-title-tagline">
          <h3 className="text-16">{event.title}</h3>
          {/* <span className="title-tagline title-tagline-small">
            {event.tagLine}
          </span> */}
        </div>
        <div className="timeline">
          <div className="text-details">
            <span className="label">Organiser:</span> {/* Shortened label */}
            <div className="text image-detail">
              <img src={event.eventOrganiserClub?.image} alt="" />
              {event.eventOrganiserClub?.name}
            </div>
          </div>
          <div className="text-details-row">
            {/* <div className="text-details">
              <span className="label">Type:</span>
              <span className="text">{event.eventType}</span>
            </div> */}
            <div className="text-details">
              <span className="label">Entry Fees:</span>
              <span className="text"></span>
              <b>{eventPrice}</b>
            </div>
          </div>

          <div className="text-details-row">
            <div className="text-details">
              <span className="label">Start Date:</span>
              <span className="text">
                {moment(new Date(event.startTime))
                  .subtract("330", "minutes")
                  .format("ll")}
              </span>
            </div>
            <div className="text-details">
              <span className="label">Time:</span>
              <span className="text">
                {moment(new Date(event.startTime))
                  .subtract("330", "minutes")
                  .format("LT")}
              </span>
            </div>
          </div>
          <div className="text-details-row">
            <div className="text-details">
              <span className="label">End Date:</span>
              <span className="text">
                {moment(new Date(event.endTime))
                  .subtract("330", "minutes")
                  .format("ll")}
              </span>
            </div>
            <div className="text-details">
              <span className="label">Time:</span>
              <span className="text">
                {moment(new Date(event.endTime))
                  .subtract("330", "minutes")
                  .format("LT")}
              </span>
            </div>
          </div>

          {/* Prizes */}
          <div className="text-details-row">
            <div className="text-details">
              <span className="label">Prize:</span>
              <span className="text">₹</span>
              <b>{eventPrize}</b>
            </div>
          </div>

          {/* Venue */}
          <div className="text-details-row">
            <div className="text-details">
              <span className="label">Venue :</span>
              <span className="text">{event.eventVenue}</span>
            </div>
          </div>

          {/* Contacts  */}
          <div className="text-details-row">
            <div className="text-details">
              <span className="label">Contact :</span>
              {(event.eventCoordinators?.length ?? 0) > 0 && (
                <span className="text">
                  {event.eventCoordinators?.[0]?.name} -{" "}
                  {event.eventCoordinators?.[0]?.phone}
                </span>
              )}
              {(event.eventCoordinators?.length ?? 0) > 1 && (
                <>
                  <span>,&nbsp;</span>
                  <span className="text">
                    {event.eventCoordinators?.[1]?.name} -{" "}
                    {event.eventCoordinators?.[1]?.phone}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2"> {/* Reduced gap */}
          <Button asChild className="cursor-pointer w-full mt-4 text-text-primary hover:bg-text-light bg-text-floral"> {/* Reduced margin-top */}
            <a
              href={event.registrationLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Register
            </a>
          </Button>

          <Button
            className="cursor-pointer p-0 w-full mt-4 text-text-primary hover:bg-text-light bg-text-floral" /* Reduced margin-top */
            onClick={() => {
              if (event.brochureLink) {
                const link = document.createElement("a");
                link.href = event.brochureLink;
                link.download = "Event_Brochure.pdf"; // Suggested filename
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }
            }}
          >
            Rules
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
