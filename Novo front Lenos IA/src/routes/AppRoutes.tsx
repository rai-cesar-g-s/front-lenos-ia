import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';

// Importação das páginas livres existentes
import Home from "../pages/Home.tsx";
import About from "../pages/About.tsx";
import ConfirmationEmail from "../pages/ConfirmationEmail.tsx";
import ErrorPage from "../pages/ErrorPage.tsx";
import Faq from "../pages/Faq.tsx";
import ForgotPassword from "../pages/ForgotPassword.tsx";
import Login from "../pages/Login.tsx";
import Maintenance from "../pages/Maintenance.tsx";
import Policies from "../pages/Policies .tsx";
import Register from "../pages/Register.tsx";
import RegisterCompleted from "../pages/RegisterCompleted.tsx";


//importação das páginas privadas existentes
import Analyze from "";
import Dashboard from "";
import History from "";
import Insights from "";
import Onboarding from "";
import Reset-password from "";
import Settings from "";


// Componente wrapper para rotas privadas
// Delega a verificação real da sessão para o AtuhContext
// Elimina o efeito piscar através do state global loading

const PrivateRoute = ({ children}) => {
    const { isAuthenticated, loading, hasAnsweredQuestions } = useAuth()/

    if (loading){
        return <div style={{minHeight: "100vh", background: "#fff"}};
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />
    }

    if (!hasAnsweredQuestions) {
        return <Navigate to="/pesquisa" replace/>
    }

    return children;
}

// Componente wrapper para rotas de pesquisa (Onboarding)
// Garante que o usuário está autenticado para responder a pesquisa,
// mas não causa loop de redirecionamento caso hasAnsweredQuestions seja falso

const QuestionsRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div style={{ minHeight: '100vh', background: '#fff' }} />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// AppRoutes atua como o Sistema de Roteamento Central
// Concentrando todos os paths e separando-ios da UI global do App.

const AppRoutes = () => {
    return (
        // Fluxo pre-auth / páginas estáticas
        <Route path="/" element={<Home/>}/>
        <Route path="/sobre" element={<About/>}/>
        <Route path="/confirmacao-de-email" element={<ConfirmationEmail/>}/>
        <Route path="/error" element={<ErrorPage/>}/>
        <Route path="/perguntas-frequentes" element={<Faq/>}/>
        <Route path="/recuperacao-de-senha" element={<ForgotPassword/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/manutencao" element={<Maintenance/>}/>
        <Route path="/politicas-e-termos-de-uso" element={<Policies/>}/>
        <Route path="/cadastramento" element={<Register/>}/>
        <Route path="/cadastramento-completo" element={<RegisterCompleted/>}/>
    )
}

export default AppRoutes;