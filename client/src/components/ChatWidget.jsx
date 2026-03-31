import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ChatWidget = () => {
  const location = useLocation();

  useEffect(() => {
    // Don't inject Tawk.to on the login page
    if (location.pathname === '/login') return;

    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
    s1.async = true;
    s1.src = 'https://embed.tawk.to/694be06b03fb0a197d126b7b/1jd8699di';
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');
    s0.parentNode.insertBefore(s1, s0);
    // Only injects once, but you can enhance with more logic if you want

  }, [location.pathname]);

  return null;
};

export default ChatWidget;