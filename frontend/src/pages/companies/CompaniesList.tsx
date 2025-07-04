import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Plus, Search, Filter, Edit, Trash2, Building2, Users, Calendar, Activity } from 'lucide-react'
import api from '../../services/api'
import { Company } from '../../types'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Table from '../../components/ui/Table'
import Modal from '../../components/ui/Modal'
import toast from 'react-hot-toast'

const CompaniesList: React.FC = () => {
  const { user: currentUser } = useAuth()
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; companyId?: string }>({
    isOpen: false,
  })

  // Solo Super Admin puede acceder a esta página
  if (currentUser?.role !== 'super_admin') {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">No tienes permisos para acceder a esta página</p>
      </div>
    )
  }

  const { data: companies, isLoading } = useQuery(
    ['companies'],
    async () => {
      const response = await api.get('/companies')
      return response.data
    }
  )

  const deleteMutation = useMutation(
    (companyId: string) => api.delete(`/companies/${companyId}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['companies'])
        toast.success('Empresa eliminada correctamente')
        setDeleteModal({ isOpen: false })
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.error || 'Error al eliminar empresa')
      },
    }
  )

  const toggleStatusMutation = useMutation(
    ({ companyId, isActive }: { companyId: string; isActive: boolean }) =>
      api.patch(`/companies/${companyId}/status`, { isActive }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['companies'])
        toast.success('Estado de la empresa actualizado')
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.error || 'Error al actualizar estado')
      },
    }
  )

  const filteredCompanies = companies?.filter((company: Company) => {
    const matchesSearch = 
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (company.description && company.description.toLowerCase().includes(searchTerm.toLowerCase()))
    
    return matchesSearch
  }) || []

  const handleDelete = () => {
    if (deleteModal.companyId) {
      deleteMutation.mutate(deleteModal.companyId)
    }
  }

  const handleToggleStatus = (companyId: string, currentStatus: boolean) => {
    toggleStatusMutation.mutate({ companyId, isActive: !currentStatus })
  }

  const columns = [
    {
      key: 'name',
      header: 'Empresa',
      sortable: true,
      render: (company: Company) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{company.name}</p>
            {company.description && (
              <p className="text-sm text-gray-500">{company.description}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'branchManagerId',
      header: 'Gerente de Sucursal',
      render: (company: Company) => (
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-900">
            {company.branchManagerId ? 'Asignado' : 'Sin asignar'}
          </span>
        </div>
      ),
    },
    {
      key: 'isActive',
      header: 'Estado',
      render: (company: Company) => (
        <button
          onClick={() => handleToggleStatus(company.id, company.isActive)}
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
            company.isActive
              ? 'bg-green-100 text-green-800 hover:bg-green-200'
              : 'bg-red-100 text-red-800 hover:bg-red-200'
          }`}
        >
          {company.isActive ? 'Activa' : 'Inactiva'}
        </button>
      ),
    },
    {
      key: 'createdAt',
      header: 'Fecha de creación',
      sortable: true,
      render: (company: Company) => (
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-500">
            {new Date(company.createdAt).toLocaleDateString('es-ES')}
          </span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Acciones',
      render: (company: Company) => (
        <div className="flex space-x-2">
          <Link to={`/companies/${company.id}`}>
            <Button variant="ghost" size="sm">
              Ver
            </Button>
          </Link>
          <Link to={`/companies/${company.id}/edit`}>
            <Button variant="ghost" size="sm">
              <Edit className="w-4 h-4" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeleteModal({ isOpen: true, companyId: company.id })}
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Empresas</h1>
          <p className="text-gray-600">
            Administra todas las empresas y sucursales del sistema ({filteredCompanies.length} empresas)
          </p>
        </div>
        
        <Link to="/companies/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Empresa
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
        <div className="max-w-md">
          <Input
            placeholder="Buscar empresas por nombre o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { 
            label: 'Total Empresas', 
            value: companies?.length || 0, 
            color: 'blue',
            icon: Building2
          },
          { 
            label: 'Empresas Activas', 
            value: companies?.filter((c: Company) => c.isActive).length || 0, 
            color: 'green',
            icon: Activity
          },
          { 
            label: 'Con Gerente Asignado', 
            value: companies?.filter((c: Company) => c.branchManagerId).length || 0, 
            color: 'purple',
            icon: Users
          },
          { 
            label: 'Creadas Este Mes', 
            value: companies?.filter((c: Company) => {
              const createdDate = new Date(c.createdAt)
              const now = new Date()
              return createdDate.getMonth() === now.getMonth() && createdDate.getFullYear() === now.getFullYear()
            }).length || 0, 
            color: 'yellow',
            icon: Calendar
          },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <stat.icon className="w-8 h-8 text-gray-400" />
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <Table
        data={filteredCompanies}
        columns={columns}
        loading={isLoading}
        emptyMessage="No hay empresas registradas"
      />

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false })}
        title="Eliminar Empresa"
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
          ¿Estás seguro de que quieres eliminar esta empresa? Esta acción no se puede deshacer y se eliminarán todos los datos asociados, incluyendo usuarios, equipos y publicaciones.
        </p>
      </Modal>
    </div>
  )
}

export default CompaniesList 