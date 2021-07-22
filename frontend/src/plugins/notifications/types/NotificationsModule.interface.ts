import NotificationOptions from "./NotificationOptions.interface";

export default interface NotificationsModule {
  show: (message: string, title?: string, options?: NotificationOptions) => void;
  success: (message: string, title?: string, options?: NotificationOptions) => void;
  error: (message: string, title?: string, options?: NotificationOptions) => void;
  info: (message: string, title?: string, options?: NotificationOptions) => void;
  warning: (message: string, title?: string, options?: NotificationOptions) => void;
}
