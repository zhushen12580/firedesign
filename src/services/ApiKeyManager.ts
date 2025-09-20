// services/ApiKeyManager.ts - API密钥管理器

/**
 * API密钥管理器
 */
class ApiKeyManager {
  private static instance: ApiKeyManager;
  private keys: Map<string, string> = new Map();

  private constructor() {
    // 私有构造函数，确保单例模式
  }

  /**
   * 获取单例实例
   * @returns ApiKeyManager实例
   */
  static getInstance(): ApiKeyManager {
    if (!ApiKeyManager.instance) {
      ApiKeyManager.instance = new ApiKeyManager();
    }
    return ApiKeyManager.instance;
  }

  /**
   * 设置API密钥
   * @param service 服务名称
   * @param key API密钥
   */
  setApiKey(service: string, key: string): void {
    // 在实际应用中，这里应该加密存储密钥
    this.keys.set(service, key);
  }

  /**
   * 获取API密钥
   * @param service 服务名称
   * @returns API密钥
   */
  getApiKey(service: string): string | undefined {
    return this.keys.get(service);
  }

  /**
   * 删除API密钥
   * @param service 服务名称
   */
  removeApiKey(service: string): void {
    this.keys.delete(service);
  }

  /**
   * 检查是否存在API密钥
   * @param service 服务名称
   * @returns 是否存在
   */
  hasApiKey(service: string): boolean {
    return this.keys.has(service);
  }

  /**
   * 获取所有服务名称
   * @returns 服务名称列表
   */
  getServices(): string[] {
    return Array.from(this.keys.keys());
  }

  /**
   * 清空所有API密钥
   */
  clearAllKeys(): void {
    this.keys.clear();
  }

  /**
   * 从环境变量加载API密钥
   */
  loadFromEnvironment(): void {
    const envKeys = [
      { service: 'doubao', envVar: 'VITE_DOUBAO_API_KEY' },
      { service: 'nano', envVar: 'VITE_NANO_API_KEY' },
      { service: 'deepseek', envVar: 'VITE_DEEPSEEK_API_KEY' }
    ];

    for (const { service, envVar } of envKeys) {
      const key = import.meta.env?.[envVar];
      if (key) {
        this.setApiKey(service, key);
      }
    }
  }
}

export default ApiKeyManager;