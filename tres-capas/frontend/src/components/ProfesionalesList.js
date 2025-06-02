import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:3001/api';

function ProfesionalesList() {
  const [profesionales, setProfesionales] = useState([]);

  useEffect(() => {
    fetchProfesionales();
  }, []);

  const fetchProfesionales = async () => {
    const res = await fetch(`${API_URL}/profesionales`);
    const data = await res.json();
    setProfesionales(data);
  };

  return (
    <div style={{ margin: '2rem' }}>
      <h2>Profesionales</h2>
      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Especialidad</th>
            <th>Email</th>
            <th>Horarios</th>
          </tr>
        </thead>
        <tbody>
          {profesionales.map(prof => (
            <tr key={prof.id}>
              <td>{prof.id}</td>
              <td>{prof.nombre}</td>
              <td>{prof.especialidad}</td>
              <td>{prof.email}</td>
              <td>{prof.horarios}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProfesionalesList; 