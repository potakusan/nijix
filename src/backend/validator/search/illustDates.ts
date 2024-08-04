import dayjs from "dayjs";

export const validateDates = (
  sinceDate: string | null,
  untilDate: string | null
) => {
  if (sinceDate) {
    if (!dayjs(sinceDate).isValid()) {
      return false;
    }
  }
  if (untilDate) {
    if (!dayjs(untilDate).isValid()) {
      return false;
    }
  }
  return true;
};
