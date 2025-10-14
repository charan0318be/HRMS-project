const AnnouncementList = ({ announcements }) => {
  if (!announcements || announcements.length === 0) {
    return <p className="text-gray-600">No announcements.</p>;
  }

  return (
    <ul className="space-y-2">
      {announcements.map((a) => (
        <li key={a._id} className="bg-yellow-100 p-3 rounded shadow">
          {a.message}
        </li>
      ))}
    </ul>
  );
};

export default AnnouncementList;
