export const filterByTimeRange = (sessions, range) => {
  const now = new Date();
  const filtered = sessions.filter(s => {
    const date = new Date(s.startedAt);

    if (range === "week") {
      return date >= new Date(now - 7 * 24 * 60 * 60 * 1000);
    }
    if (range === "month") {
      return date >= new Date(now - 30 * 24 * 60 * 60 * 1000);
    }
    return true;
  });

  return filtered;
};

export const computeStats = (sessions) => {
  let totalMinutes = 0;
  let completedCount = 0;

  sessions.forEach(s => {
    if (s.completed) {
      totalMinutes += s.duration;
      completedCount++;
    }
  });

  return { totalMinutes, completedCount };
};
