// types/index.ts - 应用程序类型定义

export interface Template {
  id: number;
  name: string;
  description: string;
}

export interface GeneratedImage {
  id: string;
  url: string;
  templateId: number;
  createdAt: Date;
}

export interface AIModel {
  id: string;
  name: string;
  description: string;
}