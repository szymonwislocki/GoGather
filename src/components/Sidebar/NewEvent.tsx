import { useContext } from "react";
import { GlobalDataContext } from "../../providers/global";
import AddEventForm from "../addEventForm/AddEventForm";
import styles from "./Sidebar.module.scss";

const NewEvent: React.FC = () => {
  const { showForm } = useContext(GlobalDataContext);
  return <div className={styles.events}>{showForm ? <AddEventForm /> : <div className={styles.events__view}>Najpierw kliknij na mapę i wybierz miejsce spotkania</div>}</div>;
};

export default NewEvent;
