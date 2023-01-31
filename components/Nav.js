import Link from "next/link";
import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Nav() {
  const [user, loading] = useAuthState(auth);

  return (
    <nav className="flex bg-blue-200 shadow-md rounded-3xl justify-between  items-center p-5">
      <Link href="/">
        <button className="text-2xl font-medium">
          Social Media Kayak Twitter Tapi Boong
        </button>
      </Link>
      <ul className="flex items-center gap-10">
        {!user && (
          <Link
            className="py-2 px-4 text-sm bg-blue-500 text-white rounded-lg font-medium ml-8"
            href={"/auth/login"}
          >
            Join
          </Link>
        )}
        {user && (
          <div className="flex items-center gap-6">
            <Link href="/post">
              <button className="font-medium bg-blue-500 text-white py-2 px-4 rounded-md text-small">
                Post
              </button>
            </Link>
            <Link href="/dashboard">
              <img
                className="w-12 rounded-full cursor-pointer"
                src={user.photoURL}
              />
            </Link>
          </div>
        )}
      </ul>
    </nav>
  );
}
