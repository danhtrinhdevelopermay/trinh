import { useState } from "react";
import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, ArrowLeft, GripVertical, Eye } from "lucide-react";
import { 
  usePresentationSlides,
  usePresentation,
  useCreateSlide, 
  useUpdateSlide, 
  useDeleteSlide,
  useReorderSlides 
} from "@/hooks/usePresentations";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertSlideSchema, type InsertSlide, type SlideData } from "@shared/schema";
import { Link } from "wouter";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

interface SlideFormData {
  title: string;
  content: string;
  type: 'title' | 'content' | 'quote';
  background: string;
}

const backgroundOptions = [
  { value: "bg-gradient-to-br from-primary via-primary/90 to-primary/80", label: "Chính (Xanh dương)" },
  { value: "bg-gradient-to-br from-chart-1 via-chart-1/90 to-chart-1/80", label: "Màu 1 (Cam)" },
  { value: "bg-gradient-to-br from-chart-2 via-chart-2/90 to-chart-2/80", label: "Màu 2 (Xanh lá)" },
  { value: "bg-gradient-to-br from-chart-3 via-chart-3/90 to-chart-3/80", label: "Màu 3 (Tím)" },
  { value: "bg-gradient-to-br from-chart-4 via-chart-4/90 to-chart-4/80", label: "Màu 4 (Vàng)" },
  { value: "bg-gradient-to-br from-chart-5 via-chart-5/90 to-chart-5/80", label: "Màu 5 (Đỏ)" },
];

export default function ManageSlides() {
  const params = useParams();
  const presentationId = params.id as string;
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<SlideData | null>(null);
  
  const { data: presentationData } = usePresentation(presentationId);
  const presentation = presentationData as { title: string } | undefined;
  const { data: slidesData = [], isLoading } = usePresentationSlides(presentationId);
  const slides = slidesData as SlideData[];
  
  const createSlide = useCreateSlide();
  const updateSlide = useUpdateSlide();
  const deleteSlide = useDeleteSlide();
  const reorderSlides = useReorderSlides();
  const { toast } = useToast();

  const createForm = useForm<SlideFormData>({
    resolver: zodResolver(insertSlideSchema.omit({ presentationId: true, order: true })),
    defaultValues: {
      title: "",
      content: "",
      type: "content",
      background: backgroundOptions[0].value,
    },
  });

  const editForm = useForm<SlideFormData>({
    resolver: zodResolver(insertSlideSchema.omit({ presentationId: true, order: true })),
    defaultValues: {
      title: "",
      content: "",
      type: "content",
      background: backgroundOptions[0].value,
    },
  });

  const handleCreateSlide = async (data: SlideFormData) => {
    try {
      // Transform content into array format if it contains bullet points
      let content = data.content;
      if (content.includes('•') || content.includes('-')) {
        const lines = content.split('\n').map(line => line.trim().replace(/^[•-]\s*/, '')).filter(Boolean);
        content = JSON.stringify(lines);
      }

      const slideData: Omit<InsertSlide, 'order'> = {
        presentationId,
        title: data.title,
        content,
        type: data.type,
        background: data.background,
      };
      
      await createSlide.mutateAsync(slideData);
      
      toast({
        title: "Thành công",
        description: "Đã tạo slide mới",
      });
      
      setIsCreateDialogOpen(false);
      createForm.reset();
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tạo slide",
        variant: "destructive",
      });
    }
  };

  const handleUpdateSlide = async (data: SlideFormData) => {
    if (!editingSlide) return;
    
    try {
      // Transform content into array format if it contains bullet points
      let content = data.content;
      if (content.includes('•') || content.includes('-')) {
        const lines = content.split('\n').map(line => line.trim().replace(/^[•-]\s*/, '')).filter(Boolean);
        content = JSON.stringify(lines);
      }

      await updateSlide.mutateAsync({
        id: editingSlide.id,
        presentationId,
        title: data.title,
        content,
        type: data.type,
        background: data.background,
      });
      
      toast({
        title: "Thành công",
        description: "Đã cập nhật slide",
      });
      
      setEditingSlide(null);
      editForm.reset();
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật slide",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSlide = async (slideId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa slide này?')) {
      return;
    }
    
    try {
      await deleteSlide.mutateAsync({ id: slideId, presentationId });
      
      toast({
        title: "Thành công",
        description: "Đã xóa slide",
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa slide",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (slide: SlideData) => {
    setEditingSlide(slide);
    
    // Transform content for editing
    let content = slide.content;
    if (typeof content === 'string' && content.startsWith('[') && content.endsWith(']')) {
      try {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          content = parsed.map(item => `• ${item}`).join('\n');
        }
      } catch (e) {
        // Keep original content if parsing fails
      }
    }
    
    editForm.setValue('title', slide.title);
    editForm.setValue('content', typeof content === 'string' ? content : '');
    editForm.setValue('type', slide.type);
    editForm.setValue('background', slide.background);
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const startIndex = result.source.index;
    const endIndex = result.destination.index;

    if (startIndex === endIndex) return;

    // Create new order based on drag result
    const newSlides = Array.from(slides);
    const [reorderedItem] = newSlides.splice(startIndex, 1);
    newSlides.splice(endIndex, 0, reorderedItem);

    // Update order values
    const slideOrders = newSlides.map((slide, index) => ({
      id: slide.id.toString(),
      order: index + 1,
    }));

    try {
      await reorderSlides.mutateAsync({ presentationId, slideOrders });
      toast({
        title: "Thành công",
        description: "Đã sắp xếp lại thứ tự slides",
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể sắp xếp lại slides",
        variant: "destructive",
      });
    }
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
    <div className="container mx-auto py-8 space-y-8" data-testid="manage-slides">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/manage" className="no-underline">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">
              {presentation?.title || 'Quản Lý Slides'}
            </h1>
            <p className="text-muted-foreground mt-2">
              Quản lý các slides trong bài thuyết trình
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Link href={`/?presentationId=${presentationId}`} className="no-underline">
            <Button variant="outline" data-testid="button-preview-presentation">
              <Eye className="w-4 h-4 mr-2" />
              Xem trước
            </Button>
          </Link>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-create-slide">
                <Plus className="w-4 h-4 mr-2" />
                Thêm Slide
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Tạo Slide Mới</DialogTitle>
                <DialogDescription>
                  Tạo slide mới cho bài thuyết trình
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={createForm.handleSubmit(handleCreateSlide)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Tiêu đề</Label>
                    <Input
                      id="title"
                      {...createForm.register('title')}
                      placeholder="Nhập tiêu đề slide"
                      data-testid="input-create-slide-title"
                    />
                    {createForm.formState.errors.title && (
                      <p className="text-sm text-destructive mt-1">
                        {createForm.formState.errors.title.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="type">Loại slide</Label>
                    <Select onValueChange={(value: 'title' | 'content' | 'quote') => createForm.setValue('type', value)}>
                      <SelectTrigger data-testid="select-create-slide-type">
                        <SelectValue placeholder="Chọn loại slide" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="title">Tiêu đề chính</SelectItem>
                        <SelectItem value="content">Nội dung</SelectItem>
                        <SelectItem value="quote">Trích dẫn</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="content">Nội dung</Label>
                  <Textarea
                    id="content"
                    {...createForm.register('content')}
                    placeholder="Nhập nội dung slide (sử dụng • hoặc - để tạo danh sách)"
                    rows={6}
                    data-testid="input-create-slide-content"
                  />
                  {createForm.formState.errors.content && (
                    <p className="text-sm text-destructive mt-1">
                      {createForm.formState.errors.content.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="background">Màu nền</Label>
                  <Select onValueChange={(value) => createForm.setValue('background', value)}>
                    <SelectTrigger data-testid="select-create-slide-background">
                      <SelectValue placeholder="Chọn màu nền" />
                    </SelectTrigger>
                    <SelectContent>
                      {backgroundOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsCreateDialogOpen(false)}
                    data-testid="button-cancel-create-slide"
                  >
                    Hủy
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createSlide.isPending}
                    data-testid="button-submit-create-slide"
                  >
                    {createSlide.isPending ? 'Đang tạo...' : 'Tạo'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {slides.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Plus className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Chưa có slide nào</h3>
            <p className="text-muted-foreground text-center mb-6">
              Bắt đầu bằng cách tạo slide đầu tiên cho bài thuyết trình
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)} data-testid="button-create-first-slide">
              <Plus className="w-4 h-4 mr-2" />
              Tạo Slide Đầu Tiên
            </Button>
          </CardContent>
        </Card>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="slides">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {slides.map((slide, index) => (
                  <Draggable key={slide.id} draggableId={slide.id.toString()} index={index}>
                    {(provided, snapshot) => (
                      <Card 
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`hover-elevate ${snapshot.isDragging ? 'shadow-lg' : ''}`}
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <div
                                {...provided.dragHandleProps}
                                className="cursor-grab hover:text-primary"
                              >
                                <GripVertical className="w-5 h-5" />
                              </div>
                              <div className="space-y-1 flex-1">
                                <div className="flex items-center gap-2">
                                  <CardTitle className="text-lg">{slide.title}</CardTitle>
                                  <Badge variant="outline" className="text-xs">
                                    {slide.type === 'title' ? 'Tiêu đề' : slide.type === 'content' ? 'Nội dung' : 'Trích dẫn'}
                                  </Badge>
                                </div>
                                <CardDescription className="line-clamp-2">
                                  {typeof slide.content === 'string' ? 
                                    slide.content.length > 100 ? 
                                      `${slide.content.substring(0, 100)}...` : 
                                      slide.content
                                    : 'Nội dung phức tạp'
                                  }
                                </CardDescription>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 ml-2">
                              <Badge variant="secondary" className="text-xs">
                                #{index + 1}
                              </Badge>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => openEditDialog(slide)}
                                data-testid={`button-edit-slide-${slide.id}`}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => handleDeleteSlide(slide.id.toString())}
                                data-testid={`button-delete-slide-${slide.id}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {/* Edit Slide Dialog */}
      <Dialog open={!!editingSlide} onOpenChange={() => setEditingSlide(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chỉnh Sửa Slide</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin slide
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={editForm.handleSubmit(handleUpdateSlide)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-title">Tiêu đề</Label>
                <Input
                  id="edit-title"
                  {...editForm.register('title')}
                  placeholder="Nhập tiêu đề slide"
                  data-testid="input-edit-slide-title"
                />
                {editForm.formState.errors.title && (
                  <p className="text-sm text-destructive mt-1">
                    {editForm.formState.errors.title.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="edit-type">Loại slide</Label>
                <Select onValueChange={(value: 'title' | 'content' | 'quote') => editForm.setValue('type', value)}>
                  <SelectTrigger data-testid="select-edit-slide-type">
                    <SelectValue placeholder="Chọn loại slide" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="title">Tiêu đề chính</SelectItem>
                    <SelectItem value="content">Nội dung</SelectItem>
                    <SelectItem value="quote">Trích dẫn</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="edit-content">Nội dung</Label>
              <Textarea
                id="edit-content"
                {...editForm.register('content')}
                placeholder="Nhập nội dung slide (sử dụng • hoặc - để tạo danh sách)"
                rows={6}
                data-testid="input-edit-slide-content"
              />
              {editForm.formState.errors.content && (
                <p className="text-sm text-destructive mt-1">
                  {editForm.formState.errors.content.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="edit-background">Màu nền</Label>
              <Select onValueChange={(value) => editForm.setValue('background', value)}>
                <SelectTrigger data-testid="select-edit-slide-background">
                  <SelectValue placeholder="Chọn màu nền" />
                </SelectTrigger>
                <SelectContent>
                  {backgroundOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setEditingSlide(null)}
                data-testid="button-cancel-edit-slide"
              >
                Hủy
              </Button>
              <Button 
                type="submit" 
                disabled={updateSlide.isPending}
                data-testid="button-submit-edit-slide"
              >
                {updateSlide.isPending ? 'Đang lưu...' : 'Lưu'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}