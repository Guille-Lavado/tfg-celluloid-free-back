import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Alert, Spinner, Badge, ProgressBar } from "react-bootstrap";
import api from "../api/axios";

export default function AdminObras() {
  const [obras, setObras] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [generos, setGeneros] = useState([]);
  const [directores, setDirectores] = useState([]);
  const [guardando, setGuardando] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [videoFile, setVideoFile] = useState(null);

  const [form, setForm] = useState({
    titulo: "", sinopsis: "", poster: "",
    id_genero: "", id_director: "", tipo: "pelicula", nombre_video: ""
  });

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
    setForm({ titulo: "", sinopsis: "", poster: "", id_genero: "", id_director: "", tipo: "pelicula", nombre_video: "" });
    setVideoFile(null);
    setProgreso(0);
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
      tipo: obra.peli_video ? "pelicula" : "serie",
      nombre_video: "",
    });
    setVideoFile(null);
    setProgreso(0);
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setEditando(null);
    setProgreso(0);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setError(null);
    try {
      if (editando) {
        // Al editar solo actualizamos los campos de texto
        const res = await api.put(`/api/obras/${editando.id}`, {
          titulo: form.titulo,
          sinopsis: form.sinopsis,
          poster: form.poster,
          id_genero: form.id_genero,
          id_director: form.id_director,
        });
        setObras(obras.map(o => o.id === editando.id ? res.data : o));
      } else {
        // Al crear enviamos multipart/form-data con el vídeo
        const formData = new FormData();
        formData.append("titulo", form.titulo);
        formData.append("sinopsis", form.sinopsis);
        formData.append("poster", form.poster);
        formData.append("id_genero", form.id_genero);
        formData.append("id_director", form.id_director);
        formData.append("tipo", form.tipo);
        formData.append("nombre_video", form.nombre_video);
        if (videoFile) formData.append("video", videoFile);

        const res = await api.post("/api/obras", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (e) => {
            const pct = Math.round((e.loaded * 100) / e.total)
            setProgreso(pct)
          }
        });
        setObras([...obras, res.data]);
      }
      cerrarModal();
    } catch (err) {
      setError(err.response?.data?.message ?? "Error al guardar la obra");
    } finally {
      ;
      setGuardando(false)
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
            <th>Póster</th>
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
              <td>
                {obra.poster
                  ? <img src={obra.poster} alt={obra.titulo} style={{ width: 36, height: 50, objectFit: "cover", borderRadius: 4 }} />
                  : "—"
                }
              </td>
              <td>{obra.titulo}</td>
              <td>{obra.genero?.nombre ?? "—"}</td>
              <td>{obra.director?.nombre ?? "—"}</td>
              <td>
                <Badge bg={obra.peli_video ? "primary" : "secondary"}>
                  {obra.peli_video ? "Película" : "Serie"}
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

      <Modal show={showModal} onHide={cerrarModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editando ? "Editar obra" : "Nueva obra"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleGuardar}>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}

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
                {generos.map(g => <option key={g.id} value={g.id}>{g.nombre}</option>)}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Director</Form.Label>
              <Form.Select name="id_director" value={form.id_director} onChange={handleChange} required>
                <option value="">Selecciona un director</option>
                {directores.map(d => <option key={d.id} value={d.id}>{d.nombre}</option>)}
              </Form.Select>
            </Form.Group>

            {/* Solo mostramos el campo de vídeo al crear */}
            {!editando && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Tipo</Form.Label>
                  <Form.Select name="tipo" value={form.tipo} onChange={handleChange}>
                    <option value="pelicula">Película</option>
                    <option value="serie">Serie</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre del vídeo</Form.Label>
                  <Form.Control name="nombre_video" value={form.nombre_video} onChange={handleChange} placeholder="Opcional" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Archivo de vídeo</Form.Label>
                  <Form.Control
                    type="file"
                    accept="video/mp4,video/x-matroska,video/avi,video/quicktime"
                    onChange={(e) => setVideoFile(e.target.files[0])}
                    required={form.tipo === "pelicula"}
                  />
                  <Form.Text className="text-muted">
                    Formatos aceptados: MP4, MKV, AVI, MOV. Máximo 2GB.
                  </Form.Text>
                </Form.Group>

                {/* Barra de progreso de subida */}
                {guardando && progreso > 0 && (
                  <div className="mb-3">
                    <Form.Label>Subiendo vídeo... {progreso}%</Form.Label>
                    <ProgressBar animated now={progreso} label={`${progreso}%`} />
                  </div>
                )}
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={cerrarModal} disabled={guardando}>Cancelar</Button>
            <Button variant="primary" type="submit" disabled={guardando}>
              {guardando
                ? <><Spinner size="sm" animation="border" className="me-2" />{progreso > 0 ? `Subiendo ${progreso}%` : "Guardando..."}</>
                : "Guardar"
              }
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};