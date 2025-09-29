import { slideContentSchema, type SlideContent } from "@shared/schema";

// Demo slides để test hiệu ứng Morph như PowerPoint
// Slide 1 và 2 có cùng element ID nhưng vị trí, kích thước, màu khác nhau
const rawDemoSlides = [
  // Slide 1: Text ở giữa, màu xanh, lớn
  {
    background: "educational-gradient-1",
    textColor: "text-white",
    elements: [
      {
        id: "title-text",
        type: "text" as const,
        text: "Vượt Lên Số Phận",
        x: 250,
        y: 350,
        width: 700,
        height: 100,
        fontSize: 72,
        fontWeight: "bold",
        color: "#3B82F6", // blue-500
        textAlign: "center" as const,
        lineHeight: 1.2,
        rotation: 0,
        opacity: 1,
        zIndex: 1,
      },
      {
        id: "subtitle-text",
        type: "text" as const,
        text: "Hành trình khám phá bản thân",
        x: 300,
        y: 470,
        width: 600,
        height: 60,
        fontSize: 32,
        fontWeight: "normal",
        color: "#60A5FA", // blue-400
        textAlign: "center" as const,
        lineHeight: 1.5,
        rotation: 0,
        opacity: 1,
        zIndex: 1,
      },
      {
        id: "icon-star",
        type: "icon" as const,
        iconName: "Star",
        x: 150,
        y: 360,
        width: 64,
        height: 64,
        color: "#FBBF24", // yellow-400
        strokeWidth: 2,
        rotation: 0,
        opacity: 1,
        zIndex: 2,
      },
      {
        id: "shape-circle",
        type: "shape" as const,
        shapeType: "circle" as const,
        x: 1050,
        y: 380,
        width: 60,
        height: 60,
        fill: "#34D399", // green-400
        rotation: 0,
        opacity: 0.8,
        zIndex: 0,
      },
    ],
  },
  
  // Slide 2: Các elements giống nhau nhưng đã di chuyển, đổi size, đổi màu
  {
    background: "educational-gradient-1",
    textColor: "text-white",
    elements: [
      {
        id: "title-text",
        type: "text" as const,
        text: "Vượt Lên Số Phận", // Cùng text
        x: 50, // Di chuyển sang trái
        y: 100, // Di chuyển lên trên
        width: 500, // Thu nhỏ
        height: 80,
        fontSize: 48, // Font nhỏ hơn
        fontWeight: "bold",
        color: "#EF4444", // Đổi sang red-500
        textAlign: "left" as const, // Đổi alignment
        lineHeight: 1.2,
        rotation: 0,
        opacity: 1,
        zIndex: 1,
      },
      {
        id: "subtitle-text",
        type: "text" as const,
        text: "Hành trình khám phá bản thân",
        x: 50,
        y: 190, // Di chuyển theo title
        width: 500,
        height: 50,
        fontSize: 24, // Nhỏ hơn
        fontWeight: "normal",
        color: "#F87171", // red-400
        textAlign: "left" as const,
        lineHeight: 1.5,
        rotation: 0,
        opacity: 1,
        zIndex: 1,
      },
      {
        id: "icon-star",
        type: "icon" as const,
        iconName: "Star",
        x: 950, // Di chuyển sang phải
        y: 150, // Lên trên
        width: 80, // Phóng to
        height: 80,
        color: "#F59E0B", // Đổi màu sang amber-500
        strokeWidth: 3,
        rotation: 45, // Xoay 45 độ
        opacity: 1,
        zIndex: 2,
      },
      {
        id: "shape-circle",
        type: "shape" as const,
        shapeType: "rect" as const, // Đổi từ circle sang rect!
        x: 100,
        y: 400,
        width: 120, // Lớn hơn
        height: 120,
        fill: "#8B5CF6", // Đổi màu sang purple-500
        borderRadius: 20, // Bo góc
        rotation: 0,
        opacity: 0.9,
        zIndex: 0,
      },
    ],
  },
  
  // Slide 3: Content với nhiều elements, một số elements mới xuất hiện
  {
    background: "educational-gradient-1",
    textColor: "text-white",
    elements: [
      {
        id: "title-text",
        type: "text" as const,
        text: "Vượt Lên Số Phận",
        x: 450, // Về lại giữa
        y: 80,
        width: 300,
        height: 60,
        fontSize: 40,
        fontWeight: "bold",
        color: "#10B981", // green-500
        textAlign: "center" as const,
        lineHeight: 1.2,
        rotation: 0,
        opacity: 1,
        zIndex: 1,
      },
      {
        id: "subtitle-text",
        type: "text" as const,
        text: "Hành trình khám phá bản thân",
        x: 400,
        y: 150,
        width: 400,
        height: 40,
        fontSize: 20,
        fontWeight: "normal",
        color: "#34D399", // green-400
        textAlign: "center" as const,
        lineHeight: 1.5,
        rotation: 0,
        opacity: 1,
        zIndex: 1,
      },
      {
        id: "icon-star",
        type: "icon" as const,
        iconName: "Heart", // Đổi icon!
        x: 600,
        y: 500,
        width: 48,
        height: 48,
        color: "#EC4899", // pink-500
        strokeWidth: 2,
        rotation: 0,
        opacity: 1,
        zIndex: 2,
      },
      // Element mới - sẽ fade in
      {
        id: "new-bullet-1",
        type: "text" as const,
        text: "• Tin vào bản thân",
        x: 300,
        y: 250,
        width: 600,
        height: 50,
        fontSize: 28,
        fontWeight: "normal",
        color: "#FFFFFF",
        textAlign: "left" as const,
        lineHeight: 1.5,
        rotation: 0,
        opacity: 1,
        zIndex: 1,
      },
      {
        id: "new-bullet-2",
        type: "text" as const,
        text: "• Hành động kiên trì",
        x: 300,
        y: 320,
        width: 600,
        height: 50,
        fontSize: 28,
        fontWeight: "normal",
        color: "#FFFFFF",
        textAlign: "left" as const,
        lineHeight: 1.5,
        rotation: 0,
        opacity: 1,
        zIndex: 1,
      },
      {
        id: "new-bullet-3",
        type: "text" as const,
        text: "• Không bao giờ bỏ cuộc",
        x: 300,
        y: 390,
        width: 600,
        height: 50,
        fontSize: 28,
        fontWeight: "normal",
        color: "#FFFFFF",
        textAlign: "left" as const,
        lineHeight: 1.5,
        rotation: 0,
        opacity: 1,
        zIndex: 1,
      },
      // shape-circle đã biến mất (sẽ fade out)
    ],
  },
];

// Parse with Zod to apply defaults
export const demoMorphSlides: SlideContent[] = rawDemoSlides.map(slide => 
  slideContentSchema.parse(slide)
);
