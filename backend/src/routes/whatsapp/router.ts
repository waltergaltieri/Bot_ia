import express from 'express'
import { requireAuth, AuthenticatedRequest } from '../../middlewares/auth'
import axios from 'axios'

const router = express.Router()

// Obtener estado de WhatsApp
router.get('/status', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    // Mock data - en producción sería una consulta al estado real de WhatsApp
    const status = {
      isConnected: true,
      phoneNumber: '+1234567890',
      lastSeen: new Date().toISOString(),
      companyId: req.user?.companyId,
    }
    
    res.json(status)
  } catch (error) {
    res.status(500).json({ error: 'Error fetching WhatsApp status' })
  }
})

// Enviar mensaje
router.post('/send', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { to, message } = req.body
    
    if (!to || !message) {
      res.status(400).json({ error: 'To and message are required' })
      return
    }
    
    // Mock response - en producción sería una llamada a la API de WhatsApp
    const response = {
      id: `msg-${Date.now()}`,
      to,
      message,
      status: 'sent',
      sentAt: new Date().toISOString(),
      companyId: req.user?.companyId,
    }
    
    res.json(response)
  } catch (error) {
    res.status(500).json({ error: 'Error sending message' })
  }
})


export default router 