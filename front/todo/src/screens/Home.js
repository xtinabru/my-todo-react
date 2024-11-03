import './Home.css';
import { useEffect, useState } from 'react';
import Row from '../components/Row';
import axios from 'axios';
import { useUser } from '../context/useUser'; 

const url = 'http://localhost:3001';

function Home() {
  const { user } = useUser(); 
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(''); 

  useEffect(() => {
    axios.get(url)
      .then(response => {
        setTasks(response.data);
      })
      .catch(error => {
        setError(error.response && error.response.data && error.response.data.error ? error.response.data.error : error);
      });
  }, []);

  const addTask = () => {
    const headers = {headers: {Authorization:user.token}}
    if (!task.trim()) return; // Не добавлять пустые задачи

    axios.post(url + '/create', {
      description: task
    }, headers)
      .then(response => {
        setTasks([...tasks, { id: response.data.id, description: task }]);
        setTask('');
      })
      .catch(error => {
        setError(error.response && error.response.data && error.response.data.error ? error.response.data.error : error);
      });
  };

  const deleteTask = (id) => {
    const headers = {headers: {Authorization:user.token}}
    axios.delete(url + '/delete/' + id, headers)
      .then(() => {
        const withoutRemoved = tasks.filter((item) => item.id !== id);
        setTasks(withoutRemoved);
      })
      .catch(error => {
        setError(error.response && error.response.data && error.response.data.error ? error.response.data.error : error);
      });
  };

  return (
    <div id="container">
      <h3>Todos</h3>
      {error && <div className="error-message">{error}</div>} 
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          placeholder="Add new task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addTask();
            }
          }}
        />
      </form>
      <ul>
        {
          tasks.map(item => (
            <Row key={item.id} item={item} deleteTask={deleteTask} />
          ))
        }
      </ul>
    </div>
  );
}

export default Home; 