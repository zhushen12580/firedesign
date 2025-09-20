// utils/imageProcessor.ts - 图像处理工具类

/**
 * 图像文件验证结果
 */
export interface ImageValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * 图像处理选项
 */
export interface ImageProcessOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
  crop?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  rotation?: number; // 旋转角度（度）
}

/**
 * 图像处理结果
 */
export interface ImageProcessResult {
  dataUrl: string;
  width: number;
  height: number;
  format: string;
  size: number;
}

/**
 * 图像处理器类
 */
export class ImageProcessor {
  private static readonly SUPPORTED_FORMATS = ['image/jpeg', 'image/png', 'image/webp'];
  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  /**
   * 验证图像文件
   * @param file 要验证的文件
   * @returns 验证结果
   */
  static validateImageFile(file: File): ImageValidationResult {
    // 检查文件大小
    if (file.size > this.MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: `文件大小超过限制 (${(this.MAX_FILE_SIZE / 1024 / 1024).toFixed(1)}MB)`
      };
    }

    // 检查文件类型
    if (!this.SUPPORTED_FORMATS.includes(file.type)) {
      return {
        isValid: false,
        error: '不支持的文件格式，请上传 JPG、PNG 或 WebP 格式的图像'
      };
    }

    return { isValid: true };
  }

  /**
   * 处理图像文件
   * @param file 要处理的图像文件
   * @param options 处理选项
   * @returns 处理结果
   */
  static async processImage(file: File, options: ImageProcessOptions = {}): Promise<ImageProcessResult> {
    // 验证文件
    const validation = this.validateImageFile(file);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    // 创建图像对象
    const img = await this.loadImageFromFile(file);

    // 应用旋转
    let rotatedImg = img;
    if (options.rotation && options.rotation !== 0) {
      rotatedImg = await this.rotateImage(img, options.rotation);
    }

    // 计算调整后的尺寸
    const { width, height } = this.calculateResizedDimensions(
      rotatedImg,
      options.maxWidth || 1920,
      options.maxHeight || 1080
    );

    // 创建画布
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('无法创建Canvas上下文');
    }

    // 应用裁剪
    if (options.crop) {
      canvas.width = options.crop.width;
      canvas.height = options.crop.height;
      ctx.drawImage(
        rotatedImg,
        options.crop.x,
        options.crop.y,
        options.crop.width,
        options.crop.height,
        0,
        0,
        options.crop.width,
        options.crop.height
      );
    } else {
      // 调整图像尺寸
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(rotatedImg, 0, 0, width, height);
    }

    // 导出为指定格式
    const format = options.format || 'jpeg';
    const quality = options.quality || 0.8;
    const mimeType = `image/${format}`;

    const dataUrl = canvas.toDataURL(mimeType, quality);
    const size = this.getDataUrlSize(dataUrl);

    return {
      dataUrl,
      width: canvas.width,
      height: canvas.height,
      format,
      size
    };
  }

  /**
   * 从文件加载图像
   * @param file 图像文件
   * @returns 图像对象
   */
  private static loadImageFromFile(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * 旋转图像
   * @param img 原始图像
   * @param angle 旋转角度（度）
   * @returns 旋转后的图像
   */
  private static async rotateImage(img: HTMLImageElement, angle: number): Promise<HTMLImageElement> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('无法创建Canvas上下文');
    }

    // 将角度转换为弧度
    const rad = (angle * Math.PI) / 180;

    // 计算旋转后的画布尺寸
    const sin = Math.abs(Math.sin(rad));
    const cos = Math.abs(Math.cos(rad));
    const newWidth = img.width * cos + img.height * sin;
    const newHeight = img.width * sin + img.height * cos;

    canvas.width = newWidth;
    canvas.height = newHeight;

    // 移动到画布中心并旋转
    ctx.translate(newWidth / 2, newHeight / 2);
    ctx.rotate(rad);

    // 绘制图像
    ctx.drawImage(img, -img.width / 2, -img.height / 2);

    // 创建新的图像对象
    return new Promise((resolve, reject) => {
      const rotatedImg = new Image();
      rotatedImg.onload = () => resolve(rotatedImg);
      rotatedImg.onerror = reject;
      rotatedImg.src = canvas.toDataURL('image/png');
    });
  }

  /**
   * 计算调整后的图像尺寸
   * @param img 图像对象
   * @param maxWidth 最大宽度
   * @param maxHeight 最大高度
   * @returns 调整后的尺寸
   */
  private static calculateResizedDimensions(
    img: HTMLImageElement,
    maxWidth: number,
    maxHeight: number
  ): { width: number; height: number } {
    let width = img.width;
    let height = img.height;

    // 检查是否需要调整尺寸
    if (width > maxWidth) {
      height = (height * maxWidth) / width;
      width = maxWidth;
    }

    if (height > maxHeight) {
      width = (width * maxHeight) / height;
      height = maxHeight;
    }

    return { width, height };
  }

  /**
   * 获取Data URL的大小
   * @param dataUrl Data URL
   * @returns 字节大小
   */
  private static getDataUrlSize(dataUrl: string): number {
    // 移除Data URL前缀
    const base64 = dataUrl.split(',')[1];

    // 计算Base64解码后的大小
    const padding = (base64.match(/=/g) || []).length;
    return (base64.length * 3) / 4 - padding;
  }
}