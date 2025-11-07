export interface FunctionDefinition {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, {
      type: string;
      description?: string;
      enum?: string[];
    }>;
    required?: string[];
  };
}

export interface FunctionCall {
  name: string;
  arguments: string | Record<string, any>;
}

export interface FunctionResult {
  name: string;
  result: any;
  error?: string;
}

export interface FunctionHandler {
  (args: Record<string, any>): Promise<any> | any;
}

export interface FunctionRegistry {
  [key: string]: {
    definition: FunctionDefinition;
    handler: FunctionHandler;
  };
}
