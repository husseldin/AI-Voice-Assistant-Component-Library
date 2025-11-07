# React Native Guide

Complete guide for using VoiceUI Pro with React Native.

## 🚀 Quick Start

### Installation

```bash
npm install voiceui-pro react-native-reanimated react-native-gesture-handler react-native-svg
```

### Configuration

#### 1. Install Dependencies

```bash
# Core dependencies
npm install react-native-reanimated react-native-gesture-handler

# For audio
npm install react-native-audio react-native-voice

# For haptics
npm install react-native-haptic-feedback

# For animations
npm install react-native-svg
```

#### 2. Configure Reanimated

Add to `babel.config.js`:

```javascript
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: ['react-native-reanimated/plugin'],
};
```

#### 3. Setup Gesture Handler

In your `index.js` or `App.tsx`:

```typescript
import 'react-native-gesture-handler';
```

---

## 📱 React Native Compatible Components

### VoiceOrb (Native)

Uses `react-native-reanimated` instead of `framer-motion`:

```typescript
import { VoiceOrb } from 'voiceui-pro';
import { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

function MyApp() {
  const scale = useSharedValue(1);

  return (
    <VoiceOrb
      state="listening"
      size="lg"
      onTap={() => {
        scale.value = withSpring(1.2);
      }}
    />
  );
}
```

### Voice Button with Haptics

```typescript
import { VoiceButton } from 'voiceui-pro';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

function VoiceControl() {
  const handleStart = () => {
    ReactNativeHapticFeedback.trigger('impactLight');
    // Start recording
  };

  const handleStop = () => {
    ReactNativeHapticFeedback.trigger('impactMedium');
    // Stop recording
  };

  return (
    <VoiceButton
      mode="press"
      onStart={handleStart}
      onStop={handleStop}
      size="xl"
    />
  );
}
```

---

## 🎤 Voice Recognition (Mobile)

### iOS Speech Recognition

```typescript
import Voice from '@react-native-voice/voice';
import { useState, useEffect } from 'react';

function useMobileVoice() {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    Voice.onSpeechResults = (e) => {
      setTranscript(e.value[0]);
    };

    Voice.onSpeechStart = () => setIsListening(true);
    Voice.onSpeechEnd = () => setIsListening(false);

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const start = async () => {
    try {
      await Voice.start('en-US');
    } catch (e) {
      console.error(e);
    }
  };

  const stop = async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };

  return { transcript, isListening, start, stop };
}
```

---

## 🎨 Theming in React Native

```typescript
import { ThemeProvider, purpleDreamTheme } from 'voiceui-pro';
import { View } from 'react-native';

function App() {
  return (
    <ThemeProvider defaultTheme={purpleDreamTheme}>
      <View style={{ flex: 1 }}>
        {/* Your app */}
      </View>
    </ThemeProvider>
  );
}
```

---

## 📊 Audio Visualization (Native)

### Using React Native Audio Recorder

```typescript
import { WaveformVisualizer } from 'voiceui-pro';
import AudioRecord from 'react-native-audio-record';

function AudioViz() {
  const [audioData, setAudioData] = useState([]);

  useEffect(() => {
    AudioRecord.init({
      sampleRate: 16000,
      channels: 1,
      bitsPerSample: 16,
      audioSource: 6,
    });

    AudioRecord.on('data', (data) => {
      // Convert audio data to frequency data
      const frequencies = processAudioData(data);
      setAudioData(frequencies);
    });

    return () => {
      AudioRecord.stop();
    };
  }, []);

  return (
    <WaveformVisualizer
      audioData={audioData}
      style="bars"
      height={150}
    />
  );
}
```

---

## 🤖 AI Integration (Mobile)

### Using with OpenAI

```typescript
import { useAI, OpenAIProvider } from 'voiceui-pro';

function ChatScreen() {
  const ai = useAI(new OpenAIProvider('your-api-key'));

  return (
    <ChatInterface
      messages={ai.messages}
      isProcessing={ai.isProcessing}
    />
  );
}
```

### Offline with Local LLMs

Use Ollama running on your local machine:

```typescript
import { OllamaProvider } from 'voiceui-pro';

// Connect to Ollama on your development machine
const provider = new OllamaProvider('http://192.168.1.100:11434');
```

---

## 📐 Layout Examples

### Full-Screen Voice Assistant

```typescript
import { View, SafeAreaView, StyleSheet } from 'react-native';
import {
  ThreeDVoiceOrb,
  ChatInterface,
  SuggestionChips,
  ThemeProvider,
} from 'voiceui-pro';

function VoiceAssistantScreen() {
  return (
    <ThemeProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.orbContainer}>
          <ThreeDVoiceOrb state="listening" size={300} />
        </View>

        <View style={styles.chatContainer}>
          <ChatInterface messages={[]} />
        </View>

        <View style={styles.suggestionsContainer}>
          <SuggestionChips
            suggestions={[
              { id: '1', text: 'Help me', icon: '💬' },
              { id: '2', text: 'Search', icon: '🔍' },
            ]}
            onSuggestionClick={(s) => console.log(s)}
          />
        </View>
      </SafeAreaView>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a0b2e',
  },
  orbContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatContainer: {
    flex: 2,
  },
  suggestionsContainer: {
    padding: 16,
  },
});
```

---

## 🎯 Permissions

### iOS (Info.plist)

```xml
<key>NSMicrophoneUsageDescription</key>
<string>We need microphone access for voice commands</string>

<key>NSSpeechRecognitionUsageDescription</key>
<string>We need speech recognition for voice commands</string>
```

### Android (AndroidManifest.xml)

```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.INTERNET" />
```

### Request Permissions

```typescript
import { PermissionsAndroid, Platform } from 'react-native';

async function requestMicrophonePermission() {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true; // iOS handles via Info.plist
}
```

---

## 🔧 Performance Optimization

### 1. Use Native Driver

```typescript
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

const animatedStyle = useAnimatedStyle(() => {
  return {
    transform: [{ scale: scale.value }],
  };
}, []);
```

### 2. Reduce Re-renders

```typescript
import { memo } from 'react';

const MemoizedOrb = memo(VoiceOrb);
```

### 3. Lazy Load Components

```typescript
import { lazy, Suspense } from 'react';

const ThreeDVoiceOrb = lazy(() => import('voiceui-pro/ThreeDVoiceOrb'));
```

---

## 📱 Platform-Specific Code

```typescript
import { Platform } from 'react-native';

function VoiceComponent() {
  const orbSize = Platform.select({
    ios: 320,
    android: 300,
    default: 280,
  });

  return <VoiceOrb size={orbSize} />;
}
```

---

## 🎨 Custom Native Animations

```typescript
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';

function AnimatedOrb() {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  // Pulse animation
  scale.value = withRepeat(
    withSequence(
      withSpring(1.1),
      withSpring(1)
    ),
    -1, // Infinite
    false
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <VoiceOrb state="listening" />
    </Animated.View>
  );
}
```

---

## 🔊 Background Audio

```typescript
import BackgroundTask from 'react-native-background-task';

BackgroundTask.define(async () => {
  // Process audio in background
  await processVoiceCommand();
  BackgroundTask.finish();
});

// Schedule background task
BackgroundTask.schedule();
```

---

## ✅ Testing

### Jest Configuration

```javascript
// jest.config.js
module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/jest-setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|voiceui-pro|react-native-reanimated)/)',
  ],
};
```

### Mock Voice Recognition

```typescript
// __mocks__/react-native-voice.ts
export default {
  start: jest.fn(),
  stop: jest.fn(),
  destroy: jest.fn(),
  onSpeechResults: jest.fn(),
};
```

---

## 📚 Additional Resources

- [React Native Reanimated Docs](https://docs.swmansion.com/react-native-reanimated/)
- [React Native Voice Docs](https://github.com/react-native-voice/voice)
- [Expo Audio Docs](https://docs.expo.dev/versions/latest/sdk/audio/)

---

## 🐛 Troubleshooting

### Issue: Animations Laggy on Android

**Solution**: Use `useNativeDriver: true`

```typescript
Animated.timing(value, {
  toValue: 1,
  duration: 300,
  useNativeDriver: true,
}).start();
```

### Issue: Voice Recognition Not Working

**Solution**: Check permissions and audio session

```typescript
import { Audio } from 'expo-av';

await Audio.requestPermissionsAsync();
await Audio.setAudioModeAsync({
  allowsRecordingIOS: true,
  playsInSilentModeIOS: true,
});
```

---

## 🎯 Next Steps

1. Follow the Quick Start guide above
2. Try the example apps in `examples/mobile-demo/`
3. Check out the integration examples
4. Join our Discord for support

Happy building! 🚀
