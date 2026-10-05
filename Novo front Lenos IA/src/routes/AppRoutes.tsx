import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';

import Home from '../pages/Home.tsx';
import About from '../pages/About.tsx';
import ConfirmationEmail from '../pages/ConfirmationEmail.tsx';
import ErrorPage from '../pages/ErrorPage.tsx';
import Faq from '../pages/Faq.tsx';
import ForgotPassword from '../pages/ForgotPassword.tsx';
import Login from '../pages/Login.tsx';
import Maintenance from '../pages/Maintenance.tsx';
import Policies from '../pages/Policies.tsx';
import Register from '../pages/Register.tsx';
import RegisterCompleted from '../pages/RegisterCompleted.tsx';
import Support from '../pages/Support.tsx';

import Analyze from '../pages/Analyze.tsx';
import Dashboard from '../pages/Dashboard.tsx';
import History from '../pages/History.tsx';
import Insights from '../pages/Insights.tsx';
import Onboarding from '../pages/Onboarding.tsx';
import ResetPassword from '../pages/ResetPassword.tsx';
import Settings from '../pages/Settings.tsx';

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, loading, hasAnsweredQuestions } = useAuth();

  if (loading) {
    return <div style={{ minHeight: '100vh', background: '#fff' }} />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!hasAnsweredQuestions) {
    return <Navigate to="/pesquisa" replace />;
  }

  return <>{children}</>;
};

const QuestionsRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div style={{ minHeight: '100vh', background: '#fff' }} />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !('IntersectionObserver' in window)
    ) {
      return;
    }

    const selector = [
      '.page .content > *',
      '.app-content > *',
      '.card_type_one',
      '.card_type_two',
      '.card_type_three',
      '.card_type_four',
      '.stat-card',
      '.dashboard-panel',
      '.report-row-card',
      '.history-row',
      '.insight-card',
      '.action-card',
      '.onboarding-card',
    ].join(', ');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.scrollReveal = 'visible';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0, rootMargin: '0px 0px -32px 0px' },
    );

    const frameId = window.requestAnimationFrame(() => {
      document.querySelectorAll<HTMLElement>(selector).forEach((element, index) => {
        element.dataset.scrollReveal = 'pending';
        element.style.setProperty('--reveal-delay', `${(index % 4) * 80}ms`);
        observer.observe(element);
      });
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      observer.disconnect();
    };
  }, [pathname]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sobre" element={<About />} />
      <Route path="/confirmacao-de-email" element={<ConfirmationEmail />} />
      <Route path="/v1/verify-email" element={<ConfirmationEmail />} />
      <Route path="/error" element={<ErrorPage />} />
      <Route path="/perguntas-frequentes" element={<Faq />} />
      <Route path="/recuperacao-de-senha" element={<ForgotPassword />} />
      <Route path="/login" element={<Login />} />
      <Route path="/manutencao" element={<Maintenance />} />
      <Route path="/politicas-e-termos-de-uso" element={<Policies />} />
      <Route path="/cadastramento" element={<Register />} />
      <Route path="/suporte" element={<Support />} />
      <Route path="/cadastramento-completo" element={<RegisterCompleted />} />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/analise"
        element={
          <PrivateRoute>
            <Analyze />
          </PrivateRoute>
        }
      />
      <Route
        path="/historico"
        element={
          <PrivateRoute>
            <History />
          </PrivateRoute>
        }
      />
      <Route
        path="/insights"
        element={
          <PrivateRoute>
            <Insights />
          </PrivateRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <Settings />
          </PrivateRoute>
        }
      />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/reset-senha" element={<ResetPassword />} />
      <Route path="/v1/reset-password" element={<ResetPassword />} />
      <Route path="/v1/user/reset-password" element={<ResetPassword />} />
      <Route
        path="/pesquisa"
        element={
          <QuestionsRoute>
            <Onboarding />
          </QuestionsRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
