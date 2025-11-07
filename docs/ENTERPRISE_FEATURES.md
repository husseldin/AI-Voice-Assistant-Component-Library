# Enterprise Features Guide

Advanced enterprise-grade features for production AI voice assistants.

---

## 🎯 Voice Commands System

### Overview
Powerful voice command recognition with fuzzy matching, intent detection, and custom command support.

### Quick Start

```typescript
import { VoiceCommandRecognizer, allPresetCommands } from 'voiceui-pro';

// Create recognizer
const recognizer = new VoiceCommandRecognizer({
  fuzzyMatch: true,
  confidenceThreshold: 0.6,
  maxSuggestions: 3,
});

// Register preset commands
recognizer.registerCommands(allPresetCommands);

// Recognize command from voice input
const intent = recognizer.recognize("go to home page");
if (intent) {
  console.log(`Command: ${intent.command.name}`);
  console.log(`Confidence: ${intent.confidence}`);
  intent.command.handler(intent.params);
}
```

### Custom Commands

```typescript
const myCommand = {
  id: 'custom-search',
  name: 'Search Products',
  phrases: [
    'search for {query}',
    'find {query}',
    'look for {query}',
  ],
  description: 'Search for products',
  category: 'shopping',
  icon: '🔍',
  handler: (params) => {
    searchProducts(params.query);
  },
};

recognizer.registerCommand(myCommand);
```

### Preset Command Categories

- **Navigation** (4 commands) - go home, go back, search
- **Media** (5 commands) - play, pause, next, previous, volume
- **System** (3 commands) - help, settings, logout
- **Productivity** (3 commands) - notes, reminders, timers
- **Communication** (3 commands) - call, message, email

Total: **18 preset commands** ready to use!

---

## 🎨 Voice Command Palette

### Visual Command Search

```typescript
import { VoiceCommandPalette } from 'voiceui-pro';

function App() {
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  // Open with keyboard shortcut (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <VoiceCommandPalette
      commands={allPresetCommands}
      isOpen={isPaletteOpen}
      onClose={() => setIsPaletteOpen(false)}
      onCommandSelect={(cmd, params) => {
        cmd.handler(params);
      }}
    />
  );
}
```

**Features:**
- 🔍 Search commands by name, description, or phrases
- ⌨️ Keyboard navigation (↑↓ arrows, Enter, Esc)
- 📂 Grouped by category
- ✨ Glassmorphism design
- 🎯 Fuzzy matching

---

## 🤖 Function Calling

### Overview
Enable AI to call functions in your application - perfect for integrating with APIs, databases, and services.

### Quick Start

```typescript
import { AIFunctionRegistry, useAI, OpenAIProvider } from 'voiceui-pro';

// Create function registry
const functions = new AIFunctionRegistry();

// Register weather function
functions.registerFunction(
  'get_weather',
  {
    name: 'get_weather',
    description: 'Get current weather for a location',
    parameters: {
      type: 'object',
      properties: {
        location: {
          type: 'string',
          description: 'City name',
        },
        unit: {
          type: 'string',
          enum: ['celsius', 'fahrenheit'],
        },
      },
      required: ['location'],
    },
  },
  async (args) => {
    const weather = await fetchWeather(args.location, args.unit);
    return weather;
  }
);

// Use with OpenAI
const provider = new OpenAIProvider('your-api-key');
const ai = useAI(provider, {
  functions: functions.getAllFunctions(),
});
```

### Preset Functions

Ready-to-use function definitions:

- **get_weather** - Get weather for a location
- **calculate** - Perform math calculations
- **search** - Web search
- **set_reminder** - Create reminders
- **send_email** - Send emails
- **create_event** - Calendar events

### Execute Functions

```typescript
// When AI returns a function call
const functionCall = {
  name: 'get_weather',
  arguments: { location: 'San Francisco', unit: 'fahrenheit' },
};

const result = await functions.executeFunction(functionCall);
console.log(result);
// { name: 'get_weather', result: { temp: 72, conditions: 'Sunny' } }
```

---

## 🧠 Conversation Memory

### Overview
RAG-like memory system for maintaining long-term conversation context.

### Quick Start

```typescript
import { ConversationMemoryStore } from 'voiceui-pro';

// Create memory store (max 1000 memories)
const memory = new ConversationMemoryStore(1000);

// Add memories
memory.addMemory('user', 'My name is John');
memory.addMemory('assistant', 'Nice to meet you, John!');
memory.addMemory('user', 'I love pizza');

// Search memories
const results = memory.searchMemories({
  query: 'food preferences',
  limit: 5,
  threshold: 0.5,
});

console.log(results);
// [{ memory: { content: 'I love pizza', ... }, similarity: 0.8 }]

// Get recent context
const recent = memory.getRecentMemories(10);

// Get important memories
const important = memory.getImportantMemories(0.7, 5);
```

### Features

- **Semantic Search** - Find relevant memories by meaning
- **Importance Scoring** - Automatically scores message importance
- **Time-based Queries** - Get memories by time range
- **Role Filtering** - Filter by user/assistant/system
- **Smart Trimming** - Keeps important memories when full
- **Export/Import** - Save and restore conversations

### Memory Stats

```typescript
const stats = memory.getStats();
console.log(stats);
// {
//   totalMemories: 145,
//   oldestMemory: Date(...),
//   newestMemory: Date(...),
//   averageImportance: 0.65
// }
```

### Integration with AI

```typescript
const ai = useAI(provider);

// Before sending message, get relevant context
const context = memory.searchMemories({
  query: userMessage,
  limit: 3,
});

// Include context in AI message
const contextString = context
  .map(r => r.memory.content)
  .join('\n');

await ai.sendMessage(`Context:\n${contextString}\n\nUser: ${userMessage}`);

// Save new memories
memory.addMemory('user', userMessage);
memory.addMemory('assistant', ai.messages[ai.messages.length - 1].content);
```

---

## 🌍 Multi-Language Support

### Overview
Support for 12 languages with built-in translations and RTL support.

### Supported Languages

- 🇺🇸 English
- 🇪🇸 Spanish
- 🇫🇷 French
- 🇩🇪 German
- 🇮🇹 Italian
- 🇵🇹 Portuguese
- 🇷🇺 Russian
- 🇨🇳 Chinese
- 🇯🇵 Japanese
- 🇰🇷 Korean
- 🇸🇦 Arabic (RTL)
- 🇮🇳 Hindi

### Usage

```typescript
import { languages, translations } from 'voiceui-pro';

// Get all languages
languages.forEach(lang => {
  console.log(`${lang.code}: ${lang.nativeName}`);
});

// Use translations
const t = (key: string, lang = 'en') => {
  return translations[lang]?.[key] || translations.en[key];
};

console.log(t('voice.listening', 'es')); // "Escuchando..."
console.log(t('voice.listening', 'fr')); // "Écoute..."
```

### With Speech Recognition

```typescript
const selectedLanguage = languages.find(l => l.code === 'es');
const speechLang = selectedLanguage?.speechCode; // 'es-ES'

// Configure speech recognition
recognition.lang = speechLang;
```

### RTL Support

```typescript
const isRTL = language.direction === 'rtl';

<div dir={isRTL ? 'rtl' : 'ltr'}>
  {/* Your content */}
</div>
```

---

## 🎯 Complete Example: Enterprise Voice App

```typescript
import {
  ThreeDVoiceOrb,
  ChatInterface,
  VoiceCommandPalette,
  LiveCaptions,
  useAI,
  useSpeechRecognition,
  VoiceCommandRecognizer,
  AIFunctionRegistry,
  ConversationMemoryStore,
  OpenAIProvider,
  allPresetCommands,
  presetFunctions,
} from 'voiceui-pro';

function EnterpriseVoiceApp() {
  // Setup AI with OpenAI
  const ai = useAI(new OpenAIProvider('sk-...'));

  // Setup speech recognition
  const speech = useSpeechRecognition();

  // Setup voice commands
  const commandRecognizer = new VoiceCommandRecognizer();
  commandRecognizer.registerCommands(allPresetCommands);

  // Setup function calling
  const functions = new AIFunctionRegistry();
  presetFunctions.forEach(fn => {
    functions.registerFunction(fn.name, fn, async (args) => {
      // Implement function handlers
      return handleFunction(fn.name, args);
    });
  });

  // Setup conversation memory
  const memory = new ConversationMemoryStore(1000);

  // Voice command palette
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  useEffect(() => {
    // Check for commands in speech
    if (speech.transcript) {
      const intent = commandRecognizer.recognize(speech.transcript);
      if (intent && intent.confidence > 0.8) {
        intent.command.handler(intent.params);
        return;
      }

      // Otherwise, send to AI with memory context
      const context = memory.searchMemories({
        query: speech.transcript,
        limit: 3,
      });

      const contextStr = context
        .map(r => r.memory.content)
        .join('\n');

      ai.sendMessageStream(
        `Context:\n${contextStr}\n\nUser: ${speech.transcript}`
      );

      memory.addMemory('user', speech.transcript);
    }
  }, [speech.transcript]);

  return (
    <>
      <ThreeDVoiceOrb
        state={speech.isListening ? 'listening' : ai.isProcessing ? 'thinking' : 'idle'}
      />

      <LiveCaptions
        text={speech.transcript}
        interimText={speech.interimTranscript}
      />

      <ChatInterface
        messages={ai.messages}
        isProcessing={ai.isProcessing}
      />

      <VoiceCommandPalette
        commands={allPresetCommands}
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        onCommandSelect={(cmd, params) => {
          cmd.handler(params);
          setIsPaletteOpen(false);
        }}
      />
    </>
  );
}
```

---

## 📊 Feature Comparison

| Feature | Basic | Enterprise |
|---------|-------|------------|
| Voice Commands | ❌ | ✅ 18 presets + custom |
| Command Palette | ❌ | ✅ VS Code style |
| Function Calling | ❌ | ✅ Full support |
| Conversation Memory | ❌ | ✅ RAG-like |
| Multi-Language | ❌ | ✅ 12 languages |
| Intent Recognition | ❌ | ✅ Fuzzy matching |
| Importance Scoring | ❌ | ✅ Automatic |
| Memory Search | ❌ | ✅ Semantic |

---

## 🚀 Performance

- **Command Recognition:** < 1ms average
- **Memory Search:** < 10ms for 1000 memories
- **Function Execution:** Depends on your handlers
- **Zero Network Latency:** All processing is local

---

## 🎯 Best Practices

### 1. Command Design

```typescript
// ✅ Good - Multiple natural phrases
{
  phrases: ['turn off the lights', 'lights off', 'disable lights'],
}

// ❌ Bad - Single phrase
{
  phrases: ['turn_off_lights'],
}
```

### 2. Memory Management

```typescript
// Store important context
memory.addMemory('system', 'User prefers dark mode', {
  category: 'preferences',
  importance: 0.9,
});

// Clean up periodically
if (memory.getStats().totalMemories > 5000) {
  memory.clearMemories();
}
```

### 3. Function Calling

```typescript
// ✅ Good - Clear, specific description
{
  description: 'Get current weather forecast for a specific city',
  parameters: { /* well-defined */ },
}

// ❌ Bad - Vague description
{
  description: 'Weather stuff',
}
```

---

## 📚 Additional Resources

- [Voice Commands API Reference](./API_REFERENCE.md#voice-commands)
- [Function Calling Guide](./FUNCTION_CALLING.md)
- [Memory System Deep Dive](./MEMORY.md)
- [i18n Best Practices](./I18N.md)

---

Built with ❤️ for enterprise voice applications
