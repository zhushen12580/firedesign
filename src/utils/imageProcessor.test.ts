// utils/imageProcessor.test.ts - 图像处理器测试

import { ImageProcessor } from './imageProcessor';

// Mock HTMLImageElement
class MockImage {
  width = 0;
  height = 0;
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  src = '';

  constructor() {
    // 模拟图像加载完成
    setTimeout(() => {
      if (this.onload) {
        this.onload();
      }
    }, 0);
  }
}

// Mock global Image
global.Image = MockImage as any;

describe('ImageProcessor', () => {
  describe('validateImageFile', () => {
    it('should validate a valid image file', () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
      const result = ImageProcessor.validateImageFile(file);

      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject file that is too large', () => {
      // 创建一个大于10MB的文件
      const largeFile = new File([new ArrayBuffer(15 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' });
      const result = ImageProcessor.validateImageFile(largeFile);

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('文件大小超过限制');
    });

    it('should reject unsupported file format', () => {
      const file = new File([''], 'test.txt', { type: 'text/plain' });
      const result = ImageProcessor.validateImageFile(file);

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('不支持的文件格式');
    });
  });

  describe('calculateResizedDimensions', () => {
    // 由于calculateResizedDimensions是私有方法，我们通过直接测试其实现逻辑来验证
    it('should not resize image that is smaller than max dimensions', () => {
      const img = { width: 100, height: 100 } as HTMLImageElement;
      const result = (ImageProcessor as any).calculateResizedDimensions(img, 200, 200);

      expect(result.width).toBe(100);
      expect(result.height).toBe(100);
    });

    it('should resize image that is wider than max width', () => {
      const img = { width: 300, height: 150 } as HTMLImageElement;
      const result = (ImageProcessor as any).calculateResizedDimensions(img, 200, 200);

      expect(result.width).toBe(200);
      expect(result.height).toBe(100);
    });

    it('should resize image that is taller than max height', () => {
      const img = { width: 150, height: 300 } as HTMLImageElement;
      const result = (ImageProcessor as any).calculateResizedDimensions(img, 200, 200);

      expect(result.width).toBe(100);
      expect(result.height).toBe(200);
    });

    it('should resize image that is larger than both max dimensions', () => {
      const img = { width: 400, height: 300 } as HTMLImageElement;
      const result = (ImageProcessor as any).calculateResizedDimensions(img, 200, 200);

      expect(result.width).toBe(200);
      expect(result.height).toBe(150);
    });
  });
});