// services/DoubaoAIService.ts - Doubao-Seedream-4.0 AI服务实现

import BaseAIService from './BaseAIService';
import { AIModelConfig, ImageGenerationRequest, ImageGenerationResponse } from '../types/ai';

/**
 * Doubao-Seedream-4.0 AI服务实现
 */
class DoubaoAIService extends BaseAIService {
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
        prompt: request.prompt,
        image_url: request.imageUrl,
        width: request.options?.width || 512,
        height: request.options?.height || 512,
        quality: request.options?.quality || 0.8,
        style: request.options?.style || 'default'
      };

      try {
        const response = await this.httpRequest<{
          success: boolean;
          data?: {
            image_url: string;
            job_id: string;
          };
          error?: string;
        }>(this.config.apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.apiKey}`
          },
          body: JSON.stringify(payload)
        });

        if (response.success && response.data) {
          return {
            success: true,
            imageUrl: response.data.image_url,
            jobId: response.data.job_id,
            status: 'completed'
          };
        } else {
          return {
            success: false,
            error: response.error || '图像生成失败'
          };
        }
      } catch (error) {
        throw new Error(`Doubao API请求失败: ${error instanceof Error ? error.message : '未知错误'}`);
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
      await this.httpRequest(this.config.apiUrl.replace('/generate', '/ping'), {
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

export default DoubaoAIService;