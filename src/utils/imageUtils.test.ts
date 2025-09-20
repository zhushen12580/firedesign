// utils/imageUtils.test.ts - 图像处理工具函数测试

import { resizeImageDimensions } from './imageUtils';

describe('imageUtils', () => {
  describe('resizeImageDimensions', () => {
    it('should not resize image that is smaller than max dimensions', () => {
      const image = { width: 100, height: 100 } as HTMLImageElement;
      const result = resizeImageDimensions(image, 200, 200);

      expect(result.width).toBe(100);
      expect(result.height).toBe(100);
    });

    it('should resize image that is wider than max width', () => {
      const image = { width: 300, height: 150 } as HTMLImageElement;
      const result = resizeImageDimensions(image, 200, 200);

      expect(result.width).toBe(200);
      expect(result.height).toBe(100);
    });

    it('should resize image that is taller than max height', () => {
      const image = { width: 150, height: 300 } as HTMLImageElement;
      const result = resizeImageDimensions(image, 200, 200);

      expect(result.width).toBe(100);
      expect(result.height).toBe(200);
    });

    it('should resize image that is larger than both max dimensions', () => {
      const image = { width: 400, height: 300 } as HTMLImageElement;
      const result = resizeImageDimensions(image, 200, 200);

      expect(result.width).toBe(200);
      expect(result.height).toBe(150);
    });
  });
});