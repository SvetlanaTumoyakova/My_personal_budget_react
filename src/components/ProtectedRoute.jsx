import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
    const { isAuthenticated } = useContext(AuthContext);

    if (isAuthenticated === false) {
        return <Navigate to={"/login"} replace />;
    } else {
        return children;
    }
}

export default ProtectedRoute;