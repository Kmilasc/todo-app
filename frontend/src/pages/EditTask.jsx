import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../services/api';
import './TaskForm.css';

const EditTask = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [loadingTask, setLoadingTask] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoadingTask(true);
        const response = await api.get('/api/tasks');
        const task = response.data.find((t) => t.id === Number(id));
        
        if (task) {
          setFormData({
            title: task.title,
            description: task.description || ''
          });
        } else {
          setError('Tarefa não encontrada');
          setTimeout(() => navigate('/tasks'), 2000);
        }
      } catch (error) {
        setError('Erro ao carregar tarefa');
        setTimeout(() => navigate('/tasks'), 2000);
      } finally {
        setLoadingTask(false);
      }
    };

    fetchTask();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
   if (error) setError('');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.put(`/api/tasks/${id}`, formData);
      navigate('/tasks');
    } catch (error) {
      setError(error.response?.data?.message || 'Erro ao atualizar tarefa');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      try {
        setLoading(true);
        await api.delete(`/api/tasks/${id}`);
        navigate('/tasks');
      } catch (error) {
        setError(error.response?.data?.message || 'Erro ao excluir tarefa');
        setLoading(false);
      }
    }
  };

  if (loadingTask) {
    return (
      <div className="task-form-container">
        <div className="loading">Carregando tarefa...</div>
      </div>
    );
  }

  return (
    <div className="task-form-container">
      <div className="task-form">
        <header className="form-header">
          <h2>Editar Tarefa</h2>
          <Link to="/tasks" className="btn-secondary">
            ← Voltar
          </Link>
        </header>

        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label htmlFor="title">Título *</label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Digite o título da tarefa"
              value={formData.title}
              onChange={handleChange}
              required
              disabled={loading}
              maxLength="255"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Descrição</label>
            <textarea
              id="description"
              name="description"
              placeholder="Digite uma descrição para a tarefa (opcional)"
              value={formData.description}
              onChange={handleChange}
              disabled={loading}
              rows="4"
              maxLength="1000"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button 
              type="button" 
              onClick={() => navigate('/tasks')}
              className="btn-secondary"
              disabled={loading}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="btn-primary"
            >
              {loading ? 'Atualizando...' : 'Atualizar'}
            </button>
            <button 
              type="button" 
              onClick={handleDelete}
              className="btn-danger"
              disabled={loading}
            >
              Excluir
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTask; 