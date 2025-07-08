import axios from "axios";
import { logger } from "../../utils/logger";
import { Router } from "express";

const router = Router();
router.get("/auth", async (req, res) => {
  try {
    logger.info("Iniciando autenticación de LinkedIn con método GET...");

    const { code, state } = req.query;
    if (!code) {
      logger.error("Código de autenticación no proporcionado");
      res.status(400).send("Código de autenticación no proporcionado.");
      return;
    }

    logger.info(`Código recibido: ${code}`);
    logger.info(`State recibido: ${state}`);

    // 1️⃣ INTERCAMBIAR CODE POR ACCESS TOKEN
    const tokenResponse = await axios.post(
      "https://www.linkedin.com/oauth/v2/accessToken",
      null,
      {
        params: {
          grant_type: "authorization_code",
          code: code,
          redirect_uri: "https://f53hh0d1-3000.uks1.devtunnels.ms/api/linkedin/auth",
          client_id: "77gb0ro5raeet3",
          client_secret: "WPL_AP1.jhOIJBTqmBZzwmlD.nuf+ZA==",
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;
    const expiresIn = tokenResponse.data.expires_in;

    console.log("✅ ACCESS TOKEN:", accessToken);
    console.log("✅ Expires in:", expiresIn);

    // 2️⃣ OBTENER PERFIL BÁSICO usando OpenID Connect
    const profileResponse = await axios.get(
      "https://api.linkedin.com/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const userId = profileResponse.data.sub; // 'sub' is the user ID in OpenID Connect
    const firstName = profileResponse.data.given_name || "N/A";
    const lastName = profileResponse.data.family_name || "N/A";
    const email = profileResponse.data.email || "N/A";

    console.log("✅ USER ID:", userId);
    console.log("✅ USER NAME:", `${firstName} ${lastName}`);
    console.log("✅ EMAIL:", email);
    console.log("✅ PROFILE DATA:", JSON.stringify(profileResponse.data, null, 2));

    // 🎯 Aquí normalmente guardarías (accessToken, userId) en tu DB
    // Ejemplo: await saveLinkedInTokenForTelegramUser(telegramUserId, userId, accessToken);

    // 4️⃣ Responder al navegador
    res.send(`
      <h2>✅ Autenticación completada</h2>
      <p><strong>Nombre:</strong> ${firstName} ${lastName}</p>
      <p><strong>ID:</strong> ${userId}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p>Puedes cerrar esta ventana. El bot ya puede usar tu cuenta de LinkedIn.</p>
    `);
  } catch (error: any) {
    console.error("❌ Error en la autenticación de LinkedIn:", {
      status: error?.response?.status,
      data: error?.response?.data,
      message: error.message,
    });

    logger.error("Error detallado en LinkedIn auth:", {
      error: error?.response?.data || error.message,
      status: error?.response?.status,
      headers: error?.response?.headers,
    });

    res.status(500).send(`
      <h2>❌ Error en la autenticación de LinkedIn</h2>
      <pre>${error?.response?.data ? JSON.stringify(error.response.data, null, 2) : error.message}</pre>
      <p><strong>Status:</strong> ${error?.response?.status || "N/A"}</p>
      <p><strong>Status Text:</strong> ${error?.response?.statusText || "N/A"}</p>
    `);
  }
});

export default router;
