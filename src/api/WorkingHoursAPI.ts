import axios from "axios";
import type { WorkingHoursConfig } from "../types";

const BASE_URL = "http://127.0.0.1:8000/api/working-hours";

/* Backend type */
interface BackendWorkingHours {
  work_start_time: string;
  work_end_time: string;
  work_days: number[];
  holidays: string[];
  time_zone: string;
}

/* Mappers */
const toFrontend = (data: BackendWorkingHours): WorkingHoursConfig => ({
  workStartTime: data.work_start_time.slice(0, 5),
  workEndTime: data.work_end_time.slice(0, 5),
  workDays: data.work_days,
  holidays: data.holidays,
  timeZone: data.time_zone,
});

const toBackend = (data: WorkingHoursConfig) => ({
  work_start_time: `${data.workStartTime}:00`,
  work_end_time: `${data.workEndTime}:00`,
  work_days: data.workDays,
  holidays: data.holidays,
  time_zone: data.timeZone,
});

/* API */
export const getWorkingHours = async (): Promise<WorkingHoursConfig | null> => {
  const res = await axios.get(`${BASE_URL}/config/`);
  return res.data.exists ? toFrontend(res.data.data) : null;
};

export const saveWorkingHours = async (
  data: WorkingHoursConfig
): Promise<WorkingHoursConfig> => {
  const res = await axios.post(`${BASE_URL}/config/save/`, toBackend(data));
  return toFrontend(res.data.data);
};