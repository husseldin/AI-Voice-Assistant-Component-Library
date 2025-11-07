import { FunctionDefinition, FunctionHandler, FunctionRegistry, FunctionCall, FunctionResult } from './types';

/**
 * Function Registry for AI Function Calling
 * Manages and executes functions that AI can call
 */
export class AIFunctionRegistry {
  private functions: FunctionRegistry = {};

  registerFunction(name: string, definition: FunctionDefinition, handler: FunctionHandler) {
    this.functions[name] = { definition, handler };
  }

  unregisterFunction(name: string) {
    delete this.functions[name];
  }

  getFunction(name: string) {
    return this.functions[name];
  }

  getAllFunctions(): FunctionDefinition[] {
    return Object.values(this.functions).map(f => f.definition);
  }

  async executeFunction(functionCall: FunctionCall): Promise<FunctionResult> {
    const func = this.functions[functionCall.name];

    if (!func) {
      return {
        name: functionCall.name,
        result: null,
        error: `Function '${functionCall.name}' not found`,
      };
    }

    try {
      const args = typeof functionCall.arguments === 'string'
        ? JSON.parse(functionCall.arguments)
        : functionCall.arguments;

      const result = await func.handler(args);

      return {
        name: functionCall.name,
        result,
      };
    } catch (error) {
      return {
        name: functionCall.name,
        result: null,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async executeFunctions(functionCalls: FunctionCall[]): Promise<FunctionResult[]> {
    return Promise.all(functionCalls.map(call => this.executeFunction(call)));
  }
}
