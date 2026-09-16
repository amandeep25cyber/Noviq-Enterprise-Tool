import { Loader2Icon } from "lucide-react"

const ScreenLoader = () => {
  return (
    
    <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-linear-to-br from-blue-50 to-blue-50">
        <Loader2Icon className="w-15 h-15 md:w-30 md:h-30 text-gray-700 animate-spin" />
    </div>
  );
};

export default ScreenLoader;