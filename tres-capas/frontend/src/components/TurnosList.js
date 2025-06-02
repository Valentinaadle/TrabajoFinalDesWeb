import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:3001/api';

function TurnosList() {
  const [turnos, setTurnos] = useState([]);
  const [profesionales, setProfesionales] = useState([]);
  const [form, setForm] = useState({ pacienteId: '', profesionalId: '', fecha: '', consultorio: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchTurnos();
    fetchProfesionales();
  }, []);

  const fetchTurnos = async () => {
    const res = await fetch(`${API_URL}/turnos`);
    const data = await res.json();
    setTurnos(data);
  };

  const fetchProfesionales = async () => {
    const res = await fetch(`${API_URL}/profesionales`);
    const data = await res.json();
    setProfesionales(data);
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (editId) {
      await fetch(`${API_URL}/turnos/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
    } else {
      await fetch(`${API_URL}/turnos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
    }
    setForm({ pacienteId: '', profesionalId: '', fecha: '', consultorio: '' });
    setEditId(null);
    fetchTurnos();
  };

  const handleEdit = turno => {
    setForm({
      pacienteId: turno.pacienteId,
      profesionalId: turno.profesionalId,
      fecha: turno.fecha,
      consultorio: turno.consultorio
    });
    setEditId(turno.id);
  };

  const handleDelete = async id => {
    await fetch(`${API_URL}/turnos/${id}`, { method: 'DELETE' });
    fetchTurnos();
  };

  return (
    <div style={{ margin: '2rem' }}>
      <h2>Turnos</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          name="pacienteId"
          placeholder="ID Paciente"
          value={form.pacienteId}
          onChange={handleChange}
          required
        />
        <select name="profesionalId" value={form.profesionalId} onChange={handleChange} required>
          <option value="">Profesional</option>
          {profesionales.map(p => (
            <option key={p.id} value={p.id}>{p.nombre}</option>
          ))}
        </select>
        <input
          type="datetime-local"
          name="fecha"
          value={form.fecha}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="consultorio"
          placeholder="Consultorio"
          value={form.consultorio}
          onChange={handleChange}
          required
        />
        <button type="submit">{editId ? 'Actualizar' : 'Crear'}</button>
        {editId && <button type="button" onClick={() => { setEditId(null); setForm({ pacienteId: '', profesionalId: '', fecha: '', consultorio: '' }); }}>Cancelar</button>}
      </form>
      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>ID Paciente</th>
            <th>Profesional</th>
            <th>Fecha</th>
            <th>Consultorio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {turnos.map(turno => (
            <tr key={turno.id}>
              <td>{turno.id}</td>
              <td>{turno.pacienteId}</td>
              <td>{profesionales.find(p => p.id === turno.profesionalId)?.nombre || turno.profesionalId}</td>
              <td>{turno.fecha}</td>
              <td>{turno.consultorio}</td>
              <td>
                <button onClick={() => handleEdit(turno)}>Editar</button>
                <button onClick={() => handleDelete(turno.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TurnosList; 