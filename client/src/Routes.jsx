import { useContext } from "react";
import { UserContext } from "../UserContext";
import RegisterandLogginForm from "./components/RegisterandLogginForm";
import Chat from "./components/Chat";

export default function Routes() {
    const { username, id } = useContext(UserContext);
    if (username) {
        return <Chat />
    }
    return (

        < RegisterandLogginForm />
    )
}