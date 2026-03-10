import { useState, useEffect, useRef } from 'react';

const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' }, // Or use a globe icon, as per screenshot
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'pt', label: 'Português', flag: '🇵🇹' }
];

export default function LanguageSelector() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedLang, setSelectedLang] = useState(languages[0]);
    const dropdownRef = useRef(null);

    // Initial language detection based on what Google Translate might have set
    useEffect(() => {
        const checkLangInterval = setInterval(() => {
            const googCookie = document.cookie.split('; ').find(row => row.startsWith('googtrans='));
            if (googCookie) {
                const langCode = googCookie.split('=')[1].split('/').pop();
                const matchedLang = languages.find(l => l.code === langCode);
                if (matchedLang && matchedLang.code !== selectedLang.code) {
                    setSelectedLang(matchedLang);
                }
            }
        }, 500);

        return () => clearInterval(checkLangInterval);
    }, [selectedLang.code]);

    // Handle clicks outside the dropdown to close it
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleChangeLanguage = (lang) => {
        setSelectedLang(lang);
        setIsOpen(false);

        // Google Translate logic
        const selectEl = document.querySelector('.goog-te-combo');
        if (selectEl) {
            selectEl.value = lang.code;
            selectEl.dispatchEvent(new Event('change'));
        }
    };

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            {/* Dropdown Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                <i className="fas fa-globe text-indigo-400"></i>
                <span className="font-medium">{selectedLang.label}</span>
                <i className={`fas fa-chevron-down text-xs transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}></i>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute bottom-full right-0 mb-2 w-40 rounded-lg shadow-xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50 overflow-hidden transform origin-bottom-right transition-all">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => handleChangeLanguage(lang)}
                                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-slate-100 transition-colors flex items-center justify-between
                                    ${selectedLang.code === lang.code ? 'text-indigo-600 font-semibold bg-slate-50' : 'text-slate-700'}`}
                                role="menuitem"
                            >
                                {lang.label}
                                {selectedLang.code === lang.code && (
                                    <i className="fas fa-check text-indigo-500 text-xs"></i>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
