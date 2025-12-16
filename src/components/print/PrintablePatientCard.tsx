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
import { Printer, CreditCard } from "lucide-react";
import PatientCard from "./PatientCard";

interface PrintablePatientCardProps {
  patient: {
    id: string;
    name: string;
    phone: string;
    address: string;
    dateOfBirth: string;
    bloodGroup?: string;
    registrationDate: string;
  };
  trigger?: React.ReactNode;
}

const PrintablePatientCard = ({ patient, trigger }: PrintablePatientCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: cardRef,
    documentTitle: `Patient_Card_${patient.id}`,
    pageStyle: `
      @page {
        size: 85.6mm 54mm;
        margin: 0;
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
            <CreditCard className="h-4 w-4" />
            Patient Card
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Patient ID Card</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          <div className="border rounded-lg p-2 bg-gray-50">
            <PatientCard ref={cardRef} patient={patient} />
          </div>
          <Button onClick={() => handlePrint()} className="w-full gap-2">
            <Printer className="h-4 w-4" />
            Print Patient Card
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrintablePatientCard;
