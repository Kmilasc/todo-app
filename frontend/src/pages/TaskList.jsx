import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { removeToken } from '../services/auth';
import './TaskList.css';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/tasks');
      setTasks(response.data);
    } catch (error) {
      setError('Erro ao carregar tarefas');
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="tasks-container">
        <div className="loading">Carregando tarefas...</div>
      </div>
    );
  }

  return (
    <div className="tasks-container">
      <header className="tasks-header">
        <h1>Minhas Tarefas</h1>
        <div className="header-actions">
          <Link to="/tasks/new" className="btn-primary">
            + Nova Tarefa
          </Link>
          <button onClick={handleLogout} className="btn-secondary">
            Sair
          </button>
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="tasks-content">
        {tasks.length === 0 ? (
          <div className="empty-state">
            <p>Você ainda não tem tarefas cadastradas.</p>
            <Link to="/tasks/new" className="btn-primary">
              Criar primeira tarefa
            </Link>
          </div>
        ) : (
          <div className="tasks-grid">
            {tasks.map((task) => (
              <div key={task.id} className="task-card">
                <h3>{task.title}</h3>
                {task.description && (
                  <p className="task-description">{task.description}</p>
                )}
                <div className="task-meta">
                  <span className="task-date">
                    Criada em: {formatDate(task.createdAt)}
                  </span>
                  {task.updatedAt !== task.createdAt && (
                    <span className="task-date">
                      Atualizada em: {formatDate(task.updatedAt)}
                    </span>
                  )}
                </div>
                <div className="task-actions">
                  <Link 
                    to={`/tasks/${task.id}/edit`} 
                    className="btn-outline"
                  >
                    Editar
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList; 