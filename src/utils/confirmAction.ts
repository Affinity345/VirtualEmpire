import { Alert, Platform } from 'react-native';

export const confirmAction = (title: string, message: string, onConfirm: () => void) => {
  if (Platform.OS === 'web' && typeof globalThis.confirm === 'function') {
    if (globalThis.confirm(`${title}\n\n${message}`)) {
      onConfirm();
    }
    return;
  }

  Alert.alert(title, message, [
    { text: 'Annuler', style: 'cancel' },
    { text: 'Confirmer', style: 'destructive', onPress: onConfirm },
  ]);
};
