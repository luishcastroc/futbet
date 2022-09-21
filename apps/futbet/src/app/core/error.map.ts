export const errorMap = new Map([
  ['auth/user-not-found', 'Usuario no encontrado, verificar.'],
  ['auth/wrong-password', 'Usuario o Contraseña no válidos, verificar.'],
  ['auth/internal-error', 'Error en el servidor, verificar'],
  [
    'auth/expired-action-code',
    'el código expiro, usa restablecer de nuevo para generar otro.',
  ],
  [
    'auth/popup-closed-by-user',
    'El usuario cerró la ventana antes de finalizar la operación.',
  ],
  ['auth/network-request-failed', 'Favor de checar tu conexión a internet.'],
  ['auth/user-disabled', 'Tu usuario ha sido desactivado, verificar.'],
  [
    'auth/email-already-exists',
    'El correo electrónico ya existe favor de verificar.',
  ],
]);
