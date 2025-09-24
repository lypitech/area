import { useNavigate } from "react-router-dom";

export default function logout() {
    const nav = useNavigate();
    localStorage.removeItem("token");
    nav("/");
};
