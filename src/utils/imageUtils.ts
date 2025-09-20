// utils/imageUtils.ts - 图像处理工具函数

/**
 * 将文件转换为Base64编码
 * @param file 要转换的文件
 * @returns Promise<string> Base64编码的字符串
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

/**
 * 从Base64字符串创建图像对象
 * @param base64 Base64编码的图像字符串
 * @returns Promise<HTMLImageElement> 图像对象
 */
export function base64ToImage(base64: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = base64;
  });
}

/**
 * 调整图像尺寸
 * @param image 原始图像
 * @param maxWidth 最大宽度
 * @param maxHeight 最大高度
 * @returns 调整后的尺寸
 */
export function resizeImageDimensions(
  image: HTMLImageElement,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  let width = image.width;
  let height = image.height;

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