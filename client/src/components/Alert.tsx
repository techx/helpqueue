import Alert from "react-s-alert";

export enum AlertType {
  Success,
  Warning,
  Error
}

const createAlert = (type: AlertType, message: string) => {
  switch (type) {
    case AlertType.Success:
      Alert.success(message, ALERT_SETTINGS);
      break;
    case AlertType.Warning:
      Alert.warning(message, ALERT_SETTINGS);
      break;
    case AlertType.Error:
      Alert.error(message, ALERT_SETTINGS);
      break;
    default:
      break;
  }
};
const ALERT_SETTINGS = {
  position: "top-right",
  effect: "slide",
  beep: false,
  timeout: 3000,
  offset: 50
};

export default createAlert;
