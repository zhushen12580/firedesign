// components/ImagePreview.ts - 图像预览组件

interface ImageInfo {
  width: number;
  height: number;
  format: string;
  size: number;
}

class ImagePreview {
  private container: HTMLElement;
  private imageInfo: ImageInfo | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
    this.setupContainer();
  }

  /**
   * 设置容器样式
   */
  private setupContainer(): void {
    this.container.classList.add('image-preview-container');
  }

  /**
   * 显示图像
   * @param dataUrl 图像数据URL
   * @param info 图像信息
   */
  showImage(dataUrl: string, info: ImageInfo): void {
    this.imageInfo = info;

    this.container.innerHTML = `
      <div class="image-preview-wrapper">
        <img src="${dataUrl}" alt="预览图像" class="preview-image">
        ${this.renderImageInfo()}
      </div>
    `;

    this.setupImageEvents();
  }

  /**
   * 渲染图像信息
   * @returns 图像信息HTML
   */
  private renderImageInfo(): string {
    if (!this.imageInfo) return '';

    return `
      <div class="image-info-overlay">
        <div class="image-info-content">
          <p><strong>尺寸:</strong> ${this.imageInfo.width} × ${this.imageInfo.height}</p>
          <p><strong>大小:</strong> ${(this.imageInfo.size / 1024).toFixed(1)} KB</p>
          <p><strong>格式:</strong> ${this.imageInfo.format.toUpperCase()}</p>
        </div>
      </div>
    `;
  }

  /**
   * 设置图像事件
   */
  private setupImageEvents(): void {
    const img = this.container.querySelector('.preview-image');
    if (img) {
      // 图像加载完成后调整容器大小
      img.addEventListener('load', () => {
        this.adjustContainerSize(img as HTMLImageElement);
      });

      // 图像点击放大功能
      img.addEventListener('click', () => {
        this.toggleFullscreen(img as HTMLImageElement);
      });
    }
  }

  /**
   * 调整容器大小
   * @param img 图像元素
   */
  private adjustContainerSize(img: HTMLImageElement): void {
    // 可以根据需要实现自适应大小逻辑
  }

  /**
   * 切换全屏显示
   * @param img 图像元素
   */
  private toggleFullscreen(img: HTMLImageElement): void {
    if (img.classList.contains('fullscreen')) {
      img.classList.remove('fullscreen');
      document.body.classList.remove('image-fullscreen-mode');
    } else {
      img.classList.add('fullscreen');
      document.body.classList.add('image-fullscreen-mode');
    }
  }

  /**
   * 清除预览
   */
  clear(): void {
    this.container.innerHTML = '<div class="image-preview-placeholder">暂无图像</div>';
    this.imageInfo = null;
  }

  /**
   * 显示加载状态
   */
  showLoading(): void {
    this.container.innerHTML = '<div class="image-preview-loading">图像处理中...</div>';
  }

  /**
   * 显示错误信息
   * @param error 错误信息
   */
  showError(error: string): void {
    this.container.innerHTML = `<div class="image-preview-error">错误: ${error}</div>`;
  }
}

export default ImagePreview;