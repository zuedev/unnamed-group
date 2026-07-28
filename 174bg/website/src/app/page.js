export default function Home() {
  return (
    <div className="flex flex-col gap-[1rem] p-[1rem] max-w-[666px] mx-auto">
      <div id="header" className="flex flex-row gap-[1rem] items-center">
        <img id="logo" src="/images/logo/logo.png" className="h-[100px]" />
        <div className="ml-[1rem] flex flex-col justify-center h-[100px]">
          <h1 className="m-0 font-bold text-2xl">174th Battle Group</h1>
          <h2 className="text-[red] m-0 text-xl">
            The "Red Right Hand" of the UEE
          </h2>
        </div>
      </div>

      <div className="flex flex-col gap-[1rem] max-w-[600px]">
        <p>
          We're a Star Citizen organisation focused on structured play,
          small-team tactics, and distributed operations, aiming to provide a
          rich and varied experience for our members.
        </p>
        <p>
          Our bigger sessions are held on Saturdays around 17-18:00 UTC and
          usually last 4 hours. We also run smaller weekday sessions using an
          "on call" system. Members are expected to attend at least one bigger
          session every two weeks, though real life comes first and we will work
          around schedules.
        </p>
        <p>
          We welcome anyone interested in joining, regardless of experience. New
          members must be respectful, professional, and follow our code of
          conduct. They should either know Star Citizen and its mechanics or be
          willing to learn and improve.
        </p>
        <p>
          If you're interested in joining the 174th Battle Group, reach out
          through our Discord server below. We look forward to welcoming you and
          working together toward our goals in the 'verse.
        </p>
      </div>

      <div>
        {[
          ["Discord", "174bg.net/discord", "https://174bg.net/discord"],
          ["Handbook", "174bg.net/handbook", "https://174bg.net/handbook"],
          ["Manager", "174bg.net/manager", "https://174bg.net/manager"],
        ].map(([name, display, url]) => (
          <div key={name}>
            <b>{name}:</b>{" "}
            <a href={url} target="_blank" className="text-[red]">
              {display}
            </a>
          </div>
        ))}
      </div>

      <span className="absolute bottom-[1rem] right-[1rem] text-[0.8rem] opacity-33">
        Expose. Exploit. Erase.
      </span>
    </div>
  );
}
