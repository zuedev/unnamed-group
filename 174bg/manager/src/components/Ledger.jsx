import { useEffect, useState } from "react";
import { pb } from "../lib/pocketbase";

function memberLabel(record, id) {
  const m = record?.expand?.[id];
  return m ? m.RSI_Handle || m.name || m.id : (record?.[id] ?? "—");
}

export default function Ledger() {
  const [records, setRecords] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    pb
      .collection("ledger")
      .getFullList({ expand: "sender,recipient", sort: "-created", requestKey: null })
      .then((recs) => {
        if (!cancelled) setRecords(recs);
      })
      .catch((err) => {
        console.error("Failed to load ledger:", err);
        if (!cancelled) setError(err);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div id="ledger">
      <div>
        <b>Ledger</b>
      </div>
      {error && (
        <p className="empty" style={{ color: "red" }}>
          Failed to load ledger: {error?.message ?? String(error)}
        </p>
      )}
      {!error && records && records.length === 0 && (
        <p className="empty">No ledger entries.</p>
      )}
      {!error && records && records.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Sender</th>
              <th>Recipient</th>
              <th>UEC</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {records.map((rec) => (
              <tr key={rec.id}>
                <td data-label="Date">
                  {rec.created ? new Date(rec.created).toLocaleString() : "—"}
                </td>
                <td data-label="Sender">{memberLabel(rec, "sender")}</td>
                <td data-label="Recipient">{memberLabel(rec, "recipient")}</td>
                <td className="uec" data-label="UEC">
                  {Number(rec.uec ?? 0).toLocaleString()}
                </td>
                <td data-label="Note">{rec.note ?? ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
