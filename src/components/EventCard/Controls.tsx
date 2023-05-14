import { useContext } from "react";
import { GlobalDataContext } from "../../providers/global";
import styles from "./EventCard.module.scss";
import { icons } from "../icons";
import { deleteDoc, doc, DocumentReference, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

interface Props {
  email: string;
  participants: string[];
  id: string;
  likes: string[];
}

const Controls: React.FC<Props> = ({ email, participants, id, likes }: Props) => {
  const {
    user,
    currentUser: { userJson },
    setShowDetails,
  } = useContext(GlobalDataContext);

  const docRef: DocumentReference = doc(db, "events", `${id}`);

  const handleButton = async (action: { type: string }): Promise<void> => {
    switch (action.type) {
      case "join":
        await updateDoc(docRef, {
          participants: [...participants, userJson],
        });
        break;
      case "leave":
        await updateDoc(docRef, {
          participants: participants.filter((e: string) => e !== userJson),
        });
        break;
      case "delete":
        if (window.confirm("Potwierdź usunięcie wybranego wydarzenia.")) {
          await deleteDoc(docRef);
        }
        break;
      case "like":
        if (likes.includes(user as string)) {
          await updateDoc(docRef, { likes: [user, ...likes] });
        } else {
          await updateDoc(docRef, { likes: likes.filter((e) => e !== user) });
        }
    }
  };

  return (
    <>
      {!participants.includes(userJson) && email !== user ? (
        <button onClick={() => handleButton({ type: "join" })} className={styles["eventcard__button--join"]}>
          <img className={styles.eventcard__img} src={icons[2]} alt="waving hand" />
          Dołącz
        </button>
      ) : null}
      <div className={styles.eventcard__controls}>
        <button className={styles.eventcard__button} title="Liczba uczestników i szczegóły" onClick={() => setShowDetails(id)}>
          <img className={styles.eventcard__img} src={icons[0]} alt="people holding hands" />
          {participants.length}
        </button>
        <button onClick={() => handleButton({ type: "like" })} className={likes.includes(user as string) ? styles["eventcard__button--liked"] : styles["eventcard__button"]} title="Lubię to!">
          <img className={styles.eventcard__img} src={icons[1]} alt="red heart" />
          {likes.length}
        </button>
        {participants.includes(userJson) && email !== user ? (
          <button onClick={() => handleButton({ type: "leave" })} className={styles.eventcard__button}>
            🚫 Opuść
          </button>
        ) : null}
        {email === user ? (
          <button onClick={() => handleButton({ type: "delete" })} className={styles.eventcard__button}>
            <img className={styles.eventcard__img} src={icons[3]} alt="bin" />
            Usuń
          </button>
        ) : null}
      </div>
    </>
  );
};

export default Controls;
