import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import Link from "next/link";
import Message from "../components/Message";
import { BsTrash2Fill } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";

export default function Dashboard() {
  const route = useRouter();
  const [user, loading] = useAuthState(auth);
  const [posts, setPosts] = useState([]);
  //ketika user login

  const getData = async () => {
    if (loading) return;
    if (!user) return route.push("/auth/login");

    const collectionRef = collection(db, "posts");
    const q = query(collectionRef, where("user", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
    return unsubscribe;
  };
  //hapusmenghapus
  const deletePost = async (id) => {
    const docRef = doc(db, "posts", id);
    await deleteDoc(docRef);
  };

  //mendapatkan data user
  useEffect(() => {
    getData();
  }, [user, loading]);

  return (
    <div>
      <h1>Postinganmu</h1>
      <div>
        {posts.map((post) => {
          return (
            <Message {...post} key={post.id}>
              <div className="flex gap-4 ">
                <button
                  onClick={() => deletePost(post.id)}
                  className="text-red-500 bg-slate-100 rounded-lg flex items-center justify-center gap-2 py-2 px-2 text-small "
                >
                  <BsTrash2Fill className="text-2xl" /> Hapus
                </button>
                <Link href={{ pathname: "/post", query: post }}>
                  <button className="text-blue-500 bg-slate-100 rounded-lg flex items-center justify-center gap-2 py-2 px-2  text-small ">
                    <AiFillEdit className="text-2xl" />
                    Edit
                  </button>
                </Link>
              </div>
            </Message>
          );
        })}
      </div>
      <button
        className="font-medium text-white bg-blue-500 rounded-lg my-5 py-2 px-4"
        onClick={() => auth.signOut()}
      >
        Sign Out
      </button>
    </div>
  );
}
