// main.ts - 应用程序入口点
import TemplateSelector from './components/TemplateSelector';
import ImagePreview from './components/ImagePreview';
import { fileToBase64 } from './utils/imageUtils';
import { ImageProcessor } from './utils/imageProcessor';

// 获取DOM元素
const fileInput = document.getElementById('file-input') as HTMLInputElement;
const uploadArea = document.querySelector('.upload-area') as HTMLDivElement;
const templatesContainer = document.querySelector('.templates-container') as HTMLDivElement;
const imagePreviewContainer = document.querySelector('.image-preview') as HTMLDivElement;
const aiModelSelect = document.getElementById('ai-model') as HTMLSelectElement;
const optimizationText = document.getElementById('optimization-text') as HTMLTextAreaElement;
const generateBtn = document.getElementById('generate-btn') as HTMLButtonElement;
const exportBtn = document.getElementById('export-btn') as HTMLButtonElement;

// 创建组件实例
const templateSelector = new TemplateSelector(templatesContainer);
const imagePreview = new ImagePreview(imagePreviewContainer);

// 事件监听器
uploadArea?.addEventListener('click', () => {
  fileInput?.click();
});

fileInput?.addEventListener('change', handleFileSelect);

// 模拟模板数据
const templates = [
  { id: 1, name: '产品主图', description: '标准产品展示' },
  { id: 2, name: '生活方式', description: '场景化展示' },
  { id: 3, name: '细节特写', description: '产品细节展示' },
  { id: 4, name: '规格对比', description: '尺寸对比展示' },
  { id: 5, name: '促销横幅', description: '促销活动展示' },
];

// 初始化模板选择器
function initializeTemplateSelector() {
  templateSelector.setTemplates(templates);
  templateSelector.onSelect((templateId) => {
    console.log('选中的模板ID:', templateId);
  });
}

// 处理文件选择
async function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];

    // 显示加载状态
    imagePreview.showLoading();

    // 验证图像文件
    const validation = ImageProcessor.validateImageFile(file);
    if (!validation.isValid) {
      imagePreview.showError(validation.error || '文件验证失败');
      return;
    }

    try {
      // 处理图像
      const result = await ImageProcessor.processImage(file, {
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 0.8,
        format: 'jpeg'
      });

      // 显示预览图像
      imagePreview.showImage(result.dataUrl, {
        width: result.width,
        height: result.height,
        format: result.format,
        size: result.size
      });
    } catch (error) {
      console.error('图像处理失败:', error);
      imagePreview.showError('图像处理失败: ' + (error instanceof Error ? error.message : '未知错误'));
    }
  }
}

// 生成图像函数
async function generateImage() {
  // 获取选中的模板
  const selectedTemplateId = templateSelector.getSelectedTemplateId();
  if (!selectedTemplateId) {
    alert('请选择一个模板');
    return;
  }

  // 获取选中的AI模型
  const selectedModel = aiModelSelect?.value;

  // 获取优化文本
  const optimizationPrompt = optimizationText?.value;

  // 这里应该调用实际的AI API
  console.log('生成图像:', {
    templateId: selectedTemplateId,
    model: selectedModel,
    prompt: optimizationPrompt
  });

  // 显示生成中的状态
  generateBtn.textContent = '生成中...';
  generateBtn.disabled = true;

  // 模拟API调用
  setTimeout(() => {
    // 模拟生成结果
    imagePreview!.innerHTML = '<p>图像生成完成！</p>';
    generateBtn.textContent = '生成图像';
    generateBtn.disabled = false;
  }, 2000);
}

// 导出图像函数
function exportImage() {
  // 这里应该实现实际的导出功能
  console.log('导出图像');
  alert('图像导出功能将在后续实现');
}

// 事件监听器
generateBtn?.addEventListener('click', generateImage);
exportBtn?.addEventListener('click', exportImage);

// 初始化应用程序
document.addEventListener('DOMContentLoaded', () => {
  initializeTemplateSelector();
});

// 导出函数供其他模块使用
export { generateImage, exportImage };