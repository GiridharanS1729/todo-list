import React from 'react';
import classes from './Home.module.css';
import NewTasks from '../New Tasks/NewTasks';
import PreviewTasks from '../Preview Tasks/PreviewTasks';
const Home = () => {
  const [tasks, setTasks] = React.useState(JSON.parse(localStorage.getItem('TODO')) || []);
  React.useEffect(() => {
    localStorage.setItem('TODO', JSON.stringify(tasks));
  }, [tasks]);
  function updateTasks(updatedTasks) {
    setTasks(updatedTasks);
  }
  function saveHandler(todoTitle) {
    const newTodo = {
      id: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
      title: todoTitle,
      completed: false,
    };
    updateTasks([newTodo, ...tasks]);
  }
  function onDeleteHandler(id) {
    const update = tasks.filter((item) => item.id !== id);
    updateTasks(update);
  }
  function updateTitle(updatedId, updatedTitle) {
    const update = tasks.map((item) => {
      if (item.id === updatedId) {
        item.title = updatedTitle;
      }
      return item;
    });
    updateTasks(update);
  }
  function updateStatus(updatedId, status) {
    const update = tasks.map((item) => {
      if (item.id === updatedId) {
        item.completed = status;
      }
      return item;
    });
    updateTasks(update);
  }
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
