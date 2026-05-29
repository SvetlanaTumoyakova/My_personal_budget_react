import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AccountsProvider } from "./context/AccountsContext";
import { ProductsProvider } from "./context/ProductsContext";
import Header from "./components/Header";

import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Home from "./pages/Home/Home";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Header />
        <div className="container my-5">
          <Routes>
            <Route path="/" element={
              <ProtectedRoute>
                <AccountsProvider>
                  <ProductsProvider>
                    <Home />
                  </ProductsProvider>
                </AccountsProvider>
              </ProtectedRoute>
            }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App
