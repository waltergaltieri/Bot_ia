import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { supabase } from '../services/supabase';
import { logger } from '../utils/logger';
import { createError } from '../middleware/error-handler';
import { strictRateLimit } from '../middleware/rate-limit';

const router = Router();

// Login
router.post('/login', strictRateLimit, async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw createError('Email y contraseña son requeridos', 400);
    }

    // Buscar usuario
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, password_hash, company_id, role, is_active')
      .eq('email', email.toLowerCase())
      .single();

    if (error || !user) {
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
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        companyId: user.company_id,
        role: user.role,
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

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
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existingUser) {
      throw createError('El email ya está registrado', 409);
    }

    // Hash de la contraseña
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Crear empresa primero
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .insert({
        name: companyName,
        is_active: true,
      })
      .select()
      .single();

    if (companyError || !company) {
      throw createError('Error al crear la empresa', 500);
    }

    // Crear usuario branch_manager (anteriormente admin)
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({
        email: email.toLowerCase(),
        password_hash: passwordHash,
        name,
        phone: phone || null,
        company_id: company.id,
        role: 'branch_manager',
        is_active: true,
      })
      .select('id, email, company_id, role')
      .single();

    if (userError || !user) {
      // Rollback: eliminar empresa si falla la creación del usuario
      await supabase.from('companies').delete().eq('id', company.id);
      throw createError('Error al crear el usuario', 500);
    }

    // Actualizar la empresa con el branch_manager_id
    await supabase
      .from('companies')
      .update({ branch_manager_id: user.id })
      .eq('id', company.id);

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
    const { data: existingSuperAdmin } = await supabase
      .from('users')
      .select('id')
      .eq('role', 'super_admin')
      .single();

    if (existingSuperAdmin) {
      throw createError('Ya existe un Super Admin en el sistema', 409);
    }

    // Verificar si el email ya existe
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existingUser) {
      throw createError('El email ya está registrado', 409);
    }

    // Hash de la contraseña
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Crear empresa matriz para Super Admin
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .insert({
        name: 'Empresa Matriz',
        description: 'Empresa matriz para Super Admin',
        is_active: true,
      })
      .select()
      .single();

    if (companyError || !company) {
      throw createError('Error al crear la empresa matriz', 500);
    }

    // Crear usuario super_admin
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({
        email: email.toLowerCase(),
        password_hash: passwordHash,
        name,
        phone: phone || null,
        company_id: company.id,
        role: 'super_admin',
        is_active: true,
      })
      .select('id, email, company_id, role')
      .single();

    if (userError || !user) {
      // Rollback: eliminar empresa si falla la creación del usuario
      await supabase.from('companies').delete().eq('id', company.id);
      throw createError('Error al crear el Super Admin', 500);
    }

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
  } catch (error) {
    logger.error('Error creando Super Admin:', error);
    res.status(error.statusCode || 500).json({ 
      error: error.message || 'Error creando Super Admin' 
    });
  }
});

export default router; 