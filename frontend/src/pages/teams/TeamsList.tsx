import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { Plus, Search, Filter, Edit, Trash2, Users } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import { Team } from '../../types'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Table from '../../components/ui/Table'
import Modal from '../../components/ui/Modal'

const TeamsList: React.FC = () => {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; teamId?: string }>({
    isOpen: false,
  })

  const { data: teams, isLoading, refetch } = useQuery(
    ['teams', user?.companyId],
    async () => {
      const response = await api.get('/teams')
      return response.data
    },
    {
      enabled: !!user?.companyId,
    }
  )

  const filteredTeams = teams?.filter((team: Team) =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  const handleDelete = async (teamId: string) => {
    try {
      await api.delete(`/teams/${teamId}`)
      refetch()
      setDeleteModal({ isOpen: false })
    } catch (error) {
      console.error('Error eliminando equipo:', error)
    }
  }

  const columns = [
    {
      key: 'name',
      header: 'Nombre',
      sortable: true,
      render: (team: Team) => (
        <div>
          <p className="font-medium text-gray-900">{team.name}</p>
          {team.description && (
            <p className="text-sm text-gray-500">{team.description}</p>
          )}
        </div>
      ),
    },
    {
      key: 'memberCount',
      header: 'Miembros',
      render: (team: Team) => (
        <div className="flex items-center space-x-1">
          <Users className="w-4 h-4 text-gray-400" />
          <span>{team.memberCount || 0}</span>
        </div>
      ),
    },
    {
      key: 'socialAccounts',
      header: 'Redes Sociales',
      render: (team: Team) => (
        <div className="flex space-x-1">
          {team.socialAccounts?.map((account) => (
            <span
              key={account.platform}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
            >
              {account.platform}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: 'isActive',
      header: 'Estado',
      render: (team: Team) => (
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            team.isActive
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {team.isActive ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Acciones',
      render: (team: Team) => (
        <div className="flex space-x-2">
          <Link to={`/teams/${team.id}`}>
            <Button variant="ghost" size="sm">
              Ver
            </Button>
          </Link>
          <Link to={`/teams/${team.id}/edit`}>
            <Button variant="ghost" size="sm">
              <Edit className="w-4 h-4" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeleteModal({ isOpen: true, teamId: team.id })}
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
          <h1 className="text-2xl font-bold text-gray-900">Equipos</h1>
          <p className="text-gray-600">
            Gestiona los equipos de tu empresa
          </p>
        </div>
        
        <Link to="/teams/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Equipo
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <Input
              placeholder="Buscar equipos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
        </div>
      </div>

      {/* Table */}
      <Table
        data={filteredTeams}
        columns={columns}
        loading={isLoading}
        emptyMessage="No hay equipos registrados"
      />

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false })}
        title="Eliminar Equipo"
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
              onClick={() => deleteModal.teamId && handleDelete(deleteModal.teamId)}
            >
              Eliminar
            </Button>
          </div>
        }
      >
        <p className="text-gray-600">
          ¿Estás seguro de que quieres eliminar este equipo? Esta acción no se puede deshacer.
        </p>
      </Modal>
    </div>
  )
}

export default TeamsList 