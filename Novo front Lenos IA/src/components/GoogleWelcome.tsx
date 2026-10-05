import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Card_GoogleOAuth from './Card_GoogleOAuth';

const GoogleWelcome = ({ onClose }: { onClose: () => void }) => {
  const dialog = useRef<HTMLDialogElement>(null);
  const navigate = useNavigate();
  useEffect(() => {
    dialog.current?.showModal();
    navigate('/dashboard', { replace: true, state: null });
  }, [navigate]);
  return <dialog ref={dialog} className="google-welcome-dialog" onCancel={onClose} onClose={onClose} aria-labelledby="google-welcome-title">
    <h2 id="google-welcome-title">Obrigado por responder!</h2>
    <p>Agora podemos conhecer melhor seu canal. Você pode explorar a plataforma e conectar sua conta quando estiver pronto para analisar seus vídeos.</p>
    <Card_GoogleOAuth />
    <button className="google-welcome-dismiss" onClick={onClose} autoFocus>Conectar mais tarde</button>
  </dialog>;
};
export default GoogleWelcome;
