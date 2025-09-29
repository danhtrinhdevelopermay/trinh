import { useLocation } from "wouter";
import PresentationContainer from "@/components/PresentationContainer";

export default function Home() {
  const [location] = useLocation();
  
  // Extract presentationId from URL parameters
  const urlParams = new URLSearchParams(location.split('?')[1]);
  const presentationId = urlParams.get('presentationId');
  
  return <PresentationContainer presentationId={presentationId || undefined} />;
}