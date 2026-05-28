/**
 * Servicio de comunicación con la API REST del backend.
 * Centraliza todas las llamadas HTTP utilizando Fetch API.
 * Define la URL base y funciones para autenticación y CRUD de cursos.
 */

// Importa Constants de Expo para acceder a variables de entorno (opcional, aquí no se usa directamente)
import Constants from 'expo-constants';

// ---------------------------------------------------------------------
// Configuración de la URL base de la API
// ---------------------------------------------------------------------

// Dirección IP del servidor donde corre XAMPP (debe estar en la misma red WiFi que el celular)
const IP = '192.168.1.35';
// URL completa apuntando a la carpeta 'api' del backend PHP
const API_BASE = `http://${IP}/DANID_VALLEJOS_AA5_EV03/api/`;

/**
 * Función genérica para realizar peticiones a cualquier endpoint.
 * @param endpoint - Nombre del archivo PHP (ej: 'login.php', 'cursos.php')
 * @param method - Método HTTP (GET, POST, PUT, DELETE)
 * @param data - Datos a enviar en el cuerpo (para POST/PUT) o parámetros (para GET/DELETE con id)
 * @returns Objeto con el código de estado HTTP y los datos de la respuesta (en formato JSON)
 */
export const callApi = async (endpoint: string, method: string = 'GET', data?: any) => {
  try {
    // Configuración básica de la petición: método y cabeceras (tipo JSON)
    const options: RequestInit = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };

    // Si hay datos y es POST o PUT, los agrega al cuerpo en formato JSON
    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }

    // Construye la URL base + endpoint
    let url = API_BASE + endpoint;

    // Para GET, PUT o DELETE: si se proporciona un 'id' en los datos, lo agrega como parámetro en la URL
    if (method === 'GET' && data?.id) {
      url += `?id=${data.id}`;
    }
    if ((method === 'PUT' || method === 'DELETE') && data?.id) {
      url += `?id=${data.id}`;
    }

    // Realiza la petición fetch (nativo del navegador/React Native)
    const response = await fetch(url, options);
    // Convierte la respuesta a JSON
    const result = await response.json();

    // Retorna el código de estado y los datos para que el componente pueda manejarlos fácilmente
    return { status: response.status, data: result };
  } catch (error) {
    // Si ocurre un error de red (servidor no alcanzable, timeout, etc.), retorna un error 500
    return { status: 500, data: { error: 'Error de conexión con el servidor' } };
  }
};

// ---------------------------------------------------------------------
// Funciones específicas para autenticación
// ---------------------------------------------------------------------

/**
 * Inicia sesión con usuario y contraseña.
 * @param username - Nombre de usuario
 * @param password - Contraseña en texto plano
 * @returns Promesa con el resultado de la petición (status y data)
 */
export const login = async (username: string, password: string) =>
  callApi('login.php', 'POST', { username, password });

/**
 * Registra un nuevo usuario.
 * @param fullname - Nombre completo
 * @param username - Nombre de usuario único
 * @param password - Contraseña
 * @returns Promesa con el resultado de la petición
 */
export const register = async (fullname: string, username: string, password: string) =>
  callApi('register.php', 'POST', { fullname, username, password });

// ---------------------------------------------------------------------
// Funciones para el CRUD de cursos
// ---------------------------------------------------------------------

/**
 * Obtiene todos los cursos (GET).
 * @returns Promesa con la lista de cursos en data.data
 */
export const getCursos = async () => callApi('cursos.php', 'GET');

/**
 * Crea un nuevo curso (POST).
 * @param cursoData - Objeto con los campos: titulo, descripcion, instructor, imagen, precio, id_creador
 * @returns Promesa con el resultado de la creación
 */
export const createCurso = async (cursoData: any) =>
  callApi('cursos.php', 'POST', cursoData);

/**
 * Actualiza un curso existente (PUT).
 * @param id - ID del curso a actualizar
 * @param cursoData - Objeto con los campos a modificar (titulo, descripcion, instructor, imagen, precio)
 * @returns Promesa con el resultado de la actualización
 */
export const updateCurso = async (id: number, cursoData: any) =>
  callApi('cursos.php', 'PUT', { id, ...cursoData });

/**
 * Elimina un curso (DELETE).
 * @param id - ID del curso a eliminar
 * @returns Promesa con el resultado de la eliminación
 */
export const deleteCurso = async (id: number) =>
  callApi('cursos.php', 'DELETE', { id });