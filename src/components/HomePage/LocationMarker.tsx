import { Marker, useMapEvents, Tooltip } from "react-leaflet";
import { useContext } from "react";
import { DocumentData } from "firebase/firestore";
import { greenIcon, goldIcon, violetIcon } from "../../images/Icon";
import { GlobalDataContext } from "../../providers/global";
import { ReactElement } from "react";
import { useNavigate } from "react-router-dom";

const LocationMarker = (): ReactElement => {
  const { setIsClosed, position, setPosition, allEvents, showForm, setShowForm, filter, setShowDetails, user } = useContext(GlobalDataContext);
  const navigate = useNavigate();
  const map = useMapEvents({
    click(e) {
      if (user) {
        setPosition([e.latlng.lat, e.latlng.lng]);
        setShowForm(true);
        setIsClosed(true);
        navigate("add");
        map.flyTo(e.latlng, map.getZoom());
      }
    },
  });

  const sortedEvents =
    filter === "none"
      ? allEvents
      : allEvents
          .filter((e: DocumentData) => e.category.includes(filter))
          .sort((a: DocumentData, b: DocumentData) => {
            return b.likes.length - a.likes.length;
          });

  return (
    <>
      {sortedEvents.map((e: DocumentData, i) => {
        let eventIcon = greenIcon;
        if (e.category.includes("nauka")) {
          eventIcon = violetIcon;
        } else if (e.category.includes("kultura")) {
          eventIcon = goldIcon;
        }
        return (
          <Marker key={i} position={e.position} icon={eventIcon} eventHandlers={{ click: () => setShowDetails(e.id) }}>
            <Tooltip>
              {e.name}
              <br />
              {e.category}
              <br />
              {e.date}
              <br />
              {e.time}
              <br />
              Kliknij po szczegóły
            </Tooltip>
          </Marker>
        );
      })}
      {showForm ? <Marker position={position}></Marker> : null}
    </>
  );
};

export default LocationMarker;
