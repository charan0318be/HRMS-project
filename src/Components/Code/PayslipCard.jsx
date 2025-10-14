const PayslipCard = ({ payslip }) => {
  if (!payslip) {
    return <p className="text-gray-600">Payslip not available for this month.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h3 className="font-semibold mb-2">Earnings</h3>
        <ul className="space-y-1">
          {Object.entries(payslip.earnings).map(([key, value]) => (
            <li key={key} className="flex justify-between">
              <span className="capitalize">{key}</span>
              <span>₹{value}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Deductions</h3>
        <ul className="space-y-1">
          {Object.entries(payslip.deductions).map(([key, value]) => (
            <li key={key} className="flex justify-between">
              <span className="capitalize">{key}</span>
              <span>₹{value}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="col-span-2 text-right mt-4 font-bold text-lg">
        Net Pay: ₹{payslip.netPay}
      </div>
    </div>
  );
};

export default PayslipCard;
