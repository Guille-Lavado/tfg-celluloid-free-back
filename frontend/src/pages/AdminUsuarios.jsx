import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Alert, Spinner, Badge } from "react-bootstrap";
import api from "../api/axios";

export default function AdminUsuarios() {
	const [usuarios, setUsuarios] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [editando, setEditando] = useState(null);
	const [form, setForm] = useState({ name: "", email: "", password: "", password_confirmation: "", rol: "usuario" });
	const [guardando, setGuardando] = useState(false);

	useEffect(() => {
		fetchUsuarios();
	}, []);

	const fetchUsuarios = async () => {
		try {
			const res = await api.get("/api/users");
			setUsuarios(res.data);
		} catch {
			setError("Error al cargar los usuarios.");
		} finally {
			setLoading(false);
		}
	};

	const abrirCrear = () => {
		setEditando(null);
		setForm({ name: "", email: "", password: "", password_confirmation: "", rol: "usuario" });
		setShowModal(true);
	};

	const abrirEditar = (usuario) => {
		setEditando(usuario);
		setForm({ name: usuario.name, email: usuario.email, password: "", password_confirmation: "", rol: usuario.rol });
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
			// Al editar solo enviamos password si se ha rellenado
			const payload = { ...form };
			if (editando && !payload.password) {
				delete payload.password;
				delete payload.password_confirmation;
			}

			if (editando) {
				const res = await api.put(`/api/users/${editando.id}`, payload);
				setUsuarios(usuarios.map(u => u.id === editando.id ? res.data : u));
			} else {
				const res = await api.post("/api/users", payload);
				setUsuarios([...usuarios, res.data]);
			}
			cerrarModal();
		} catch (err) {
			setError("Error al guardar el usuario.");
		} finally {
			setGuardando(false);
		}
	};

	const handleEliminar = async (id) => {
		if (!window.confirm("¿Seguro que quieres eliminar este usuario?")) return;
		try {
			await api.delete(`/api/usuarios/${id}`);
			setUsuarios(usuarios.filter(u => u.id !== id));
		} catch {
			setError("Error al eliminar el usuario.");
		}
	};

	if (loading) return <Spinner animation="border" />;

	return (
		<>
			<div className="d-flex justify-content-between align-items-center mb-3">
				<h2>Usuarios</h2>
				<Button variant="primary" onClick={abrirCrear}>+ Nuevo usuario</Button>
			</div>

			{error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}

			<Table striped bordered hover responsive>
				<thead className="table-dark">
					<tr>
						<th>#</th>
						<th>Nombre</th>
						<th>Email</th>
						<th>Rol</th>
						<th>Acciones</th>
					</tr>
				</thead>
				<tbody>
					{usuarios.map(usuario => (
						<tr key={usuario.id}>
							<td>{usuario.id}</td>
							<td>{usuario.name}</td>
							<td>{usuario.email}</td>
							<td>
								<Badge bg={usuario.rol === "administrador" ? "danger" : "secondary"}>
									{usuario.rol}
								</Badge>
							</td>
							<td className="d-flex gap-2">
								<Button size="sm" variant="warning" onClick={() => abrirEditar(usuario)}>Editar</Button>
								<Button size="sm" variant="danger" onClick={() => handleEliminar(usuario.id)}>Eliminar</Button>
							</td>
						</tr>
					))}
				</tbody>
			</Table>

			<Modal show={showModal} onHide={cerrarModal}>
				<Modal.Header closeButton>
					<Modal.Title>{editando ? "Editar usuario" : "Nuevo usuario"}</Modal.Title>
				</Modal.Header>
				<Form onSubmit={handleGuardar}>
					<Modal.Body>
						<Form.Group className="mb-3">
							<Form.Label>Nombre</Form.Label>
							<Form.Control name="name" value={form.name} onChange={handleChange} required />
						</Form.Group>
						<Form.Group className="mb-3">
							<Form.Label>Email</Form.Label>
							<Form.Control type="email" name="email" value={form.email} onChange={handleChange} required />
						</Form.Group>
						<Form.Group className="mb-3">
							<Form.Label>{editando ? "Nueva contraseña (dejar vacío para no cambiar)" : "Contraseña"}</Form.Label>
							<Form.Control type="password" name="password" value={form.password} onChange={handleChange} required={!editando} />
						</Form.Group>
						<Form.Group className="mb-3">
							<Form.Label>Confirmar contraseña</Form.Label>
							<Form.Control type="password" name="password_confirmation" value={form.password_confirmation} onChange={handleChange} required={!editando} />
						</Form.Group>
						<Form.Group className="mb-3">
							<Form.Label>Rol</Form.Label>
							<Form.Select name="rol" value={form.rol} onChange={handleChange}>
								<option value="usuario">Usuario</option>
								<option value="administrador">Administrador</option>
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