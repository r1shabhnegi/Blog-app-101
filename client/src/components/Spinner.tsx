import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "size-6",
  md: "size-10",
  lg: "size-14",
};

const Spinner = ({ size = "md", className }: SpinnerProps) => {
  return (
    <Loader
      aria-label='Loading'
      className={cn(
        "flex-1 m-0 mx-auto text-center h-min animate-spin text-gray-600",
        sizeMap[size],
        className
      )}
    />
  );
};

export default Spinner;
