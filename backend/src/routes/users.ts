import express from 'express'
import { requireAuth, AuthenticatedRequest } from '../middleware/auth'

const router = express.Router()

// Obtener usuarios
router.get('/', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    // Mock data - en producción sería una consulta a la base de datos
    const users = [
      {
        id: 'user-1',
        email: 'superadmin@global.com',
        name: 'Super Admin',
        companyId: 'parent-company-1',
        role: 'super_admin',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]
    
    res.json(users)
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' })
  }
})

// Crear nuevo usuario
router.post('/', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { email, name, role } = req.body
    
    if (!email || !name || !role) {
      return res.status(400).json({ error: 'Email, name, and role are required' })
    }
    
    const newUser = {
      id: `user-${Date.now()}`,
      email,
      name,
      companyId: req.user?.companyId,
      role,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    res.status(201).json(newUser)
  } catch (error) {
    res.status(500).json({ error: 'Error creating user' })
  }
})

export default router 