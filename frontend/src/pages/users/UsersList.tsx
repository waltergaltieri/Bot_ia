import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Plus, Search, Filter, Edit, Trash2, Mail, Phone, Shield } from 'lucide-react'
import api from '../../services/api'
import { User } from '../../types'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Table from '../../components/ui/Table'
import Modal from '../../components/ui/Modal'
import toast from 'react-hot-toast'

const UsersList: React.FC = () => {
  const { user: currentUser } = useAuth()
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; userId?: string }>({
    isOpen: false,
  })

  const { data: users, isLoading } = useQuery(
    ['users', currentUser?.companyId],
    async () => {
      const response = await api.get('/users')
      return response.data
    },
    {
      enabled: !!currentUser?.companyId,
    }
  )

  const deleteMutation = useMutation(
    (userId: string) => api.delete(`/users/${userId}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['users'])
        toast.success('Usuario eliminado correctamente')
        setDeleteModal({ isOpen: false })
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.error || 'Error al eliminar usuario')
      },
    }
  )

  const toggleStatusMutation = useMutation(
    ({ userId, isActive }: { userId: string; isActive: boolean }) =>
      api.patch(`/users/${userId}/status`, { isActive }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['users'])
        toast.success('Estado del usuario actualizado')
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.error || 'Error al actualizar estado')
      },
    }
  )

  const filteredUsers = users?.filter((user: User) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phone && user.phone.includes(searchTerm))
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    
    return matchesSearch && matchesRole
  }) || []

  const handleDelete = () => {
    if (deleteModal.userId) {
      deleteMutation.mutate(deleteModal.userId)
    }
  }

  const handleToggleStatus = (userId: string, currentStatus: boolean) => {
    toggleStatusMutation.mutate({ userId, isActive: !currentStatus })
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-red-100 text-red-800'
      case 'branch_manager':
        return 'bg-purple-100 text-purple-800'
      case 'manager':
        return 'bg-blue-100 text-blue-800'
      case 'employee':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin'
      case 'branch_manager':
        return 'Gerente de Sucursal'
      case 'manager':
        return 'Manager'
      case 'employee':
        return 'Empleado'
      default:
        return role
    }
  }

  const columns = [
    {
      key: 'name',
      header: 'Usuario',
      sortable: true,
      render: (user: User) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-sm">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{user.name}</p>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Mail className="w-3 h-3" />
              <span>{user.email}</span>
            </div>
            {user.phone && (
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Phone className="w-3 h-3" />
                <span>{user.phone}</span>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Rol',
      render: (user: User) => (
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-gray-400" />
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}
          >
            {getRoleLabel(user.role)}
          </span>
        </div>
      ),
    },
    {
      key: 'teamId',
      header: 'Equipo',
      render: (user: User) => (
        <span className="text-sm text-gray-900">
          {user.teamId ? `Equipo ${user.teamId}` : 'Sin asignar'}
        </span>
      ),
    },
    {
      key: 'isActive',
      header: 'Estado',
      render: (user: User) => (
        <button
          onClick={() => handleToggleStatus(user.id, user.isActive)}
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
            user.isActive
              ? 'bg-green-100 text-green-800 hover:bg-green-200'
              : 'bg-red-100 text-red-800 hover:bg-red-200'
          }`}
        >
          {user.isActive ? 'Activo' : 'Inactivo'}
        </button>
      ),
    },
    {
      key: 'createdAt',
      header: 'Fecha de registro',
      sortable: true,
      render: (user: User) => (
        <span className="text-sm text-gray-500">
          {new Date(user.createdAt).toLocaleDateString('es-ES')}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Acciones',
      render: (user: User) => (
        <div className="flex space-x-2">
          <Link to={`/users/${user.id}`}>
            <Button variant="ghost" size="sm">
              Ver
            </Button>
          </Link>
          {(currentUser?.role === 'branch_manager' || currentUser?.role === 'super_admin') && (
            <>
              <Link to={`/users/${user.id}/edit`}>
                <Button variant="ghost" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDeleteModal({ isOpen: true, userId: user.id })}
                disabled={user.id === currentUser?.id}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
          <p className="text-gray-600">
            Gestiona los usuarios de tu empresa ({filteredUsers.length} usuarios)
          </p>
        </div>
        
        {(currentUser?.role === 'branch_manager' || currentUser?.role === 'super_admin') && (
          <Link to="/users/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Usuario
            </Button>
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Buscar por nombre, email o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              aria-label="Filtrar por rol"
              className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            >
              <option value="all">Todos los roles</option>
              <option value="super_admin">Super Admins</option>
              <option value="branch_manager">Gerentes de Sucursal</option>
              <option value="manager">Managers</option>
              <option value="employee">Empleados</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Usuarios', value: users?.length || 0, color: 'blue' },
          { 
            label: 'Super Admins', 
            value: users?.filter((u: User) => u.role === 'super_admin').length || 0, 
            color: 'red' 
          },
          { 
            label: 'Gerentes de Sucursal', 
            value: users?.filter((u: User) => u.role === 'branch_manager').length || 0, 
            color: 'purple' 
          },
          { 
            label: 'Managers', 
            value: users?.filter((u: User) => u.role === 'manager').length || 0, 
            color: 'green' 
          },
          { 
            label: 'Empleados', 
            value: users?.filter((u: User) => u.role === 'employee').length || 0, 
            color: 'yellow' 
          },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <p className="text-sm font-medium text-gray-600">{stat.label}</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <Table
        data={filteredUsers}
        columns={columns}
        loading={isLoading}
        emptyMessage="No hay usuarios registrados"
      />

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false })}
        title="Eliminar Usuario"
        footer={
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ isOpen: false })}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              loading={deleteMutation.isLoading}
              onClick={handleDelete}
            >
              Eliminar
            </Button>
          </div>
        }
      >
        <p className="text-gray-600">
          ¿Estás seguro de que quieres eliminar este usuario? Esta acción no se puede deshacer y se eliminarán todos los datos asociados.
        </p>
      </Modal>
    </div>
  )
}

export default UsersList 