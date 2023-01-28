import Head from "next/head";
import Message from "../components/Message";
import { useEffect, useState } from "react";
import { db } from "@/utils/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

export default function Home() {
  //state dari post
  const [allPosts, setAllPosts] = useState([]);
  const getPosts = async () => {
    const collectionRef = collection(db, "posts");
    const q = query(collectionRef, orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAllPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
    return unsubscribe;
  };
  useEffect(() => {
    getPosts();
  }, []);
  return (
    <>
      <Head>
        <title>Sosmed uhuy</title>
        <meta name="description" content="Nananan" />
        <link rel="icon" href="./favicon" />
      </Head>
      <div className="my-12 text-lg font-medium">
        <h2>Lihat bacotan orang orang ini</h2>

        {allPosts.map((post) => {
          return <Message {...post} key={post.id}></Message>;
        })}
      </div>
    </>
  );
}
