import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Upload, Loader2 } from 'lucide-react';
import { ImportStateType } from '../types';

interface ImportBlogsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  importState: ImportStateType;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onImport: () => void;
}

export default function ImportBlogsDialog({
  isOpen,
  onOpenChange,
  importState,
  onFileUpload,
  onImport
}: ImportBlogsDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          导入JSON
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>批量导入博客</DialogTitle>
          <DialogDescription>
            上传JSON文件批量导入博客数据
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="jsonFile">选择JSON文件</Label>
            <Input
              id="jsonFile"
              type="file"
              accept=".json"
              onChange={onFileUpload}
              ref={fileInputRef}
            />
            <p className="text-sm text-gray-500 mt-1">
              支持的字段：url*, title*, titleZh, excerpt, excerptZh, thumbnail, tags, readme, readmeZh, crawled_at, categoryId
            </p>
          </div>
          
          {importState.jsonData.length > 0 && (
            <div>
              <Label>预览数据</Label>
              <div className="border rounded-md p-3 bg-gray-50 max-h-60 overflow-auto">
                <p className="text-sm text-gray-600 mb-2">
                  共 {importState.jsonData.length} 条记录
                </p>
                <div className="overflow-x-auto">
                  <pre className="text-xs whitespace-pre-wrap break-words max-w-full">
                    {JSON.stringify(importState.jsonData.slice(0, 2), null, 2)}
                    {importState.jsonData.length > 2 && '\n... 还有 ' + (importState.jsonData.length - 2) + ' 条记录'}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button 
            onClick={onImport}
            disabled={importState.jsonData.length === 0 || importState.importing}
          >
            {importState.importing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                导入中...
              </>
            ) : (
              '开始导入'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 