import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Printer, Receipt } from "lucide-react";
import RegistrationSlip from "./RegistrationSlip";

interface PrintableRegistrationSlipProps {
  patient: {
    id: string;
    name: string;
    phone: string;
    address: string;
    registrationDate: string;
    enrollmentFeePaid: number;
    walletBalance: number;
  };
  receiptNumber: string;
  trigger?: React.ReactNode;
}

const PrintableRegistrationSlip = ({
  patient,
  receiptNumber,
  trigger,
}: PrintableRegistrationSlipProps) => {
  const slipRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: slipRef,
    documentTitle: `Registration_${patient.id}`,
    pageStyle: `
      @page {
        size: A5;
        margin: 10mm;
      }
      @media print {
        body {
          margin: 0;
          padding: 0;
        }
      }
    `,
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <Receipt className="h-4 w-4" />
            Registration Slip
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registration Receipt</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          <div className="border rounded-lg bg-white shadow-sm">
            <RegistrationSlip ref={slipRef} patient={patient} receiptNumber={receiptNumber} />
          </div>
          <Button onClick={() => handlePrint()} className="w-full gap-2">
            <Printer className="h-4 w-4" />
            Print Registration Slip
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrintableRegistrationSlip;
