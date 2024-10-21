import React, { useState, useEffect } from "react"; 

const Home = () => {
  let [listaTareas, setListaTareas] = useState([  "Visitar a mis amigas",
    "Pasear a mi perra",
    "Hacer mis proyectos",
    "Hacer las compras",]);
  const [nuevaTarea, setNuevaTarea] = useState("");
  const [tareaSeleccionada, setTareaSeleccionada] = useState(null);

  // Función para sincronizar la lista de tareas con el servidor (PUT)
  const sincronizarTareas = (nuevasTareas) => {
    fetch('https://playground.4geeks.com/todo/user/alesanchezr', {
      method: "PUT",
      body: JSON.stringify(nuevasTareas),
      headers: {
        "Content-Type": "application/json",
      }
    })
      .then((resp) => {
        console.log(resp.ok); // Será true si la respuesta es exitosa
        console.log(resp.status); // El código de estado 200, 300, 400, etc.
        return resp.json(); // Intentará parsear el resultado a JSON
      })
      .then((data) => {
        console.log("Tareas sincronizadas:", data);
      })
      .catch((error) => {
        console.log("Error al sincronizar tareas:", error);
      });
  };

  // Obtener la lista de tareas del servidor (GET) cuando el componente se carga
  useEffect(() => {
    fetch('https://playground.4geeks.com/todo/user/alesanchezr')
      .then((resp) => {
        console.log("Estado de la respuesta:", resp.status);
        return resp.json();
      })
      .then((data) => {
        console.log("Datos obtenidos del servidor:", data);
        if (Array.isArray(data)) {
          setListaTareas(data); // Actualiza la lista con los datos obtenidos
        } else {
          console.log("Respuesta inesperada, no es un array:", data);
        }
      })
      .catch((error) => {
        console.log("Error al obtener las tareas:", error);
      });
  }, []);

  // Función para agregar una tarea
  const agregarTarea = (evento) => {
    if (evento.key === "Enter" && nuevaTarea.trim() !== "") {
      const nuevasTareas = [...listaTareas, nuevaTarea];
      setListaTareas(nuevasTareas);
      setNuevaTarea("");
      sincronizarTareas(nuevasTareas); // Sincroniza la nueva lista con el servidor
    }
  };

  // Función para eliminar una tarea
  const eliminarTarea = (index) => {
    const nuevasTareas = listaTareas.filter((_, ind) => ind !== index);
    setListaTareas(nuevasTareas);
    sincronizarTareas(nuevasTareas); // Sincroniza la nueva lista con el servidor
  };

  // Función para eliminar todas las tareas
  const eliminarTodasLasTareas = () => {
    setListaTareas([]);
    sincronizarTareas([]); // Sincroniza la lista vacía con el servidor
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center title">todos</h1>
      <div className="mx-auto col-6 todo-container">
        <input
          type="text"
          className="form-control input-task"
          placeholder="¿Qué necesitas hacer?"
          value={nuevaTarea}
          onChange={(evento) => setNuevaTarea(evento.target.value)}
          onKeyUp={agregarTarea}
        />
        <div className="card mt-3 shadow-sm">
          <ul className="list-group list-group-flush">
            {listaTareas.map((item, index) => (
              <li
                key={index}
                className="list-group-item task-item"
                onMouseEnter={() => setTareaSeleccionada(index)}
                onMouseLeave={() => setTareaSeleccionada(null)}
              >
                {item}{" "}
                {tareaSeleccionada === index && (
                  <i
                    onClick={() => eliminarTarea(index)}
                    className="fa fa-times icono-oculto"
                  ></i>
                )}
              </li>
            ))}
          </ul>
          <div className="card-footer text-muted">
            {listaTareas.length} {listaTareas.length === 1 ? "item" : "items"} left
          </div>
        </div>
        <button
          className="btn btn-danger mt-3"
          onClick={eliminarTodasLasTareas}
        >
          Eliminar todas las tareas
        </button>
      </div>
    </div>
  );
};

export default Home;
