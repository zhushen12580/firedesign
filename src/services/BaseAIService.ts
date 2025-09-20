// services/BaseAIService.ts - 基础AI服务抽象类

import { AIService, AIModelConfig, ImageGenerationRequest, ImageGenerationResponse } from '../types/ai';

/**
 * 基础AI服务抽象类
 */
abstract class BaseAIService implements AIService {
  protected config: AIModelConfig;

  constructor(config: AIModelConfig) {
    this.config = config;
  }

  /**
   * 生成图像
   * @param request 图像生成请求
   * @returns 图像生成响应
   */
  abstract generateImage(request: ImageGenerationRequest): Promise<ImageGenerationResponse>;

  /**
   * 获取模型信息
   * @returns 模型配置信息
   */
  getModelInfo(): AIModelConfig {
    return { ...this.config };
  }

  /**
   * 验证API密钥
   * @returns 是否有效
   */
  abstract validateApiKey(): Promise<boolean>;

  /**
   * 发送HTTP请求
   * @param url 请求URL
   * @param options 请求选项
   * @returns 响应数据
   */
  protected async httpRequest<T>(url: string, options: RequestInit): Promise<T> {
    const timeout = this.config.timeout || 30000;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP错误: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * 带重试机制的请求
   * @param request 请求函数
   * @param retries 重试次数
   * @returns 响应数据
   */
  protected async requestWithRetry<T>(request: () => Promise<T>, retries: number = 3): Promise<T> {
    const maxRetries = this.config.maxRetries || retries;

    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await request();
      } catch (error) {
        if (i === maxRetries) {
          throw error;
        }

        // 指数退避延迟
        const delay = Math.pow(2, i) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw new Error('请求重试失败');
  }
}

export default BaseAIService;