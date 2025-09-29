import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye, FileText } from "lucide-react";
import { 
  useUserPresentations, 
  useCreatePresentation, 
  useUpdatePresentation, 
  useDeletePresentation 
} from "@/hooks/usePresentations";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPresentationSchema, type InsertPresentation, type Presentation } from "@shared/schema";
import { Link } from "wouter";

const SAMPLE_USER_ID = 'sample-user'; // Default user for demo

interface PresentationFormData {
  title: string;
  description: string;
}

export default function ManagePresentations() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingPresentation, setEditingPresentation] = useState<Presentation | null>(null);
  
  const { data: presentationsData = [], isLoading } = useUserPresentations(SAMPLE_USER_ID);
  const presentations = presentationsData as Presentation[];
  const createPresentation = useCreatePresentation();
  const updatePresentation = useUpdatePresentation();
  const deletePresentation = useDeletePresentation();
  const { toast } = useToast();

  const createForm = useForm<PresentationFormData>({
    resolver: zodResolver(insertPresentationSchema.omit({ userId: true })),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const editForm = useForm<PresentationFormData>({
    resolver: zodResolver(insertPresentationSchema.omit({ userId: true })),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const handleCreatePresentation = async (data: PresentationFormData) => {
    try {
      const presentationData: InsertPresentation = {
        ...data,
        userId: SAMPLE_USER_ID,
      };
      
      await createPresentation.mutateAsync(presentationData);
      
      toast({
        title: "Thành công",
        description: "Đã tạo bài thuyết trình mới",
      });
      
      setIsCreateDialogOpen(false);
      createForm.reset();
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tạo bài thuyết trình",
        variant: "destructive",
      });
    }
  };

  const handleUpdatePresentation = async (data: PresentationFormData) => {
    if (!editingPresentation) return;
    
    try {
      await updatePresentation.mutateAsync({
        id: editingPresentation.id,
        ...data,
      });
      
      toast({
        title: "Thành công",
        description: "Đã cập nhật bài thuyết trình",
      });
      
      setEditingPresentation(null);
      editForm.reset();
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật bài thuyết trình",
        variant: "destructive",
      });
    }
  };

  const handleDeletePresentation = async (presentationId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bài thuyết trình này?')) {
      return;
    }
    
    try {
      await deletePresentation.mutateAsync(presentationId);
      
      toast({
        title: "Thành công",
        description: "Đã xóa bài thuyết trình",
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa bài thuyết trình",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (presentation: Presentation) => {
    setEditingPresentation(presentation);
    editForm.setValue('title', presentation.title);
    editForm.setValue('description', presentation.description || '');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8" data-testid="manage-presentations">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản Lý Bài Thuyết Trình</h1>
          <p className="text-muted-foreground mt-2">
            Tạo và quản lý các bài thuyết trình của bạn
          </p>
        </div>
        
        <div className="flex gap-2">
          <Link href="/" className="no-underline">
            <Button variant="outline" data-testid="button-view-presentation">
              <Eye className="w-4 h-4 mr-2" />
              Xem Thuyết Trình
            </Button>
          </Link>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-create-presentation">
                <Plus className="w-4 h-4 mr-2" />
                Tạo Mới
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tạo Bài Thuyết Trình Mới</DialogTitle>
                <DialogDescription>
                  Nhập thông tin cho bài thuyết trình mới của bạn
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={createForm.handleSubmit(handleCreatePresentation)} className="space-y-4">
                <div>
                  <Label htmlFor="title">Tiêu đề</Label>
                  <Input
                    id="title"
                    {...createForm.register('title')}
                    placeholder="Nhập tiêu đề bài thuyết trình"
                    data-testid="input-create-title"
                  />
                  {createForm.formState.errors.title && (
                    <p className="text-sm text-destructive mt-1">
                      {createForm.formState.errors.title.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                    id="description"
                    {...createForm.register('description')}
                    placeholder="Mô tả ngắn gọn về nội dung"
                    data-testid="input-create-description"
                  />
                  {createForm.formState.errors.description && (
                    <p className="text-sm text-destructive mt-1">
                      {createForm.formState.errors.description.message}
                    </p>
                  )}
                </div>
                <div className="flex justify-end gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsCreateDialogOpen(false)}
                    data-testid="button-cancel-create"
                  >
                    Hủy
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createPresentation.isPending}
                    data-testid="button-submit-create"
                  >
                    {createPresentation.isPending ? 'Đang tạo...' : 'Tạo'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {presentations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Chưa có bài thuyết trình nào</h3>
            <p className="text-muted-foreground text-center mb-6">
              Bắt đầu bằng cách tạo bài thuyết trình đầu tiên của bạn
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)} data-testid="button-create-first">
              <Plus className="w-4 h-4 mr-2" />
              Tạo Bài Thuyết Trình Đầu Tiên
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {presentations.map((presentation) => (
            <Card key={presentation.id} className="hover-elevate">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg line-clamp-2">{presentation.title}</CardTitle>
                    <CardDescription className="line-clamp-3">
                      {presentation.description || 'Không có mô tả'}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="ml-2 shrink-0">
                    ID: {presentation.id.slice(0, 8)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Tạo: {new Date(presentation.createdAt).toLocaleDateString('vi-VN')}
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/manage/${presentation.id}`} className="no-underline">
                      <Button size="sm" variant="ghost" data-testid={`button-edit-${presentation.id}`}>
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => openEditDialog(presentation)}
                      data-testid={`button-edit-info-${presentation.id}`}
                    >
                      <FileText className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => handleDeletePresentation(presentation.id)}
                      data-testid={`button-delete-${presentation.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Presentation Dialog */}
      <Dialog open={!!editingPresentation} onOpenChange={() => setEditingPresentation(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh Sửa Thông Tin</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin bài thuyết trình
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={editForm.handleSubmit(handleUpdatePresentation)} className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Tiêu đề</Label>
              <Input
                id="edit-title"
                {...editForm.register('title')}
                placeholder="Nhập tiêu đề bài thuyết trình"
                data-testid="input-edit-title"
              />
              {editForm.formState.errors.title && (
                <p className="text-sm text-destructive mt-1">
                  {editForm.formState.errors.title.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="edit-description">Mô tả</Label>
              <Textarea
                id="edit-description"
                {...editForm.register('description')}
                placeholder="Mô tả ngắn gọn về nội dung"
                data-testid="input-edit-description"
              />
              {editForm.formState.errors.description && (
                <p className="text-sm text-destructive mt-1">
                  {editForm.formState.errors.description.message}
                </p>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setEditingPresentation(null)}
                data-testid="button-cancel-edit"
              >
                Hủy
              </Button>
              <Button 
                type="submit" 
                disabled={updatePresentation.isPending}
                data-testid="button-submit-edit"
              >
                {updatePresentation.isPending ? 'Đang lưu...' : 'Lưu'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}