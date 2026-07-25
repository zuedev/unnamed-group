import Welcome from "../components/Welcome.jsx";
import RequiredInfo from "../components/RequiredInfo.jsx";

export default function Overview({ record }) {
  return (
    <div className="page-stack">
      <Welcome record={record} />
      <RequiredInfo record={record} />
    </div>
  );
}
