import express from 'express'
import { requireAuth, AuthenticatedRequest } from '../middleware/auth'

const router = express.Router()

// Obtener métricas
router.get('/', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    // Mock data - en producción sería una consulta a la base de datos
    const metrics = {
      totalUsers: 150,
      activeUsers: 120,
      totalPublications: 85,
      publishedPosts: 45,
      engagement: 78.5,
      companyId: req.user?.companyId,
    }
    
    res.json(metrics)
  } catch (error) {
    res.status(500).json({ error: 'Error fetching metrics' })
  }
})

// Obtener métricas por período
router.get('/period/:period', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { period } = req.params
    
    // Mock data - en producción sería una consulta a la base de datos
    const periodMetrics = {
      period,
      data: [
        { date: '2024-01-01', value: 100 },
        { date: '2024-01-02', value: 120 },
        { date: '2024-01-03', value: 95 },
      ],
      companyId: req.user?.companyId,
    }
    
    res.json(periodMetrics)
  } catch (error) {
    res.status(500).json({ error: 'Error fetching period metrics' })
  }
})

export default router 