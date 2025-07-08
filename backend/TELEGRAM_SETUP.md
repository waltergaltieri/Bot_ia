# Configuración del Bot de Telegram

## Variables de Entorno Requeridas

Asegúrate de tener las siguientes variables en tu archivo `.env`:

```env
# Token del bot de Telegram (obtenido de @BotFather)
TELEGRAM_BOT_TOKEN="tu_token_aqui"

# URL donde Telegram enviará los webhooks
SERVER_TELEGRAM_WEBHOOK="https://tu-dominio.com/api/telegram/webhook"

# URL base de la API de Telegram (opcional)
TELEGRAM_BASE_URL="https://api.telegram.org/bot"
```

## Configuración del Webhook

### Método 1: Usando el script automático
```bash
cd backend
npm run setup-telegram
```

### Método 2: Usando la API REST

#### Configurar webhook:
```bash
curl -X POST http://localhost:3000/api/telegram/setup-webhook
```

#### Obtener información del webhook:
```bash
curl http://localhost:3000/api/telegram/webhook-info
```

#### Eliminar webhook:
```bash
curl -X DELETE http://localhost:3000/api/telegram/webhook
```

#### Obtener información del bot:
```bash
curl http://localhost:3000/api/telegram/bot-info
```

## Pasos para Crear un Bot de Telegram

1. **Habla con @BotFather** en Telegram
2. **Crea un nuevo bot**: `/newbot`
3. **Elige un nombre** para tu bot
4. **Elige un username** que termine en "bot"
5. **Copia el token** que te proporciona BotFather
6. **Configura las variables de entorno** en tu archivo `.env`

## Funcionalidades Implementadas

### Webhook Handler
- ✅ Recibe mensajes de texto
- ✅ Envía respuestas automáticas
- ✅ Muestra estado de "typing"
- ✅ Maneja callback queries (botones inline)
- ✅ Logging completo de eventos

### API Endpoints
- `POST /api/telegram/setup-webhook` - Configura el webhook
- `GET /api/telegram/webhook-info` - Información del webhook
- `DELETE /api/telegram/webhook` - Elimina el webhook  
- `GET /api/telegram/bot-info` - Información del bot
- `POST /api/telegram/webhook` - Endpoint para recibir mensajes

### Servicios
- `TelegramBotService` - Servicio completo para interactuar con la API de Telegram
- Métodos disponibles:
  - `sendMessage()` - Enviar mensajes
  - `setWebhook()` - Configurar webhook
  - `getWebhookInfo()` - Obtener info del webhook
  - `deleteWebhook()` - Eliminar webhook
  - `getMe()` - Información del bot
  - `sendChatAction()` - Enviar acciones de chat

## Uso en Desarrollo

1. **Instala las dependencias**:
   ```bash
   npm install
   ```

2. **Configura tu túnel** (para desarrollo local):
   ```bash
   # Ejemplo con ngrok
   ngrok http 3000
   
   # Actualiza SERVER_TELEGRAM_WEBHOOK con la URL de ngrok
   SERVER_TELEGRAM_WEBHOOK="https://tu-id.ngrok.io/api/telegram/webhook"
   ```

3. **Inicia el servidor**:
   ```bash
   npm run dev
   ```

4. **Configura el webhook**:
   ```bash
   npm run setup-telegram
   ```

5. **Prueba enviando mensajes** a tu bot en Telegram

## Troubleshooting

### Error: "webhook is not set"
- Asegúrate de que `SERVER_TELEGRAM_WEBHOOK` esté correctamente configurado
- Ejecuta `npm run setup-telegram` para configurar el webhook

### Error: "Unauthorized"
- Verifica que `TELEGRAM_BOT_TOKEN` sea correcto
- Asegúrate de que el token sea válido y el bot esté activo

### Error: "Bad Request: bad webhook"
- Verifica que la URL del webhook sea accesible desde internet
- Asegúrate de que use HTTPS (requerido por Telegram)

### Los mensajes no llegan al webhook
- Verifica que el webhook esté correctamente configurado
- Comprueba los logs del servidor
- Usa `GET /api/telegram/webhook-info` para verificar el estado

## Producción

Para producción, asegúrate de:
- Usar HTTPS para la URL del webhook
- Configurar un dominio estable
- Configurar logs persistentes
- Implementar manejo de errores robusto
