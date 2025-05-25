import axios from "axios";
import { API_BASE_URL } from "../../../apiConfig.ts";

const SMS_FEATURE_URL = `${API_BASE_URL}/sms-feature`;

export interface SmsFeatureStatus {
  isEnabled: boolean;
}

// Status abrufen
// @ts-ignore
export const fetchSmsFeatureStatus = async (): Promise<SmsFeatureStatus> => {
  try {
    const response = await axios.get<SmsFeatureStatus>(SMS_FEATURE_URL);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Status setzen
export const setSmsFeatureStatus = async (isEnabled: boolean): Promise<void> => {
  try {
    await axios.post(SMS_FEATURE_URL, isEnabled, {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    handleError(error);
  }
};

const handleError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? 'Unknown';
    const message = error.response?.data?.message ?? error.message;
    throw new Error(`Error ${status}: ${message}`);
  }
  throw new Error(`Unexpected error: ${error}`);
};