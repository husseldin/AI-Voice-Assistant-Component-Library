import { VoiceCommand, CommandCategory } from './types';

/**
 * Preset Voice Commands for common use cases
 */

// Navigation Commands
export const navigationCommands: VoiceCommand[] = [
  {
    id: 'nav-home',
    name: 'Go Home',
    phrases: ['go home', 'home page', 'take me home', 'navigate home'],
    description: 'Navigate to home page',
    category: 'navigation',
    icon: '🏠',
    handler: () => console.log('Navigate to home'),
  },
  {
    id: 'nav-back',
    name: 'Go Back',
    phrases: ['go back', 'back', 'previous page'],
    description: 'Go to previous page',
    category: 'navigation',
    icon: '◀️',
    handler: () => console.log('Navigate back'),
  },
  {
    id: 'nav-search',
    name: 'Search',
    phrases: ['search', 'find', 'search for {query}'],
    description: 'Open search',
    category: 'navigation',
    icon: '🔍',
    handler: (params) => console.log('Search:', params?.query),
  },
];

// Media Commands
export const mediaCommands: VoiceCommand[] = [
  {
    id: 'media-play',
    name: 'Play',
    phrases: ['play', 'start', 'resume'],
    description: 'Play media',
    category: 'media',
    icon: '▶️',
    handler: () => console.log('Play media'),
  },
  {
    id: 'media-pause',
    name: 'Pause',
    phrases: ['pause', 'stop'],
    description: 'Pause media',
    category: 'media',
    icon: '⏸️',
    handler: () => console.log('Pause media'),
  },
  {
    id: 'media-next',
    name: 'Next',
    phrases: ['next', 'skip', 'next track'],
    description: 'Next track',
    category: 'media',
    icon: '⏭️',
    handler: () => console.log('Next track'),
  },
  {
    id: 'media-previous',
    name: 'Previous',
    phrases: ['previous', 'back', 'previous track'],
    description: 'Previous track',
    category: 'media',
    icon: '⏮️',
    handler: () => console.log('Previous track'),
  },
  {
    id: 'media-volume',
    name: 'Set Volume',
    phrases: ['volume {level}', 'set volume to {level}', 'volume up', 'volume down'],
    description: 'Adjust volume',
    category: 'media',
    icon: '🔊',
    handler: (params) => console.log('Set volume:', params?.level),
  },
];

// System Commands
export const systemCommands: VoiceCommand[] = [
  {
    id: 'sys-help',
    name: 'Help',
    phrases: ['help', 'show help', 'what can you do'],
    description: 'Show help',
    category: 'system',
    icon: '❓',
    handler: () => console.log('Show help'),
  },
  {
    id: 'sys-settings',
    name: 'Settings',
    phrases: ['settings', 'preferences', 'options'],
    description: 'Open settings',
    category: 'system',
    icon: '⚙️',
    handler: () => console.log('Open settings'),
  },
  {
    id: 'sys-logout',
    name: 'Logout',
    phrases: ['logout', 'sign out', 'log me out'],
    description: 'Logout user',
    category: 'system',
    icon: '🚪',
    handler: () => console.log('Logout'),
  },
];

// Productivity Commands
export const productivityCommands: VoiceCommand[] = [
  {
    id: 'prod-note',
    name: 'Create Note',
    phrases: ['create note', 'new note', 'take a note'],
    description: 'Create a new note',
    category: 'productivity',
    icon: '📝',
    handler: () => console.log('Create note'),
  },
  {
    id: 'prod-reminder',
    name: 'Set Reminder',
    phrases: ['set reminder', 'remind me to {task}', 'reminder for {task}'],
    description: 'Set a reminder',
    category: 'productivity',
    icon: '⏰',
    handler: (params) => console.log('Set reminder:', params?.task),
  },
  {
    id: 'prod-timer',
    name: 'Set Timer',
    phrases: ['set timer', 'timer for {duration}', 'start timer'],
    description: 'Set a timer',
    category: 'productivity',
    icon: '⏲️',
    handler: (params) => console.log('Set timer:', params?.duration),
  },
];

// Communication Commands
export const communicationCommands: VoiceCommand[] = [
  {
    id: 'comm-call',
    name: 'Call',
    phrases: ['call {name}', 'phone {name}', 'dial {name}'],
    description: 'Make a call',
    category: 'communication',
    icon: '📞',
    handler: (params) => console.log('Call:', params?.name),
  },
  {
    id: 'comm-message',
    name: 'Send Message',
    phrases: ['send message', 'text {name}', 'message {name}'],
    description: 'Send a message',
    category: 'communication',
    icon: '💬',
    handler: (params) => console.log('Message:', params?.name),
  },
  {
    id: 'comm-email',
    name: 'Send Email',
    phrases: ['send email', 'email {name}', 'compose email'],
    description: 'Send an email',
    category: 'communication',
    icon: '📧',
    handler: (params) => console.log('Email:', params?.name),
  },
];

// All preset commands
export const allPresetCommands: VoiceCommand[] = [
  ...navigationCommands,
  ...mediaCommands,
  ...systemCommands,
  ...productivityCommands,
  ...communicationCommands,
];

// Command categories
export const commandCategories: CommandCategory[] = [
  {
    id: 'navigation',
    name: 'Navigation',
    icon: '🧭',
    commands: navigationCommands,
  },
  {
    id: 'media',
    name: 'Media',
    icon: '🎵',
    commands: mediaCommands,
  },
  {
    id: 'system',
    name: 'System',
    icon: '⚙️',
    commands: systemCommands,
  },
  {
    id: 'productivity',
    name: 'Productivity',
    icon: '📋',
    commands: productivityCommands,
  },
  {
    id: 'communication',
    name: 'Communication',
    icon: '📱',
    commands: communicationCommands,
  },
];
