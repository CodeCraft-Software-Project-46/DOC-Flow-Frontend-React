import API from "./axios"; //shared axios instance (baseURL from VITE_API_BASE_URL), same as analyticsApi.ts/chatService.ts
import type { WorkingHoursConfig } from "../types";

const BASE_URL = "/api/working-hours";

/* Backend type */
interface BackendWorkingHours {
  work_start_time: string; //infrontend workStartTime camelCase but backend work_start_time snake_case.
  work_end_time: string;
  work_days: number[];
  holidays: string[];
}

/* Mappers */
// No time_zone: the system only ever runs in Sri Lanka, so the backend
// always interprets the calendar as Asia/Colombo and doesn't store one.
const toFrontend = (data: BackendWorkingHours): WorkingHoursConfig => ({
  workStartTime: data.work_start_time.slice(0, 5),
  workEndTime: data.work_end_time.slice(0, 5), // "17:00:00" → "17:00" (frontend doesn't need seconds)     slice(0,5) 0 included
  workDays: data.work_days,
  holidays: data.holidays,
});

const toBackend = (data: WorkingHoursConfig) => ({
  work_start_time: `${data.workStartTime}:00`, //"09:00" → "09:00:00" (backend expects seconds because db standard HH:MM:SS)     "14:30" → "14:30:00"
  work_end_time: `${data.workEndTime}:00`,
  work_days: data.workDays,
  holidays: data.holidays,
});

/* API */
export const getWorkingHours = async (): Promise<WorkingHoursConfig | null> => { //this func returns either a WorkingHoursConfig object (if config exists) or null (if no config in DB)
  const res = await API.get(`${BASE_URL}/config/`);
  return res.data.exists ? toFrontend(res.data.data) : null;
};

// backend sends 
// {
//   "exists": true,
//   "data": { ... }
// }

// or

// {
//   "exists": false
// }

export const saveWorkingHours = async (
  data: WorkingHoursConfig
): Promise<WorkingHoursConfig> => {
  const res = await API.post(`${BASE_URL}/config/save/`, toBackend(data));
  return toFrontend(res.data.data); //Backend saves + returns updated data
   //Convert response back to frontend format. So parent can do setConfig(result); 👉 UI instantly updates after save
};

