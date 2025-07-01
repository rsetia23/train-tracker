import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "../Track.css";

type Station = {
  code: string;
  stationName?: string;
  arrival?: string;
  departure?: string;
  estArrival?: string;
  estDeparture?: string;
  completed?: string;
  delay?: string;
};

export default function Track() {
  const { trainId } = useParams();
  const [data, setData] = useState<null | {
    trainName: string;
    status: string;
    progress: Station[];
  }>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // http://localhost:3001/train/${trainId}
    fetch(`https://train-tracker-jyym.onrender.com/train/${trainId}`)
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching train data:", err);
        setLoading(false);
      });
  }, [trainId]);

  if (loading) return <div className="loading">Loading...</div>;
  if (!data) return <div className="error">Train not found</div>;

  return (
    <div className="track-page">
      <div className="track-container">
        <h1 className="track-title">{data.trainName}</h1>
        <p className="track-status">{data.status}</p>

        <div className="station-list">
          {data.progress.map((station, idx) => {
            const delayClass = station.delay?.includes("late")
              ? "delay-late"
              : station.delay?.includes("early")
              ? "delay-early"
              : "delay-neutral";

            return (
              <div key={idx} className="station-card">
                <div className="station-header">
                  <div>
                    <div className="station-code">{station.code}</div>
                    <div className="station-name">{station.stationName}</div>
                  </div>
                  <div className="station-times">
                    {station.arrival && <div>Arrived: {station.arrival}</div>}
                    {station.departure && (
                      <div>Departed: {station.departure}</div>
                    )}
                    {station.estArrival && (
                      <div>Est. Arr: {station.estArrival}</div>
                    )}
                    {station.estDeparture && (
                      <div>Est. Dep: {station.estDeparture}</div>
                    )}
                    {station.completed && (
                      <div>Completed: {station.completed}</div>
                    )}
                  </div>
                </div>
                {station.delay && (
                  <div className={`station-delay ${delayClass}`}>
                    {station.delay}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
