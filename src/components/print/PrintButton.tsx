import { useRef, ReactNode } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

interface PrintButtonProps {
  children: ReactNode;
  documentTitle?: string;
  buttonText?: string;
  buttonVariant?: "default" | "outline" | "ghost" | "secondary";
  buttonSize?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

const PrintButton = ({
  children,
  documentTitle = "Print Document",
  buttonText = "Print",
  buttonVariant = "outline",
  buttonSize = "default",
  className,
}: PrintButtonProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle,
  });

  return (
    <div>
      <Button
        variant={buttonVariant}
        size={buttonSize}
        onClick={() => handlePrint()}
        className={className}
      >
        <Printer className="h-4 w-4 mr-2" />
        {buttonText}
      </Button>
      <div className="hidden print:block">
        <div ref={contentRef}>{children}</div>
      </div>
    </div>
  );
};

export default PrintButton;
