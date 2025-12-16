import { QRCodeSVG } from "qrcode.react";
import { forwardRef } from "react";

interface PatientCardProps {
  patient: {
    id: string;
    name: string;
    phone: string;
    address: string;
    dateOfBirth: string;
    bloodGroup?: string;
    registrationDate: string;
  };
}

const PatientCard = forwardRef<HTMLDivElement, PatientCardProps>(
  ({ patient }, ref) => {
    const qrData = JSON.stringify({
      id: patient.id,
      name: patient.name,
      phone: patient.phone,
    });

    return (
      <div
        ref={ref}
        className="w-[85.6mm] h-[54mm] bg-white rounded-lg overflow-hidden shadow-lg print:shadow-none"
        style={{ fontFamily: "Inter, system-ui, sans-serif" }}
      >
        {/* Front of Card */}
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="bg-[hsl(152,69%,31%)] text-white px-4 py-2">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-sm font-bold tracking-tight">SHIRBALINE HOSPITAL</h1>
                <p className="text-[10px] opacity-90">Dutse, Jigawa State, Nigeria</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-medium">PATIENT CARD</p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 p-3 flex gap-3">
            {/* Patient Info */}
            <div className="flex-1 space-y-1.5">
              <div>
                <p className="text-[9px] text-gray-500 uppercase tracking-wide">Patient ID</p>
                <p className="text-sm font-bold text-[hsl(152,69%,31%)]">{patient.id}</p>
              </div>
              <div>
                <p className="text-[9px] text-gray-500 uppercase tracking-wide">Name</p>
                <p className="text-xs font-semibold text-gray-900 truncate">{patient.name}</p>
              </div>
              <div className="flex gap-3">
                <div>
                  <p className="text-[9px] text-gray-500 uppercase tracking-wide">DOB</p>
                  <p className="text-[10px] text-gray-700">{patient.dateOfBirth}</p>
                </div>
                {patient.bloodGroup && (
                  <div>
                    <p className="text-[9px] text-gray-500 uppercase tracking-wide">Blood</p>
                    <p className="text-[10px] font-semibold text-red-600">{patient.bloodGroup}</p>
                  </div>
                )}
              </div>
              <div>
                <p className="text-[9px] text-gray-500 uppercase tracking-wide">Phone</p>
                <p className="text-[10px] text-gray-700">{patient.phone}</p>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center justify-center">
              <QRCodeSVG
                value={qrData}
                size={70}
                level="M"
                includeMargin={false}
                bgColor="#ffffff"
                fgColor="hsl(152, 69%, 31%)"
              />
              <p className="text-[8px] text-gray-400 mt-1">Scan to verify</p>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-100 px-3 py-1.5 flex justify-between items-center">
            <p className="text-[8px] text-gray-500">Reg: {patient.registrationDate}</p>
            <p className="text-[8px] text-gray-500">☎ 08012345678</p>
          </div>
        </div>
      </div>
    );
  }
);

PatientCard.displayName = "PatientCard";

export default PatientCard;
