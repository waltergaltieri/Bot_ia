import express from 'express'
import { requireAuth, requireSuperAdmin } from '../middleware/auth'

const router = express.Router()

// Obtener todas las empresas (Solo Super Admin)
router.get('/', requireAuth, requireSuperAdmin, async (req, res) => {
  try {
    // Mock data - en producción sería una consulta a la base de datos
    const companies = [
      {
        id: 'company-1',
        name: 'TechStart Solutions',
        email: 'admin@techstart.com',
        phone: '+1234567890',
        address: '123 Tech Street',
        parentCompanyId: 'parent-company-1',
        branchManagerId: 'user-2',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]
    
    res.json(companies)
  } catch (error) {
    res.status(500).json({ error: 'Error fetching companies' })
  }
})

// Crear nueva empresa (Solo Super Admin)
router.post('/', requireAuth, requireSuperAdmin, async (req, res) => {
  try {
    const { name, email, phone, address, branchManagerId } = req.body
    
    // Validaciones básicas
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' })
    }
    
    // Mock response - en producción sería una inserción en la base de datos
    const newCompany = {
      id: `company-${Date.now()}`,
      name,
      email,
      phone,
      address,
      parentCompanyId: 'parent-company-1',
      branchManagerId,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    res.status(201).json(newCompany)
  } catch (error) {
    res.status(500).json({ error: 'Error creating company' })
  }
})

export default router 