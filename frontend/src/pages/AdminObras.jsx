import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Alert, Spinner, Badge } from "react-bootstrap";
import api from "../api/axios";

export default function AdminObras() {
  const [obras, setObras] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ titulo: "", sinopsis: "", poster: "", id_genero: "", id_director: "" });
  const [generos, setGeneros] = useState([]);
  const [directores, setDirectores] = useState([]);
  const [guardando, setGuardando] = useState(false);

  // null = crear, objeto = editar
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    fetchObras();
    fetchGeneros();
    fetchDirectores();
  }, []);

  const fetchObras = async () => {
    try {
      const res = await api.get("/api/obras");
      setObras(res.data);
    } catch {
      setError("Error al cargar las obras.");
    }
  };

  const fetchGeneros = async () => {
    const res = await api.get("/api/generos");
    setGeneros(res.data);
  };

  const fetchDirectores = async () => {
    const res = await api.get("/api/directores");
    setDirectores(res.data);
  };

  const abrirCrear = () => {
    setEditando(null);
    setForm({ titulo: "", sinopsis: "", poster: "", id_genero: "", id_director: "" });
    setShowModal(true);
  };

  const abrirEditar = (obra) => {
    setEditando(obra);
    setForm({
      titulo: obra.titulo,
      sinopsis: obra.sinopsis ?? "",
      poster: obra.poster ?? "",
      id_genero: obra.id_genero,
      id_director: obra.id_director,
    });
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setEditando(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    try {
      if (editando) {
        const res = await api.put(`/api/obras/${editando.id}`, form);
        setObras(obras.map(o => o.id === editando.id ? res.data : o));
      } else {
        const res = await api.post("/api/obras", form);
        setObras([...obras, res.data]);
      }
      cerrarModal();
    } catch (err) {
      setError("Error al guardar la obra.");
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta obra?")) return;
    try {
      await api.delete(`/api/obras/${id}`);
      setObras(obras.filter(o => o.id !== id));
    } catch {
      setError("Error al eliminar la obra.");
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Obras</h2>
        <Button variant="primary" onClick={abrirCrear}>+ Nueva obra</Button>
      </div>

      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}

      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Título</th>
            <th>Género</th>
            <th>Director</th>
            <th>Tipo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {obras.map(obra => (
            <tr key={obra.id}>
              <td>{obra.id}</td>
              <td>{obra.titulo}</td>
              <td>{obra.genero?.nombre ?? "—"}</td>
              <td>{obra.director?.nombre ?? "—"}</td>
              <td>
                <Badge bg={obra.peli_video ? "primary" : "secondary"}>
                  {obra.peli_video ? "Película" : obra.serie_video ? "Serie" : "-"}
                </Badge>
              </td>
              <td className="d-flex gap-2">
                <Button size="sm" variant="warning" onClick={() => abrirEditar(obra)}>Editar</Button>
                <Button size="sm" variant="danger" onClick={() => handleEliminar(obra.id)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal crear / editar */}
      <Modal show={showModal} onHide={cerrarModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editando ? "Editar obra" : "Nueva obra"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleGuardar}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Título</Form.Label>
              <Form.Control name="titulo" value={form.titulo} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Sinopsis</Form.Label>
              <Form.Control as="textarea" rows={3} name="sinopsis" value={form.sinopsis} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>URL del póster</Form.Label>
              <Form.Control name="poster" value={form.poster} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Género</Form.Label>
              <Form.Select name="id_genero" value={form.id_genero} onChange={handleChange} required>
                <option value="">Selecciona un género</option>
                {generos.map(g => (
                  <option key={g.id} value={g.id}>{g.nombre}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Director</Form.Label>
              <Form.Select name="id_director" value={form.id_director} onChange={handleChange} required>
                <option value="">Selecciona un director</option>
                {directores.map(d => (
                  <option key={d.id} value={d.id}>{d.nombre}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={cerrarModal}>Cancelar</Button>
            <Button variant="primary" type="submit" disabled={guardando}>
              {guardando ? <Spinner size="sm" animation="border" /> : "Guardar"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};