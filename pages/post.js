import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { async } from "@firebase/util";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";

export default function Post() {
  //form
  const [post, setPost] = useState({ description: "" });
  const [user, loading] = useAuthState(auth);
  const route = useRouter();
  const routeData = route.query;
  //masukan post
  const submitPost = async (e) => {
    e.preventDefault();
    //cek deskriptsi keisi apa gk
    if (!post.description) {
      toast.error("Belum ke isi coy", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
      });
      return;
    }
    if (post.description.length > 300) {
      toast.error("Kepanjangan woi, singkat ae", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2400,
      });
      return;
    }
    if (post?.hasOwnProperty("id")) {
      const docRef = doc(db, "posts", post.id);
      const updatedPost = { ...post, timestamp: serverTimestamp() };
      await updateDoc(docRef, updatedPost);
      return route.push("/");
    } else {
      //post baru
      const collectionRef = collection(db, "posts");
      await addDoc(collectionRef, {
        ...post,
        timestamp: serverTimestamp(),
        user: user.uid,
        avatar: user.photoURL,
        username: user.displayName,
      });
      setPost({ description: "" });
      toast.success("Tulisanmu sudah dibuat", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
      });
      return Router.push("/");
    }
  };

  //cek user
  const checkUser = async () => {
    if (loading) return;
    if (!user) route.push("/auth/login");
    if (routeData.id) {
      setPost({ description: routeData.description, id: routeData.id });
    }
  };
  useEffect(() => {
    checkUser();
  }, [user, loading]);

  return (
    <div className="my-20 p-12 shadow-lg rounded-lg max-w-md mx-auto">
      <form onSubmit={submitPost}>
        <h1 className="text-2xl font-bold">
          {post.hasOwnProperty("id") ? "Edit postinganmu" : "Buat postingan"}
        </h1>
        <div className="py-2 ">
          <h3 className="text-lg font-medium py-2">deskripsi</h3>
          <textarea
            value={post.description}
            onChange={(e) => {
              setPost({ ...post, description: e.target.value });
            }}
            className="bg-gray-700 h-48 w-full text-white rounded-lg  p-2 text-small"
          ></textarea>
          <p
            className={`text-blue-800 font-medium text-sm ${
              post.description.length > 300 ? "text-red-600" : ""
            }`}
          >
            {post.description.length}/300
          </p>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-medium p-2 my-2 rounded-lg text-small"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
