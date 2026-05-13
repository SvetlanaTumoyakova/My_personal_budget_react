import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
function Header() {
    const { currentUser, isAuthenticated, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <a className="navbar-brand" href="#">
                    Система учёта личных финансов
                </a>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div
                    className="collapse navbar-collapse"
                    id="navbarSupportedContent"
                >
                    <ul className="navbar-nav w-100 mb-2 mb-lg-0">
                        {isAuthenticated ? (
                            <>
                                <li className="nav-item ms-auto dropdown">
                                    <button
                                        className="btn btn-dark dropdown-toggle"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        {currentUser.userName}
                                    </button>
                                    <ul className="dropdown-menu dropdown-menu-lg-end dropdown-menu-dark">
                                        <li>
                                            <button
                                                onClick={handleLogout}
                                                className="dropdown-item bg-danger"
                                            >
                                                Выход
                                            </button>
                                        </li>
                                    </ul>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item ms-lg-auto">
                                    <NavLink className="nav-link" to="/login">
                                        Вход
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/register">
                                        Регистрация
                                    </NavLink>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav >
    );
}
export default Header;