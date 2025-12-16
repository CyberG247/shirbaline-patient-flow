import { QRCodeSVG } from "qrcode.react";
import { forwardRef } from "react";

interface RegistrationSlipProps {
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
}

const RegistrationSlip = forwardRef<HTMLDivElement, RegistrationSlipProps>(
  ({ patient, receiptNumber }, ref) => {
    const qrData = JSON.stringify({
      id: patient.id,
      receipt: receiptNumber,
      date: patient.registrationDate,
    });

    return (
      <div
        ref={ref}
        className="w-[148mm] bg-white p-6 print:p-4"
        style={{ fontFamily: "Inter, system-ui, sans-serif" }}
      >
        {/* Header */}
        <div className="text-center border-b-2 border-[hsl(152,69%,31%)] pb-4 mb-4">
          <h1 className="text-xl font-bold text-[hsl(152,69%,31%)]">SHIRBALINE HOSPITAL</h1>
          <p className="text-sm text-gray-600">Dutse, Jigawa State, Nigeria</p>
          <p className="text-xs text-gray-500 mt-1">Tel: 08012345678 | Email: info@shirbaline.ng</p>
          <div className="mt-3 inline-block bg-[hsl(152,69%,31%)] text-white px-4 py-1 rounded-full text-sm font-medium">
            REGISTRATION RECEIPT
          </div>
        </div>

        {/* Receipt Info */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-xs text-gray-500">Receipt No.</p>
            <p className="font-bold text-sm">{receiptNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Date</p>
            <p className="font-medium text-sm">{patient.registrationDate}</p>
          </div>
        </div>

        {/* Patient Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Patient Information</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-500">Patient ID</p>
              <p className="font-bold text-[hsl(152,69%,31%)]">{patient.id}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Full Name</p>
              <p className="font-semibold text-gray-900">{patient.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Phone Number</p>
              <p className="text-sm text-gray-700">{patient.phone}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Address</p>
              <p className="text-sm text-gray-700 truncate">{patient.address}</p>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="border rounded-lg overflow-hidden mb-4">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-2 text-xs font-semibold text-gray-600">Description</th>
                <th className="text-right px-4 py-2 text-xs font-semibold text-gray-600">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="px-4 py-2">Registration / Enrollment Fee</td>
                <td className="px-4 py-2 text-right">₦{patient.enrollmentFeePaid.toLocaleString()}</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2">Initial Wallet Deposit</td>
                <td className="px-4 py-2 text-right">₦{(patient.walletBalance - patient.enrollmentFeePaid + patient.enrollmentFeePaid).toLocaleString()}</td>
              </tr>
              <tr className="border-t bg-[hsl(152,69%,31%)]/5">
                <td className="px-4 py-3 font-semibold">Total Paid</td>
                <td className="px-4 py-3 text-right font-bold text-[hsl(152,69%,31%)]">
                  ₦{patient.walletBalance.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Wallet Balance */}
        <div className="flex items-center justify-between bg-[hsl(152,69%,31%)]/10 rounded-lg p-4 mb-4">
          <div>
            <p className="text-xs text-gray-600">Current Wallet Balance</p>
            <p className="text-2xl font-bold text-[hsl(152,69%,31%)]">
              ₦{(patient.walletBalance - patient.enrollmentFeePaid).toLocaleString()}
            </p>
          </div>
          <QRCodeSVG
            value={qrData}
            size={60}
            level="M"
            includeMargin={false}
            bgColor="transparent"
            fgColor="hsl(152, 69%, 31%)"
          />
        </div>

        {/* Footer */}
        <div className="border-t pt-4 text-center">
          <p className="text-xs text-gray-500 mb-2">
            Thank you for registering with Shirbaline Hospital
          </p>
          <p className="text-[10px] text-gray-400">
            Please keep this receipt and your Patient ID for future visits. Present your ID at the reception desk.
          </p>
        </div>

        {/* Signature Line */}
        <div className="mt-6 pt-4 border-t flex justify-between">
          <div className="text-center">
            <div className="w-32 border-t border-gray-400 mt-8"></div>
            <p className="text-xs text-gray-500 mt-1">Staff Signature</p>
          </div>
          <div className="text-center">
            <div className="w-32 border-t border-gray-400 mt-8"></div>
            <p className="text-xs text-gray-500 mt-1">Date & Stamp</p>
          </div>
        </div>
      </div>
    );
  }
);

RegistrationSlip.displayName = "RegistrationSlip";

export default RegistrationSlip;
