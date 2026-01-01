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