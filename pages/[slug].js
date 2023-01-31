import Message from "../components/Message";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { auth, db } from "../utils/firebase";
import { toast } from "react-toastify";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

function Details() {
  const router = useRouter();
  const routeData = router.query;
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  //masukan pesan
  const submitMessage = async () => {
    //cek apakah user login
    if (!auth.currentUser) return router.push("/auth/login");

    if (!message) {
      toast.error("Komentar dulu lah ayo...", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
      });
      return;
    }
    //update firebase
    const docRef = doc(db, "posts", routeData.id);
    await updateDoc(docRef, {
      //dibawah ini bakal bikin array dan ngepush object
      comments: arrayUnion({
        message,
        avatar: auth.currentUser.photoURL,
        userName: auth.currentUser.displayName,
        time: Timestamp.now(),
      }),
    });
    setMessage("");
  };
  //get komentar
  const getComments = async () => {
    const docRef = doc(db, "posts", routeData.id);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      setAllMessages(snapshot.data().comments);
    });
    return unsubscribe;
  };
  useEffect(() => {
    if (!router.isReady) return;
    getComments();
  }, [router.isReady]);

  return (
    <div>
      <Message {...routeData}></Message>
      <div className="my-4">
        <div className="flex">
          <input
            onChange={(e) => setMessage(e.target.value)}
            type="text"
            value={message}
            placeholder="Diobrolin disini aja"
            className="bg-gray-700 w-full p-2 text-white text-sm"
          />
          <button
            onClick={submitMessage}
            className="bg-blue-500 text-white py-2 px-5 rounded-lg"
          >
            Submit
          </button>
        </div>
        <div className="py-6">
          <h2 className="font-bold ">Komentar</h2>
          {allMessages?.map((message) => (
            <div className="bg-white p-4 my-4 border-2" key={message.time}>
              <div className="flex items-center gap-2 mb-4">
                <img className="w-10 rounded-3xl" src={message.avatar} />
                <h2>{message.userName}</h2>
              </div>
              <h2>{message.message}</h2>
              <h2>{new Date(message.time.seconds * 1000).toLocaleString()}</h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Details;
