import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config';
import { logger } from '../utils/logger';
import { createError } from '../middleware/error-handler';
import { strictRateLimit } from '../middleware/rate-limit';
import UserService from '../services/UserService';
import CompanyService from '../services/CompanyService';

const router = Router();

// Login
router.post('/login', strictRateLimit, async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw createError('Email y contraseña son requeridos', 400);
    }

    // Buscar usuario
    const user = await UserService.findByEmail(email.toLowerCase());
    
    if (!user) {
      throw createError('Credenciales inválidas', 401);
    }

    if (!user.is_active) {
      throw createError('Cuenta desactivada', 401);
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      throw createError('Credenciales inválidas', 401);
    }

    // Generar JWT
    const payload = {
      userId: user.id,
      email: user.email,
      companyId: user.company_id,
      role: user.role,
    };
    
    const token = jwt.sign(payload, config.jwt.secret, {
      expiresIn: '7d', // Use a literal string instead of config
    });

    logger.info(`Usuario autenticado: ${user.email}`);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        companyId: user.company_id,
        role: user.role,
      },
    });
  } catch (error: any) {
    logger.error('Error en login:', error);
    res.status(error.statusCode || 500).json({ 
      error: error.message || 'Error en el login' 
    });
  }
});

// Registro (solo para admins de empresa)
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { 
      email, 
      password, 
      name, 
      companyName, 
      phone 
    } = req.body;

    if (!email || !password || !name || !companyName) {
      throw createError('Todos los campos son requeridos', 400);
    }

    // Verificar si el email ya existe
    const existingUser = await UserService.findByEmail(email.toLowerCase());

    if (existingUser) {
      throw createError('El email ya está registrado', 409);
    }

    // Hash de la contraseña
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Crear empresa primero
    const company = await CompanyService.create({
      name: companyName,
      is_active: true,
    });

    try {
      // Crear usuario branch_manager (anteriormente admin)
      const user = await UserService.create({
        email: email.toLowerCase(),
        password_hash: passwordHash,
        name,
        phone: phone || undefined,
        company_id: company.id,
        role: 'branch_manager',
        is_active: true,
      });

      // Actualizar la empresa con el branch_manager_id
      await CompanyService.update(company.id, { branch_manager_id: user.id });

      logger.info(`Nueva empresa registrada: ${companyName} por ${email}`);

      res.status(201).json({
        message: 'Empresa y usuario creados exitosamente',
        user: {
          id: user.id,
          email: user.email,
          companyId: user.company_id,
          role: user.role,
        },
      });
    } catch (userError) {
      // Rollback: eliminar empresa si falla la creación del usuario
      await CompanyService.delete(company.id);
      throw userError;
    }
  } catch (error: any) {
    logger.error('Error en registro:', error);
    res.status(error.statusCode || 500).json({ 
      error: error.message || 'Error en el registro' 
    });
  }
});

// Nuevo endpoint para crear Super Admin (solo para desarrollo inicial)
router.post('/create-super-admin', async (req: Request, res: Response) => {
  try {
    const { 
      email, 
      password, 
      name, 
      phone 
    } = req.body;

    if (!email || !password || !name) {
      throw createError('Email, contraseña y nombre son requeridos', 400);
    }

    // Verificar si ya existe un super admin
    const existingSuperAdmin = await UserService.findByRole('super_admin');

    if (existingSuperAdmin) {
      throw createError('Ya existe un Super Admin en el sistema', 409);
    }

    // Verificar si el email ya existe
    const existingUser = await UserService.findByEmail(email.toLowerCase());

    if (existingUser) {
      throw createError('El email ya está registrado', 409);
    }

    // Hash de la contraseña
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Crear empresa matriz para Super Admin
    const company = await CompanyService.create({
      name: 'Empresa Matriz',
      description: 'Empresa matriz para Super Admin',
      is_active: true,
    });

    try {
      // Crear usuario super_admin
      const user = await UserService.create({
        email: email.toLowerCase(),
        password_hash: passwordHash,
        name,
        phone: phone || undefined,
        company_id: company.id,
        role: 'super_admin',
        is_active: true,
      });

      logger.info(`Super Admin creado: ${email}`);

      res.status(201).json({
        message: 'Super Admin creado exitosamente',
        user: {
          id: user.id,
          email: user.email,
          companyId: user.company_id,
          role: user.role,
        },
      });
    } catch (userError) {
      // Rollback: eliminar empresa si falla la creación del usuario
      await CompanyService.delete(company.id);
      throw userError;
    }
  } catch (error: any) {
    logger.error('Error creando Super Admin:', error);
    res.status(error.statusCode || 500).json({ 
      error: error.message || 'Error creando Super Admin' 
    });
  }
});

export default router; 