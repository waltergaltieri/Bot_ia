import express from 'express'
import { requireAuth, requireCompanyAccess, AuthenticatedRequest } from '../middleware/auth'

const router = express.Router()

// Obtener equipos
router.get('/', requireAuth, async (req, res) => {
  try {
    // Mock data - en producción sería una consulta a la base de datos
    const teams = [
      {
        id: 'team-1',
        name: 'Equipo de Ventas',
        companyId: 'company-1',
        managerId: 'user-3',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]
    
    res.json(teams)
  } catch (error) {
    res.status(500).json({ error: 'Error fetching teams' })
  }
})

// Crear nuevo equipo
router.post('/', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { name, managerId } = req.body
    
    if (!name) {
      return res.status(400).json({ error: 'Team name is required' })
    }
    
    const newTeam = {
      id: `team-${Date.now()}`,
      name,
      companyId: req.user?.companyId,
      managerId,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    res.status(201).json(newTeam)
  } catch (error) {
    res.status(500).json({ error: 'Error creating team' })
  }
})

export default router 