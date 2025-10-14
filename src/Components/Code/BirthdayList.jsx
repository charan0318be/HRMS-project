const BirthdayList = ({ birthdays }) => {
  if (!birthdays || birthdays.length === 0) {
    return <p className="text-gray-600">No birthdays this month.</p>;
  }

  return (
    <ul className="space-y-2">
      {birthdays.map((b) => (
        <li
          key={b._id}
          className="flex justify-between items-center bg-pink-100 p-3 rounded shadow"
        >
          <span>{b.name}</span>
          <span>{new Date(b.birthDate).toLocaleDateString()}</span>
        </li>
      ))}
    </ul>
  );
};

export default BirthdayList;
