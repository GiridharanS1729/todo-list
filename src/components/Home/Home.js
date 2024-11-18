import React from 'react';
import classes from './Home.module.css';
import NewTasks from '../New Tasks/NewTasks';
import PreviewTasks from '../Preview Tasks/PreviewTasks';
import axios from 'axios';

const Home = () => {
  const [tasks, setTasks] = React.useState([]);

  // Fetch tasks from MongoDB on component mount
  React.useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/tasks'); // Backend route to fetch tasks
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchTasks();
  }, []);

  // Function to update tasks in MongoDB
  const updateTasks = async (updatedTasks) => {
    try {
      await axios.put('http://localhost:5000/api/tasks', { tasks: updatedTasks }); // Backend route to update tasks
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error updating tasks:', error);
    }
  };

  // Save task to MongoDB
  const saveHandler = async (todoTitle) => {
    const newTodo = {
      title: todoTitle,
      completed: false,
    };

    try {
      const response = await axios.post('http://localhost:5000/api/tasks', newTodo);
      setTasks([response.data, ...tasks]);
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  // Delete task from MongoDB
  const onDeleteHandler = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      const updatedTasks = tasks.filter((task) => task._id !== id); // Remove task from state
      setTasks(updatedTasks);  // Update state after deletion
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };


  const updateTitle = async (updatedId, updatedTitle) => {
    const updatedTask = tasks.map((task) =>
      task._id === updatedId ? { ...task, title: updatedTitle } : task
    );

    try {
      const response = await axios.put(`http://localhost:5000/api/tasks/${updatedId}`, {
        title: updatedTitle,
        completed: false,  // Assuming you want to reset the status on title change
      });
      setTasks(updatedTask);  // Update state with the newly updated task
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // Update task status in MongoDB
  const updateStatus = async (updatedId, status) => {
    const updatedTask = tasks.map((task) =>
      task._id === updatedId ? { ...task, completed: status } : task
    );
    await updateTasks(updatedTask);
  };

  // Calculate progress
  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className={classes.container}>
      <div className={classes.newTasks}>
        <h1>New Tasks</h1>
        <NewTasks onSaveHandler={saveHandler} />
      </div>
      <div className={classes.previewTasks}>
        <div className={classes.heading}>
          <div className='line1'>
            <h1>Today's Tasks</h1>
            <h3>{new Date().toLocaleDateString()}</h3>
          </div>
          <div className={classes.progressBarContainer}>
            <div className={classes.progressBar}>
              <div className={classes.progressBarInner}>
                <div
                  className={classes.progress}
                  style={{ width: `${progress}%` }}
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
            </div>
            <span>{progress}% Completed</span>
          </div>
        </div>
        <PreviewTasks
          loadTasks={tasks}
          titleHandler={updateTitle}
          onDelete={onDeleteHandler}
          statusHandler={updateStatus}
        />
      </div>
    </div>
  );
};

export default Home;
