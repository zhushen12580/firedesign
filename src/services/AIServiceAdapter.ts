// services/AIServiceAdapter.ts - AI服务适配器

import AIManager from './AIManager';
import DoubaoAIService from './DoubaoAIService';
import NanoBananaAIService from './NanoBananaAIService';
import DeepSeekAIService from './DeepSeekAIService';
import { AIModelConfig, AIModelType } from '../types/ai';

/**
 * AI服务适配器
 */
class AIServiceAdapter {
  private aiManager: AIManager;

  constructor() {
    this.aiManager = new AIManager();
    this.initializeServices();
  }

  /**
   * 初始化所有AI服务
   */
  private initializeServices(): void {
    // 从环境变量或配置文件中获取API密钥
    const configs: AIModelConfig[] = [
      {
        type: 'doubao',
        name: 'Doubao-Seedream-4.0',
        apiKey: import.meta.env?.VITE_DOUBAO_API_KEY || '',
        apiUrl: 'https://api.doubao.com/v1/images/generate',
        enabled: true,
        maxRetries: 3,
        timeout: 30000
      },
      {
        type: 'nano',
        name: 'Nano Banana',
        apiKey: import.meta.env?.VITE_NANO_API_KEY || '',
        apiUrl: 'https://api.nanobanana.com/v1/generate',
        enabled: true,
        maxRetries: 3,
        timeout: 30000
      },
      {
        type: 'deepseek',
        name: 'DeepSeek',
        apiKey: import.meta.env?.VITE_DEEPSEEK_API_KEY || '',
        apiUrl: 'https://api.deepseek.com/v1/images/generations',
        enabled: true,
        maxRetries: 3,
        timeout: 30000
      }
    ];

    // 注册启用的服务
    for (const config of configs) {
      if (config.enabled && config.apiKey) {
        this.registerService(config);
      }
    }
  }

  /**
   * 注册AI服务
   * @param config 模型配置
   */
  private registerService(config: AIModelConfig): void {
    switch (config.type) {
      case 'doubao':
        this.aiManager.registerService(config.type, new DoubaoAIService(config));
        break;
      case 'nano':
        this.aiManager.registerService(config.type, new NanoBananaAIService(config));
        break;
      case 'deepseek':
        this.aiManager.registerService(config.type, new DeepSeekAIService(config));
        break;
      default:
        throw new Error(`不支持的AI模型类型: ${config.type}`);
    }
  }

  /**
   * 获取AI管理器实例
   * @returns AI管理器实例
   */
  getAIManager(): AIManager {
    return this.aiManager;
  }

  /**
   * 获取可用模型列表
   * @returns 可用模型列表
   */
  getAvailableModels(): AIModelConfig[] {
    return this.aiManager.getAvailableModels();
  }

  /**
   * 验证所有API密钥
   * @returns 验证结果
   */
  async validateAllApiKeys(): Promise<Record<AIModelType, boolean>> {
    return this.aiManager.validateAllApiKeys();
  }
}

export default AIServiceAdapter;