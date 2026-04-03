const HISTORY_BADGE_KEY = "history_has_new_activity";

export const flagNewActivity = () => {
  localStorage.setItem(HISTORY_BADGE_KEY, "true");
  window.dispatchEvent(new Event("history-activity-updated"));
};

export const clearActivityFlag = () => {
  localStorage.removeItem(HISTORY_BADGE_KEY);
};

export const getActivityFlag = () => {
  return localStorage.getItem(HISTORY_BADGE_KEY) === "true";
};

export { HISTORY_BADGE_KEY };
