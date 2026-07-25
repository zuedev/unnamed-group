export default function Welcome({ record }) {
  const name = record?.RSI_Handle || record?.name || "Pilot";
  const avatarFile = record?.avatar;
  const avatarUrl = avatarFile
    ? `https://db.174bg.net/api/files/${record.collectionId}/${record.id}/${avatarFile}`
    : null;

  return (
    <div id="welcome">
      {avatarUrl && <img id="welcome-avatar" src={avatarUrl} alt={name} />}
      <span id="welcome-text">Welcome back, {name}!</span>
    </div>
  );
}
