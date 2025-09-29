import Slide from '../Slide';

export default function SlideExample() {
  const exampleSlide = {
    id: 1,
    type: 'title' as const,
    title: "Vượt Lên Số Phận",
    content: "Làm thế nào để con người vượt lên số phận của chính mình trong cuộc sống",
    background: "bg-gradient-to-br from-primary via-primary/90 to-primary/80"
  };

  return (
    <div className="w-full h-screen relative">
      <Slide 
        slide={exampleSlide}
        isActive={true}
        direction="none"
      />
    </div>
  );
}