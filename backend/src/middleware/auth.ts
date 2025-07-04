import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { supabase } from '../services/supabase';
import { logger } from '../utils/logger';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    companyId: string;
    role: string;
  };
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({ error: 'Token de acceso requerido' });
      return;
    }

    const decoded = jwt.verify(token, config.jwt.secret) as any;
    
    // Verificar que el usuario existe en la base de datos
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, company_id, role')
      .eq('id', decoded.userId)
      .single();

    if (error || !user) {
      res.status(401).json({ error: 'Token inválido' });
      return;
    }

    req.user = {
      id: user.id,
      email: user.email,
      companyId: user.company_id,
      role: user.role,
    };

    next();
  } catch (error) {
    logger.error('Error en autenticación:', error);
    res.status(401).json({ error: 'Token inválido' });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: 'Permisos insuficientes' });
      return;
    }

    next();
  };
};

// Nuevo middleware para verificar permisos específicos de Super Admin
export const requireSuperAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ error: 'Usuario no autenticado' });
    return;
  }

  if (req.user.role !== 'super_admin') {
    res.status(403).json({ error: 'Solo Super Admins pueden acceder a este recurso' });
    return;
  }

  next();
};

// Nuevo middleware para verificar acceso a datos de empresa
export const requireCompanyAccess = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'Usuario no autenticado' });
    return;
  }

  const { companyId } = req.params;
  
  // Super Admin puede acceder a cualquier empresa
  if (req.user.role === 'super_admin') {
    next();
    return;
  }

  // Branch Manager y otros roles solo pueden acceder a su propia empresa
  if (companyId && req.user.companyId !== companyId) {
    res.status(403).json({ error: 'No tienes permisos para acceder a esta empresa' });
    return;
  }

  next();
};

// Alias para authenticateToken para mayor claridad
export const requireAuth = authenticateToken; 