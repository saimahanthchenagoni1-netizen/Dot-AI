
import React, { useState, useEffect } from 'react';
import { Onboarding } from './screens/Onboarding.tsx';
import { ChatInterface } from './screens/ChatInterface.tsx';

const App: React.FC = () => {
  const [userName, setUserName] = useState<string>('');
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [isIntroComplete, setIsIntroComplete] = useState<boolean>(false);
  const [settings, setSettings] = useState({
    snowfall: false,
    proMode: false
  });

  useEffect(() => {
    const savedName = localStorage.getItem('dot_user_name');
    const savedAvatar = localStorage.getItem('dot_user_avatar');
    const introComplete = localStorage.getItem('dot_intro_complete');
    const savedSettings = localStorage.getItem('dot_settings');
    
    if (savedName) setUserName(savedName);
    if (savedAvatar) setUserAvatar(savedAvatar);
    if (introComplete === 'true') setIsIntroComplete(true);
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
  }, []);

  const handleIntroComplete = (name: string) => {
    setUserName(name);
    setIsIntroComplete(true);
    localStorage.setItem('dot_user_name', name);
    localStorage.setItem('dot_intro_complete', 'true');
  };

  const updateProfile = (name: string, avatar: string | null) => {
    setUserName(name);
    setUserAvatar(avatar);
    localStorage.setItem('dot_user_name', name);
    if (avatar) localStorage.setItem('dot_user_avatar', avatar);
    else localStorage.removeItem('dot_user_avatar');
  };

  const updateSettings = (newSettings: any) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('dot_settings', JSON.stringify(updated));
  };

  if (!isIntroComplete) {
    return <Onboarding onComplete={handleIntroComplete} />;
  }

  return (
    <div className="bg-[#000000] min-h-screen text-white selection:bg-white selection:text-black font-sans relative">
      <ChatInterface 
        userName={userName} 
        userAvatar={userAvatar}
        settings={settings}
        onUpdateProfile={updateProfile}
        onUpdateSettings={updateSettings}
      />
    </div>
  );
};

export default App;
