import React from 'react';
import Dict from './Dict';
import DerTranslate from './DerTranslate';
import AdditionQuiz from './AdditionQuiz';
import WhatsAppQuickChat from './WhatsApp';
import Ocr from './Ocr';
import KidsVocabularyTest from './KidsVocabularyTest';

export default function Home() {
  const [comp, setComp] = React.useState('Dict');
  const [dictKey, setDictKey] = React.useState(0);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="app-wrapper">
      {/* Header - Fixed */}
      <header className="header bg-secondary text-white py-3 px-4 fixed-top">
        <nav className="d-flex justify-content-between align-items-center">
          <div className="fs-4 fw-bold">UtiliMate</div>
          <div className="d-md-none">
            {/* Hamburger Icon */}
            <button
              className="btn btn-outline-light"
              onClick={toggleSidebar}
              aria-label="Toggle Sidebar"
            >
              ☰
            </button>
          </div>
          <ul className="nav d-none d-md-flex">
            <li className="nav-item">
              <a href="#" className="nav-link text-white">Home</a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link text-white">About</a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link text-white">Contact</a>
            </li>
          </ul>
        </nav>
      </header>

      {/* Spacer for fixed header */}
      <div className="header-spacer" style={{ height: '64px' }} />

      {/* Mobile Sidebar Overlay */}
      <div
        className={`mobile-sidebar-overlay ${sidebarOpen ? 'show' : ''}`}
        onClick={closeSidebar}
      ></div>

      {/* Layout */}
      <div className="d-flex" style={{ minHeight: 'calc(100vh - 112px)' }}>
        {/* Sidebar */}
        <aside
          className={`sidebar bg-custom-sidebar p-3 ${sidebarOpen ? 'open' : ''
            } d-md-block`}
        >
          {/* <h5 className="fw-bold mb-3 text-white">Sidebar</h5> */}
          <ul className="list-unstyled">
            <li className="p-2 rounded text-white hover-bg">
              <button onClick={() => { setComp("Addition"); closeSidebar(); }} className="btn btn-link text-white p-0">
                Addition
              </button>
            </li>
            <li className="p-2 rounded text-white hover-bg">
              <button onClick={() => { setComp("Vocabulary"); closeSidebar(); }} className="btn btn-link text-white p-0">
                Kids Vocabulary Test
              </button>
            </li>
            <li className="p-2 rounded text-white hover-bg">
              <button onClick={() => { setComp("Translate"); closeSidebar(); }} className="btn btn-link text-white p-0">
                Translate
              </button>
            </li>
            <li className="p-2 rounded text-white hover-bg">
              <button onClick={() => {
                if (comp === "Dict") {
                  setDictKey(prev => prev + 1); // force reset
                }
                setComp("Dict");
                closeSidebar();
              }}

                className="btn btn-link text-white p-0">
                Dict
              </button>
            </li>
            <li className="p-2 rounded text-white hover-bg">
              <button onClick={() => { setComp("OCR"); closeSidebar(); }} className="btn btn-link text-white p-0">
                Image To Text
              </button>
            </li>
            <li className="p-2 rounded text-white hover-bg">
              <button onClick={() => { setComp("WhatsAppQuickChat"); closeSidebar(); }} className="btn btn-link text-white p-0">
                Whatsapp Link
              </button>
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <main
          className="flex-grow-1 p-4 bg-custom-content text-dark"
          style={{
            height: 'calc(100vh - 112px)',
            overflowY: 'auto'
          }}
        >
          <div className="mb-4">
            {comp === "Addition" && <AdditionQuiz />}
            {comp === "Vocabulary" && <KidsVocabularyTest />}
            {comp === "Dict" && <Dict key={dictKey} />}
            {comp === "Translate" && <DerTranslate />}
            {comp === "OCR" && <Ocr />}
            {comp === "WhatsAppQuickChat" && <WhatsAppQuickChat />}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="footer bg-custom-footer text-white text-center py-2 fixed-bottom small">
        © 2025 My Company. All rights reserved.
      </footer>
    </div>
  );
}
