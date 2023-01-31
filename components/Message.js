export default function Message({ children, avatar, username, description }) {
  return (
    <div className=" my-5 hover:shadow-lg bg-stone-100 hover:scale-110 transition-all duration-300 p-8 border-b-2 rounded-lg shadow-lg">
      <div className="flex items-center gap-2">
        <img src={avatar} className="w-10 rounded-full" />
        <h2>{username}</h2>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4">
        <p>{description}</p>
      </div>
      {children}
    </div>
  );
}
