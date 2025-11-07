export interface Language {
  code: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  speechCode?: string; // For Web Speech API
}

export const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', direction: 'ltr', speechCode: 'en-US' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', direction: 'ltr', speechCode: 'es-ES' },
  { code: 'fr', name: 'French', nativeName: 'Français', direction: 'ltr', speechCode: 'fr-FR' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', direction: 'ltr', speechCode: 'de-DE' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', direction: 'ltr', speechCode: 'it-IT' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', direction: 'ltr', speechCode: 'pt-BR' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', direction: 'ltr', speechCode: 'ru-RU' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', direction: 'ltr', speechCode: 'zh-CN' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', direction: 'ltr', speechCode: 'ja-JP' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', direction: 'ltr', speechCode: 'ko-KR' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', direction: 'rtl', speechCode: 'ar-SA' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', direction: 'ltr', speechCode: 'hi-IN' },
];

export const translations = {
  en: {
    'voice.listening': 'Listening...',
    'voice.thinking': 'Thinking...',
    'voice.speaking': 'Speaking...',
    'voice.error': 'Error occurred',
    'voice.tapToSpeak': 'Tap to speak',
    'chat.placeholder': 'Type a message...',
    'chat.send': 'Send',
    'chat.clear': 'Clear',
    'suggestions.title': 'Quick Actions',
    'commands.help': 'Help',
    'commands.settings': 'Settings',
  },
  es: {
    'voice.listening': 'Escuchando...',
    'voice.thinking': 'Pensando...',
    'voice.speaking': 'Hablando...',
    'voice.error': 'Ocurrió un error',
    'voice.tapToSpeak': 'Toca para hablar',
    'chat.placeholder': 'Escribe un mensaje...',
    'chat.send': 'Enviar',
    'chat.clear': 'Borrar',
    'suggestions.title': 'Acciones Rápidas',
    'commands.help': 'Ayuda',
    'commands.settings': 'Configuración',
  },
  fr: {
    'voice.listening': 'Écoute...',
    'voice.thinking': 'Réflexion...',
    'voice.speaking': 'Parle...',
    'voice.error': 'Erreur survenue',
    'voice.tapToSpeak': 'Appuyez pour parler',
    'chat.placeholder': 'Tapez un message...',
    'chat.send': 'Envoyer',
    'chat.clear': 'Effacer',
    'suggestions.title': 'Actions Rapides',
    'commands.help': 'Aide',
    'commands.settings': 'Paramètres',
  },
  de: {
    'voice.listening': 'Hört zu...',
    'voice.thinking': 'Denkt nach...',
    'voice.speaking': 'Spricht...',
    'voice.error': 'Fehler aufgetreten',
    'voice.tapToSpeak': 'Tippen zum Sprechen',
    'chat.placeholder': 'Nachricht eingeben...',
    'chat.send': 'Senden',
    'chat.clear': 'Löschen',
    'suggestions.title': 'Schnellaktionen',
    'commands.help': 'Hilfe',
    'commands.settings': 'Einstellungen',
  },
};

export type TranslationKey = keyof typeof translations.en;
export type Translations = Record<string, Record<TranslationKey, string>>;
