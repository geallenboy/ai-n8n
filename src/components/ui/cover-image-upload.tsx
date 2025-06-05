'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  Image as ImageIcon, 
  X, 
  Check, 
  AlertCircle,
  Loader2,
  FileImage,
  Link as LinkIcon,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import { uploadImageFile, uploadImageFromUrl, validateImageFile, validateImageUrl, fileToDataUrl, compressImage, type ImageUploadResult } from '@/lib/image-upload';

interface CoverImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  description?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export default function CoverImageUpload({
  value = '',
  onChange,
  label = '封面图片',
  description = '上传封面图片或输入图片URL',
  placeholder = '请输入图片URL或上传图片',
  disabled = false,
  className = ''
}: CoverImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(value);
  const [urlInput, setUrlInput] = useState(value);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  // 处理文件选择
  const handleFileSelect = useCallback(async (file: File) => {
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setError(validation.error || '文件验证失败');
      return;
    }

    setSelectedFile(file);
    setError('');
    
    try {
      const dataUrl = await fileToDataUrl(file);
      setPreviewUrl(dataUrl);
    } catch (err) {
      setError('文件预览生成失败');
    }
  }, []);

  // 处理文件上传
  const handleFileUpload = useCallback(async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);
    setError('');

    try {
      // 模拟进度
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + Math.random() * 30, 90));
      }, 200);

      let fileToUpload = selectedFile;
      
      // 如果文件过大，尝试压缩
      if (selectedFile.size > 2 * 1024 * 1024) { // 2MB
        try {
          fileToUpload = await compressImage(selectedFile);
          toast.info('图片已自动压缩');
        } catch (compressionError) {
          console.warn('图片压缩失败:', compressionError);
        }
      }

      const result = await uploadImageFile(fileToUpload);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result.success && result.data) {
        const imageUrl = result.data.url;
        setPreviewUrl(imageUrl);
        setUrlInput(imageUrl);
        onChange(imageUrl);
        toast.success('封面图片上传成功！');
        setSelectedFile(null);
      } else {
        throw new Error(result.error || '上传失败');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '上传失败，请重试';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  }, [selectedFile, onChange]);

  // 处理URL上传
  const handleUrlUpload = useCallback(async () => {
    if (!urlInput.trim()) {
      setError('请输入图片URL');
      return;
    }

    const validation = validateImageUrl(urlInput);
    if (!validation.isValid) {
      setError(validation.error || 'URL验证失败');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const result = await uploadImageFromUrl(urlInput);
      
      if (result.success && result.data) {
        const imageUrl = result.data.url;
        setPreviewUrl(imageUrl);
        setUrlInput(imageUrl);
        onChange(imageUrl);
        toast.success('图片导入成功！');
      } else {
        throw new Error(result.error || '导入失败');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '导入失败，请重试';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  }, [urlInput, onChange]);

  // 拖拽处理
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleFileSelect(imageFile);
    } else {
      setError('请拖拽图片文件');
    }
  }, [handleFileSelect]);

  // 文件输入处理
  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  // 清除图片
  const handleClear = useCallback(() => {
    setSelectedFile(null);
    setPreviewUrl('');
    setUrlInput('');
    setError('');
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onChange]);

  // 直接使用URL
  const handleUseUrl = useCallback(() => {
    if (!urlInput.trim()) {
      setError('请输入图片URL');
      return;
    }

    const validation = validateImageUrl(urlInput);
    if (!validation.isValid) {
      setError(validation.error || 'URL格式无效');
      return;
    }

    setPreviewUrl(urlInput);
    onChange(urlInput);
    setError('');
    toast.success('图片URL已设置');
  }, [urlInput, onChange]);

  return (
    <div className={`space-y-4 ${className}`}>
      {label && (
        <div>
          <Label className="text-base font-medium">{label}</Label>
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {description}
            </p>
          )}
        </div>
      )}

      {/* URL输入 */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <Input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder={placeholder}
            disabled={disabled || isUploading}
            className="flex-1"
          />
          <Button
            variant="outline"
            onClick={handleUseUrl}
            disabled={disabled || isUploading || !urlInput.trim()}
          >
            <LinkIcon className="h-4 w-4 mr-2" />
            使用URL
          </Button>
          <Button
            variant="outline"
            onClick={handleUrlUpload}
            disabled={disabled || isUploading || !urlInput.trim()}
          >
            <Upload className="h-4 w-4 mr-2" />
            上传到CDN
          </Button>
        </div>
      </div>

      {/* 或者分隔线 */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
        <span className="text-sm text-gray-500 dark:text-gray-400">或者</span>
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
      </div>

      {/* 拖拽上传区域 */}
      <Card className="border-2 border-dashed">
        <CardContent className="p-6">
          <div
            ref={dragRef}
            className={`transition-colors rounded-lg ${
              isDragging 
                ? 'bg-blue-50 dark:bg-blue-950 border-blue-500' 
                : 'hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {previewUrl ? (
              <div className="space-y-4">
                <div className="text-center">
                  <img 
                    src={previewUrl} 
                    alt="封面预览" 
                    className="max-w-full max-h-48 mx-auto rounded-lg border shadow-sm object-cover"
                    onError={() => {
                      setError('图片加载失败');
                      setPreviewUrl('');
                    }}
                  />
                </div>
                <div className="flex justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClear}
                    disabled={disabled}
                  >
                    <X className="h-4 w-4 mr-2" />
                    清除
                  </Button>
                  {previewUrl.startsWith('http') && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(previewUrl, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      查看
                    </Button>
                  )}
                </div>
              </div>
            ) : selectedFile ? (
              <div className="space-y-4 text-center">
                <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
                  <Check className="h-5 w-5" />
                  <span className="font-medium">文件已选择</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <FileImage className="h-4 w-4" />
                  <span>{selectedFile.name}</span>
                  <Badge variant="secondary">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </Badge>
                </div>
                {isUploading && (
                  <div className="space-y-2">
                    <Progress value={uploadProgress} className="w-full" />
                    <p className="text-sm text-gray-500">上传中... {Math.round(uploadProgress)}%</p>
                  </div>
                )}
                <div className="flex justify-center gap-2">
                  <Button
                    onClick={handleFileUpload}
                    disabled={isUploading || disabled}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        上传中...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        上传到CDN
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedFile(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                    disabled={isUploading}
                  >
                    <X className="h-4 w-4 mr-2" />
                    取消
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-center py-8">
                <Upload className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto" />
                <div>
                  <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    拖拽图片到此处
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    或者点击选择文件
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading || disabled}
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  选择图片
                </Button>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  支持 JPEG, PNG, GIF, WebP, BMP 格式，最大 10MB
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* 错误提示 */}
      {error && (
        <div className="flex items-start gap-2 p-3 text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium">错误</p>
            <p>{error}</p>
          </div>
        </div>
      )}
    </div>
  );
} 