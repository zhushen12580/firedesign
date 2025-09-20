// types/ai.ts - AI服务相关类型定义

/**
 * AI模型类型
 */
export type AIModelType = 'doubao' | 'nano' | 'deepseek';

/**
 * AI模型配置
 */
export interface AIModelConfig {
  type: AIModelType;
  name: string;
  apiKey: string;
  apiUrl: string;
  enabled: boolean;
  maxRetries?: number;
  timeout?: number;
}

/**
 * 图像生成请求
 */
export interface ImageGenerationRequest {
  prompt: string;
  imageUrl?: string;
  model: AIModelType;
  options?: {
    width?: number;
    height?: number;
    quality?: number;
    style?: string;
    [key: string]: any;
  };
}

/**
 * 图像生成响应
 */
export interface ImageGenerationResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
  jobId?: string;
  status?: 'pending' | 'processing' | 'completed' | 'failed';
}

/**
 * AI服务接口
 */
export interface AIService {
  /**
   * 生成图像
   * @param request 图像生成请求
   * @returns 图像生成响应
   */
  generateImage(request: ImageGenerationRequest): Promise<ImageGenerationResponse>;

  /**
   * 获取模型信息
   * @returns 模型配置信息
   */
  getModelInfo(): AIModelConfig;

  /**
   * 验证API密钥
   * @returns 是否有效
   */
  validateApiKey(): Promise<boolean>;
}