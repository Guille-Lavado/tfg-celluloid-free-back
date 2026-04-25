import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminObras from "./pages/AdminObras";
import AdminUsuarios from "./pages/AdminUsuarios";
import LoginModal from "./components/LoginModal";
import AdminLayout from "./components/AdminLayout";
import { Spinner, Container } from "react-bootstrap";
import api from "./api/axios";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
    const [user, setUser]           = useState(null);
    const [loading, setLoading]     = useState(true);
    const [showLogin, setShowLogin] = useState(false);

    // Al arrancar comprueba si ya hay sesión activa en la cookie
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await api.get("/api/user");
                setUser(res.data);
            } catch {
                // 401 → no hay sesión, mostramos el login
                setShowLogin(true);
            } finally {
                setLoading(false);
            }
        }

        checkAuth();
    }, []);

    const handleLogin = (userData) => {
        setUser(userData);
        setShowLogin(false);
    };

    const handleLogout = async () => {
        try {
            await api.post("/api/logout");
        } finally {
            setUser(null);
            setShowLogin(true);
        };
    };

    // Mientras comprueba la sesión muestra un spinner
    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center vh-100">
                <Spinner animation="border" />
            </Container>
        );
    }

    // Sin usuario → solo el modal, no se puede cerrar sin loguearse
    if (!user) {
        return (
            <LoginModal
                show={showLogin}
                onHide={() => {}}
                onLogin={handleLogin}
            />
        );
    }

    // Con usuario → panel de admin
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/admin/obras" replace />} />
                <Route path="/admin" element={<AdminLayout user={user} onLogout={handleLogout} />}>
                    <Route path="obras"    element={<AdminObras />} />
                    <Route path="usuarios" element={<AdminUsuarios />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;