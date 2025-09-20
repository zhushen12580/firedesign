// components/TemplateSelector.ts - 模板选择器组件

interface Template {
  id: number;
  name: string;
  description: string;
}

class TemplateSelector {
  private templates: Template[] = [];
  private selectedTemplateId: number | null = null;
  private container: HTMLElement;
  private onSelectCallback: ((templateId: number) => void) | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  /**
   * 设置模板数据
   * @param templates 模板数组
   */
  setTemplates(templates: Template[]): void {
    this.templates = templates;
    this.render();
  }

  /**
   * 设置选中回调函数
   * @param callback 回调函数
   */
  onSelect(callback: (templateId: number) => void): void {
    this.onSelectCallback = callback;
  }

  /**
   * 渲染模板选择器
   */
  private render(): void {
    this.container.innerHTML = '';

    this.templates.forEach(template => {
      const templateElement = document.createElement('div');
      templateElement.className = 'template-item';
      templateElement.innerHTML = `
        <h3>${template.name}</h3>
        <p>${template.description}</p>
      `;

      // 添加点击事件
      templateElement.addEventListener('click', () => {
        this.selectTemplate(template.id);
      });

      this.container.appendChild(templateElement);
    });
  }

  /**
   * 选中模板
   * @param templateId 模板ID
   */
  private selectTemplate(templateId: number): void {
    this.selectedTemplateId = templateId;

    // 更新UI选中状态
    const templateElements = this.container.querySelectorAll('.template-item');
    templateElements.forEach(element => {
      element.classList.remove('selected');
    });

    const selectedElement = this.container.querySelector(
      `.template-item:nth-child(${this.templates.findIndex(t => t.id === templateId) + 1})`
    );
    if (selectedElement) {
      selectedElement.classList.add('selected');
    }

    // 调用回调函数
    if (this.onSelectCallback) {
      this.onSelectCallback(templateId);
    }
  }

  /**
   * 获取选中的模板ID
   * @returns 选中的模板ID或null
   */
  getSelectedTemplateId(): number | null {
    return this.selectedTemplateId;
  }
}

export default TemplateSelector;