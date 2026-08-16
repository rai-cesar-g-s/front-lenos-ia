import React from "react";
import { Routes, Route, Navigate} from "react-router-dom";
import { useAuth } from "../context"

// Importação das Páginas
import Home from "../pages/Home";
import Faq from "../pages/Faq";
import Policies from "../pages/Policies";
import About from "../pages/bout";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Analyze from "../pages/Analyze";
import ForgotPassWord from "../pages/ForgotPassWord";
import Login from "../pages/Login";
import Settings from "../pages/Settings";
import Support from "../pages/Support";
import Maintenance from "../pages/Maintenance";
import ConfirmationEmail from "../pages/ConfirmationEmail"
import RegisterCompleted from "../pages/RegisterCompleted"

// Componente Wrapper para Rotas Privadas
// Delega a verificação real da sessão para o AuthContext.
// Elimina o efeito piscar através do state global loading.

const PrivateRoute = ({children}) =>  {
    const {isAuthenticated, loading, hasAnsweredQuestions} = useAuth();

    if(loading) {
        return <div style={{minHeight: '100vh', background: '#fff'}}/>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace/>;
    }

    if (!hasAnsweredQuestions) {
        return <Navigate to="pesquisa" replace/>
    }

    return children;
}

// Componente Wrapper para Rotas de Pesquisa (onboarding)
// Garante que o usuário autenticado para responder a pesquisa, mas não causa loop de redirecionamento caso hasAnsweredQuestions seja falso

const QuestionsRoute = ({ children }) => {
    const { isAuthenticated, loading} = useAuth();

     if(loading) {
        return <div style={{minHeight: '100vh', background: '#fff'}}/>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace/>;
    }

    return children/
}

// AppRoutes atua como o Sistema de Roteamento Central concentrando todos os paths e separando-os da UI global do App.

const AppRoutes = () => {
    <Routes>
        {/* Fluxo Pre-Auth / Páginas Estáticas*/}
        <Route path="/" element={<Home/>}/>
        <Route path="/politicas" element={<Policies/>}/>
        <Route path="/perguntas-frequentes" element={<Faq/>}/>
        <Route path="/sobre-nos" element={<About/>}/>
        <Route path="/error" element={<Maintenance/>}/>

        {/* Fluxo de Cadastro (onboarding) */}
        <Route path="/registro" element={<Register/>}/>
        <Route path="/confirmar-email" element={<ConfirmationEmail/>}/>
        <Route path="/registro-concluido" element={<RegisterCompleted/>}/>

        {/* Fluxo Post-Auth / Sistema Base (protegido) */}

        {/* Fallback Catch-all Route 404 */}

    </Routes>
}

export default AppRoutes;