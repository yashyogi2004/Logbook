import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const COOKIE_KEY = 'user_preferred_color';
const CONSENT_KEY = 'cookie_consent';

function UserPreference() {
  const [color, setColor] = useState('');
  const [consent, setConsent] = useState(Cookies.get(CONSENT_KEY) === 'true');

  useEffect(() => {
    if (consent) {
      const savedColor = Cookies.get(COOKIE_KEY);
      if (savedColor) setColor(savedColor);
    }
  }, [consent]);

  const handleColorChange = (e) => {
    const newColor = e.target.value;
    setColor(newColor);
    if (consent) {
      Cookies.set(COOKIE_KEY, newColor, { expires: 7 });
    }
  };

  const handleRemovePreference = () => {
    setColor('');
    if (consent) Cookies.remove(COOKIE_KEY);
  };

  const handleAcceptCookies = () => {
    Cookies.set(CONSENT_KEY, 'true', { expires: 365 });
    setConsent(true);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg w-80 relative">
      {!consent && (
        <div className="absolute top-0 left-0 right-0 bg-gray-800 text-white p-3 rounded mb-4 flex flex-col space-y-2">
          <p>We use cookies to save your preferences. Do you accept?</p>
          <button
            onClick={handleAcceptCookies}
            className="bg-green-500 px-4 py-2 rounded hover:bg-green-600"
          >
            Accept Cookies
          </button>
        </div>
      )}

      <h2 className="text-lg font-bold mb-3">User Color Preference</h2>
      
      <input
        type="color"
        value={color || '#000000'}
        onChange={handleColorChange}
        className="w-full h-10 cursor-pointer mb-3"
        disabled={!consent}
      />
      
      <p className="mb-3">Selected Color: <span style={{ color }}>{color || 'None'}</span></p>

      <button
        onClick={handleRemovePreference}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        disabled={!consent}
      >
        Remove Preference
      </button>
    </div>
  );
}

export default UserPreference;
