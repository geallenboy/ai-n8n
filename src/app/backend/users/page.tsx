'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Users, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Shield, 
  UserCheck,
  UserX,
  Mail,
  Calendar
} from 'lucide-react';
import { getUsers, createUser, updateUser, deleteUser } from '@/features/users/actions/user-actions';
import { toast } from 'sonner';

interface User {
  id: string;
  fullName: string | null;
  email: string;
  isActive: boolean;
  isAdmin: boolean;
  provider: string | null;
  providerId: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export default function UsersManagePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    isActive: true,
    isAdmin: false,
    provider: 'email'
  });

  useEffect(() => {
    loadUsers();
  }, [currentPage, searchTerm]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const result = await getUsers(currentPage, 10, searchTerm);
             if (result.success && result.data) {
         // 确保数据类型正确
         const processedUsers = result.data.map(user => ({
           ...user,
           isActive: user.isActive ?? true,
           isAdmin: user.isAdmin ?? false,
         }));
         setUsers(processedUsers);
         if (result.pagination) {
           setTotalPages(result.pagination.totalPages);
         }
       } else {
        toast.error('加载用户列表失败');
      }
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('加载用户列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    try {
      const result = await createUser(formData);
      if (result.success) {
        toast.success('用户创建成功');
        setIsCreateDialogOpen(false);
        resetForm();
        loadUsers();
      } else {
        toast.error(result.error || '创建用户失败');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('创建用户失败');
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    
    try {
      const result = await updateUser(selectedUser.id, formData);
      if (result.success) {
        toast.success('用户更新成功');
        setIsEditDialogOpen(false);
        resetForm();
        loadUsers();
      } else {
        toast.error(result.error || '更新用户失败');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('更新用户失败');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('确定要删除这个用户吗？此操作不可撤销。')) {
      return;
    }

    try {
      const result = await deleteUser(userId);
      if (result.success) {
        toast.success('用户删除成功');
        loadUsers();
      } else {
        toast.error(result.error || '删除用户失败');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('删除用户失败');
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setFormData({
      fullName: user.fullName || '',
      email: user.email,
      isActive: user.isActive,
      isAdmin: user.isAdmin,
      provider: user.provider || 'email'
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      isActive: true,
      isAdmin: false,
      provider: 'email'
    });
    setSelectedUser(null);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Users className="h-8 w-8 text-blue-600" />
            用户管理
          </h1>
          <p className="mt-2 text-gray-600">
            管理系统用户，包括权限设置和账户状态
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              添加用户
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>创建新用户</DialogTitle>
              <DialogDescription>
                填写用户信息来创建新的系统用户
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName">姓名</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="请输入用户姓名"
                />
              </div>
              <div>
                <Label htmlFor="email">邮箱</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="请输入邮箱地址"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="isActive">激活状态</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isAdmin"
                  checked={formData.isAdmin}
                  onCheckedChange={(checked) => setFormData({ ...formData, isAdmin: checked })}
                />
                <Label htmlFor="isAdmin">管理员权限</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={handleCreateUser}>
                创建用户
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>搜索和筛选</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="搜索用户姓名或邮箱..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>用户列表</CardTitle>
          <CardDescription>
            共 {users.length} 个用户
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>用户信息</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>权限</TableHead>
                  <TableHead>登录方式</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Mail className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">{user.fullName || '未设置'}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.isActive ? "default" : "secondary"} className="flex items-center gap-1 w-fit">
                        {user.isActive ? (
                          <>
                            <UserCheck className="h-3 w-3" />
                            激活
                          </>
                        ) : (
                          <>
                            <UserX className="h-3 w-3" />
                            禁用
                          </>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.isAdmin ? "destructive" : "outline"} className="flex items-center gap-1 w-fit">
                        <Shield className="h-3 w-3" />
                        {user.isAdmin ? '管理员' : '普通用户'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {user.provider === 'email' ? '邮箱' : user.provider}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar className="h-3 w-3" />
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('zh-CN') : '未知'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">
                第 {currentPage} 页，共 {totalPages} 页
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  上一页
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  下一页
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑用户</DialogTitle>
            <DialogDescription>
              修改用户信息和权限设置
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editFullName">姓名</Label>
              <Input
                id="editFullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="请输入用户姓名"
              />
            </div>
            <div>
              <Label htmlFor="editEmail">邮箱</Label>
              <Input
                id="editEmail"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="请输入邮箱地址"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="editIsActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="editIsActive">激活状态</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="editIsAdmin"
                checked={formData.isAdmin}
                onCheckedChange={(checked) => setFormData({ ...formData, isAdmin: checked })}
              />
              <Label htmlFor="editIsAdmin">管理员权限</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleUpdateUser}>
              保存更改
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 