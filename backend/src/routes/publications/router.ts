import express from 'express'
import { requireAuth, AuthenticatedRequest } from '../middleware/auth'

const router = express.Router()

// Obtener publicaciones
router.get('/', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    // Mock data - en producción sería una consulta a la base de datos
    const publications = [
      {
        id: 'pub-1',
        title: 'Publicación de ejemplo',
        content: 'Contenido de ejemplo',
        companyId: req.user?.companyId,
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]
    
    res.json(publications)
  } catch (error) {
    res.status(500).json({ error: 'Error fetching publications' })
  }
})

// Crear nueva publicación
router.post('/', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { title, content } = req.body
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' })
    }
    
    const newPublication = {
      id: `pub-${Date.now()}`,
      title,
      content,
      companyId: req.user?.companyId,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    res.status(201).json(newPublication)
  } catch (error) {
    res.status(500).json({ error: 'Error creating publication' })
  }
})

export default router 