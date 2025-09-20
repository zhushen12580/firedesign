// services/AIManager.ts - AI服务管理器

import { AIModelType, AIModelConfig, AIService, ImageGenerationRequest, ImageGenerationResponse } from '../types/ai';

/**
 * AI服务管理器
 */
class AIManager {
  private services: Map<AIModelType, AIService> = new Map();
  private activeModel: AIModelType = 'doubao';

  /**
   * 注册AI服务
   * @param model 模型类型
   * @param service AI服务实例
   */
  registerService(model: AIModelType, service: AIService): void {
    this.services.set(model, service);
  }

  /**
   * 获取AI服务
   * @param model 模型类型
   * @returns AI服务实例
   */
  getService(model: AIModelType): AIService | undefined {
    return this.services.get(model);
  }

  /**
   * 设置活动模型
   * @param model 模型类型
   */
  setActiveModel(model: AIModelType): void {
    if (this.services.has(model)) {
      this.activeModel = model;
    } else {
      throw new Error(`AI服务未注册: ${model}`);
    }
  }

  /**
   * 获取活动模型
   * @returns 活动模型类型
   */
  getActiveModel(): AIModelType {
    return this.activeModel;
  }

  /**
   * 生成图像
   * @param request 图像生成请求
   * @returns 图像生成响应
   */
  async generateImage(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
    const model = request.model || this.activeModel;
    const service = this.services.get(model);

    if (!service) {
      return {
        success: false,
        error: `AI服务未注册: ${model}`
      };
    }

    try {
      return await service.generateImage(request);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      };
    }
  }

  /**
   * 获取所有可用模型
   * @returns 可用模型列表
   */
  getAvailableModels(): AIModelConfig[] {
    const models: AIModelConfig[] = [];
    for (const [type, service] of this.services) {
      models.push(service.getModelInfo());
    }
    return models;
  }

  /**
   * 验证所有API密钥
   * @returns 验证结果
   */
  async validateAllApiKeys(): Promise<Record<AIModelType, boolean>> {
    const results: Record<AIModelType, boolean> = {} as Record<AIModelType, boolean>;

    for (const [type, service] of this.services) {
      try {
        results[type] = await service.validateApiKey();
      } catch (error) {
        results[type] = false;
      }
    }

    return results;
  }
}

export default AIManager;