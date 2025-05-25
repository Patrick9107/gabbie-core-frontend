import axios from 'axios';
import { API_BASE_URL } from '../../../apiConfig.ts';
import { SmsTemplate } from '../../domain/SmsTemplate.ts';

const SMS_TEMPLATE_URL = `${API_BASE_URL}/Sms/template`;

export const getAllSmsTemplates = async (): Promise<SmsTemplate[]> => {
  try {
    const response = await axios.get<SmsTemplate[]>(SMS_TEMPLATE_URL);
    return response.data;
  } catch (error) {
    handleError(error);
    return [];
  }
};

// todo evtl. anpassen @jakub
export const setSmsFlag = async (isEnabled: boolean): Promise<void> => {
  try {
    console.log("API CALL mit enabled=" + isEnabled)
    await axios.put(SMS_TEMPLATE_URL, { enabled: isEnabled });
  } catch (error) {
    const message = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : String(error);
    throw new Error(`Fehler beim Setzen des SMS-Aktivierungsstatus auf ${isEnabled}: ${message}`);
  }
};

export const getSmsTemplateById = async (id: string): Promise<SmsTemplate> => {
  try {
    const response = await axios.get<SmsTemplate>(`${SMS_TEMPLATE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Fehler beim laden des SMS templates mit der ID: ${id}: ${axios.isAxiosError(error) ? error.response?.data?.message || error.message : error}`);

  }
};

export const createSmsTemplate = async (template: SmsTemplate): Promise<SmsTemplate> => {
  try {
    const { id: _id, ...newTemplate } = template;
    const response = await axios.post<SmsTemplate>(SMS_TEMPLATE_URL, newTemplate);
    return response.data;
  } catch (error) {
    throw new Error(`Fehler beim Erstellen des SMS-Templates: ${axios.isAxiosError(error) ? error.response?.data?.message || error.message : error}`);
  }
};

export const updateSmsTemplate = async (template: SmsTemplate): Promise<SmsTemplate> => {
  try {
    const { id, ...updatedTemplate } = template;
    const response = await axios.put<SmsTemplate>(`${SMS_TEMPLATE_URL}/${id}`, updatedTemplate);
    return response.data;
  } catch (error) {
    throw new Error(`Fehler beim Aktualisieren des SMS-Templates mit der ID: ${template.id}: ${axios.isAxiosError(error) ? error.response?.data?.message || error.message : error}`);
  }
};

export const deleteSmsTemplate = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${SMS_TEMPLATE_URL}/${id}`);
  } catch (error) {
    throw new Error(`Fehler beim Löschen des SMS-Templates mit der ID: ${id}: ${axios.isAxiosError(error) ? error.response?.data?.message || error.message : error}`);
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
