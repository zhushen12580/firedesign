// services/DeepSeekAIService.ts - DeepSeek AI服务实现

import BaseAIService from './BaseAIService';
import { AIModelConfig, ImageGenerationRequest, ImageGenerationResponse } from '../types/ai';

/**
 * DeepSeek AI服务实现
 */
class DeepSeekAIService extends BaseAIService {
  constructor(config: AIModelConfig) {
    super(config);
  }

  /**
   * 生成图像
   * @param request 图像生成请求
   * @returns 图像生成响应
   */
  async generateImage(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
    return this.requestWithRetry(async () => {
      const payload = {
        model: 'deepseek-image',
        prompt: request.prompt,
        image_url: request.imageUrl,
        size: `${request.options?.width || 512}x${request.options?.height || 512}`,
        quality: request.options?.quality || 'standard',
        style: request.options?.style || 'vivid'
      };

      try {
        const response = await this.httpRequest<{
          data?: {
            url: string;
            revised_prompt?: string;
          }[];
          error?: {
            message: string;
            code: string;
          };
        }>(this.config.apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.apiKey}`
          },
          body: JSON.stringify(payload)
        });

        if (response.data && response.data.length > 0) {
          return {
            success: true,
            imageUrl: response.data[0].url,
            status: 'completed'
          };
        } else if (response.error) {
          return {
            success: false,
            error: response.error.message
          };
        } else {
          return {
            success: false,
            error: '图像生成失败：无返回数据'
          };
        }
      } catch (error) {
        throw new Error(`DeepSeek API请求失败: ${error instanceof Error ? error.message : '未知错误'}`);
      }
    });
  }

  /**
   * 验证API密钥
   * @returns 是否有效
   */
  async validateApiKey(): Promise<boolean> {
    try {
      // 发送一个简单的验证请求
      await this.httpRequest(this.config.apiUrl.replace('/images/generations', '/models'), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`
        }
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default DeepSeekAIService;