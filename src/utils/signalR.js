import { HubConnectionBuilder } from '@microsoft/signalr';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const connection = new HubConnectionBuilder()
  .withUrl(`${BACKEND_URL}datahub`)
  .withAutomaticReconnect()
  .build();
