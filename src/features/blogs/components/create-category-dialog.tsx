import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tag } from 'lucide-react';
import { CategoryFormDataType } from '../types';

interface CreateCategoryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: CategoryFormDataType;
  onFormDataChange: (data: CategoryFormDataType) => void;
  onSubmit: () => void;
}

export default function CreateCategoryDialog({
  isOpen,
  onOpenChange,
  formData,
  onFormDataChange,
  onSubmit
}: CreateCategoryDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Tag className="h-4 w-4" />
          添加分类
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>创建博客分类</DialogTitle>
          <DialogDescription>
            创建新的博客分类来组织内容
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="categoryName">分类名称 *</Label>
            <Input
              id="categoryName"
              value={formData.name}
              onChange={(e) => onFormDataChange({ ...formData, name: e.target.value })}
              placeholder="请输入分类名称"
            />
          </div>
          <div>
            <Label htmlFor="categoryDescription">描述</Label>
            <Textarea
              id="categoryDescription"
              value={formData.description}
              onChange={(e) => onFormDataChange({ ...formData, description: e.target.value })}
              placeholder="请输入分类描述"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={onSubmit}>
            创建分类
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 