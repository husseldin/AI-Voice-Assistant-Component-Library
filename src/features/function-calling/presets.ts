import { FunctionDefinition } from './types';

/**
 * Preset Function Definitions for common use cases
 */

export const weatherFunction: FunctionDefinition = {
  name: 'get_weather',
  description: 'Get the current weather for a location',
  parameters: {
    type: 'object',
    properties: {
      location: {
        type: 'string',
        description: 'The city and state, e.g. San Francisco, CA',
      },
      unit: {
        type: 'string',
        enum: ['celsius', 'fahrenheit'],
        description: 'The temperature unit',
      },
    },
    required: ['location'],
  },
};

export const calculatorFunction: FunctionDefinition = {
  name: 'calculate',
  description: 'Perform mathematical calculations',
  parameters: {
    type: 'object',
    properties: {
      expression: {
        type: 'string',
        description: 'Mathematical expression to evaluate, e.g. "2 + 2"',
      },
    },
    required: ['expression'],
  },
};

export const searchFunction: FunctionDefinition = {
  name: 'search',
  description: 'Search for information on the web',
  parameters: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'Search query',
      },
      max_results: {
        type: 'string',
        description: 'Maximum number of results to return',
      },
    },
    required: ['query'],
  },
};

export const reminderFunction: FunctionDefinition = {
  name: 'set_reminder',
  description: 'Set a reminder for a specific time',
  parameters: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        description: 'Reminder message',
      },
      time: {
        type: 'string',
        description: 'When to remind (e.g., "in 5 minutes", "tomorrow at 3pm")',
      },
    },
    required: ['message', 'time'],
  },
};

export const emailFunction: FunctionDefinition = {
  name: 'send_email',
  description: 'Send an email',
  parameters: {
    type: 'object',
    properties: {
      to: {
        type: 'string',
        description: 'Recipient email address',
      },
      subject: {
        type: 'string',
        description: 'Email subject',
      },
      body: {
        type: 'string',
        description: 'Email body',
      },
    },
    required: ['to', 'subject', 'body'],
  },
};

export const calendarFunction: FunctionDefinition = {
  name: 'create_event',
  description: 'Create a calendar event',
  parameters: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        description: 'Event title',
      },
      start_time: {
        type: 'string',
        description: 'Start time',
      },
      end_time: {
        type: 'string',
        description: 'End time',
      },
      description: {
        type: 'string',
        description: 'Event description',
      },
    },
    required: ['title', 'start_time'],
  },
};

export const presetFunctions: FunctionDefinition[] = [
  weatherFunction,
  calculatorFunction,
  searchFunction,
  reminderFunction,
  emailFunction,
  calendarFunction,
];
