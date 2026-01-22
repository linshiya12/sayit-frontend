function formatPostDate(createdAt) {
  const createdDate = new Date(createdAt);
  const today = new Date();

  const diffTime = today - createdDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;

  return createdDate.toLocaleDateString();
}
export default formatPostDate

export function formatPostDateTime(createdAt) {
  const createdDate = new Date(createdAt);
  const now = new Date();

  const diffTime = now - createdDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // format time (hh:mm AM/PM)
  const time = createdDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (diffDays === 0) return `Today at ${time}`;
  if (diffDays === 1) return `Yesterday at ${time}`;
  if (diffDays < 7) return `${diffDays} days ago at ${time}`;

  // full date + time
  const date = createdDate.toLocaleDateString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return `${date} at ${time}`;
}

