'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';

interface N8nWorkflowPreviewSimpleProps {
  workflowJson?: any;
  height?: string | number;
  width?: string | number;
  title?: string;
  description?: string;
  showCard?: boolean;
  className?: string;
}

export function N8nWorkflowPreview({
  workflowJson,
  height = 500,
  width = '100%',
  title,
  description,
  showCard = true,
  className = ''
}: N8nWorkflowPreviewSimpleProps) {
  const [isClient, setIsClient] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState('');
  const [encodedWorkflow, setEncodedWorkflow] = useState('');

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (workflowJson && isClient) {
      try {
        // 提取核心工作流结构
        const coreWorkflow = {
          nodes: workflowJson.nodes || [],
          connections: workflowJson.connections || {}
        };
        
        // 使用 URL 编码
        const encoded = encodeURIComponent(JSON.stringify(coreWorkflow));
        setEncodedWorkflow(encoded);
        setError('');
      } catch (err) {
        setError('工作流数据格式错误');
        setEncodedWorkflow('');
      }
    }
  }, [workflowJson, isClient]);

  useEffect(() => {
    if (isClient) {
      // 检查 n8n-demo 元素是否已定义
      const checkN8nDemo = () => {
        if (typeof window !== 'undefined' && window.customElements) {
          const isDefined = window.customElements.get('n8n-demo');
          if (isDefined) {
            console.log('n8n-demo element is defined');
            setIsReady(true);
          } else {
            console.log('n8n-demo element not yet defined, retrying...');
            setTimeout(checkN8nDemo, 500);
          }
        }
      };

      // 延迟检查，给脚本加载时间
      setTimeout(checkN8nDemo, 1000);
    }
  }, [isClient]);

  const PreviewContent = () => {
    if (!isClient) {
      return (
        <div className="flex items-center justify-center" style={{ height }}>
          <div className="flex items-center gap-2 text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>初始化中...</span>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      );
    }

    if (!workflowJson) {
      return (
        <div className="flex items-center justify-center border border-gray-200 rounded-lg bg-gray-50" style={{ height }}>
          <p className="text-gray-500">暂无工作流数据</p>
        </div>
      );
    }

    if (!isReady) {
      return (
        <div className="flex items-center justify-center border border-gray-200 rounded-lg bg-gray-50" style={{ height }}>
          <div className="flex items-center gap-2 text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>正在加载 n8n 预览组件...</span>
          </div>
        </div>
      );
    }

    const N8nDemo = 'n8n-demo' as any;

    return (
      <div 
        className="border border-gray-200 rounded-lg overflow-hidden bg-white" 
        style={{ height, width }}
      >
        <N8nDemo
          workflow={encodedWorkflow}
          hidecanvaserrors="true"
          clicktointeract="true"
          frame="false"
          collapseformobile="false"
        />
      </div>
    );
  };

  const content = (
    <div className={className}>
      <PreviewContent />
    </div>
  );

  if (showCard) {
    return (
      <Card className={className}>
        {(title || description) && (
          <CardHeader>
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
        )}
        <CardContent>
          <PreviewContent />
        </CardContent>
      </Card>
    );
  }

  return content;
}

export default N8nWorkflowPreview; 