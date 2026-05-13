import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function Register() {
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [lastName, setLastName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [patronymic, setPatronymic] = useState("");

    const [error, setError] = useState(null);

    const { register } = useContext(AuthContext);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (
            userName.trim() &&
            email.trim() &&
            password.trim() &&
            lastName.trim() &&
            firstName.trim()
        ) {
            try {
                const registerData = ({
                    userName,
                    email,
                    password,
                    lastName,
                    firstName,
                });

                if (patronymic.trim()) {
                    registerData.patronymic = patronymic;
                }
                await register(registerData);
            } catch (error) {
                setError(error.message || "Ошибка регистрации. Пожалуйста, попробуйте позже.");
            }
        } else {
            setError("Все поля обязательны для заполнения.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-danger">{error}</div>}


            <div className="form-group my-3">
                <label htmlFor="userName" className="form-label">
                    Имя пользователя *
                </label>
                <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Введите имя пользователя..."
                    className="form-control"
                />
            </div>

            <div className="form-group my-3">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Введите email..."
                    className="form-control"
                />
            </div>

            <div className="form-group my-3">
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Введите пароль..."
                    className="form-control"
                />
            </div>

            <div className="form-group my-3">
                <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Введите фамилию..."
                    className="form-control"
                />
            </div>

            <div className="form-group my-3">
                <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Введите имя..."
                    className="form-control"
                />
            </div>

            <div className="form-group my-3">
                <input
                    type="text"
                    value={patronymic}
                    onChange={(e) => setPatronymic(e.target.value)}
                    placeholder="Введите отчество..."
                    className="form-control"
                />
            </div>

            <button type="submit" className="btn btn-outline-success mt-3">
                Зарегистрироваться
            </button>
            <Link to="/login" className="btn btn-secondary mt-3 ms-4">Уже есть аккаунт</Link>
        </form>
    );
}

export default Register;