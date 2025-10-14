const LeaveCard = ({ type, available }) => (
  <div className="bg-blue-100 p-4 rounded shadow text-center">
    <h3 className="font-semibold text-lg capitalize">{type} Leave</h3>
    <p className="text-2xl font-bold text-blue-800">{available} days</p>
  </div>
);

export default LeaveCard;
