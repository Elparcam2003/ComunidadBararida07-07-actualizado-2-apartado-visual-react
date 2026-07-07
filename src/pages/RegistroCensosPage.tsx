import { useState } from 'react';
import { Eye } from 'lucide-react';
import { FamiliaDetalleModal } from '../components/FamiliaDetalleModal';
import { useApp } from '../context/AppContext';

export function RegistroCensosPage() {
  const { familias,aprobarFamilia,usuarioActual} = useApp();
  const [busqueda, setBusqueda] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('TODOS');
  const [bloqueFiltro, setBloqueFiltro] = useState('');
  const [familiaDetalle, setFamiliaDetalle] = useState<string | null>(null);

  // --- LÓGICA DE CONTADORES (ESTADÍSTICAS) ---
  const total = familias.length;
  const pendientes = familias.filter(f => f.estado === 'PENDIENTE').length;
  const aprobadas = familias.filter(f => f.estado === 'APROBADA').length;
  const rechazadas = familias.filter(f => f.estado === 'RECHAZADA').length;

  // Prueba Visual back 1:16am 27:06
  const obtenerColorEstado = (estado: string) => {

      switch(estado){

      case 'APROBADA':
      return 'bg-green-100 text-green-700';

      case 'RECHAZADA':
      return 'bg-red-100 text-red-700';

      default:
      return 'bg-yellow-100 text-yellow-700';

      }

      };

  // --- LÓGICA DE FILTRADO ---
  const [aptoFiltro, setAptoFiltro] = useState('');

  const familiasFiltradas = familias.filter(f => {
    //Normaliza los textos a minsculas
    const busquedaLimpia = busqueda.toLowerCase();
    const aptoTexto = f.apartamento ? String(f.apartamento).toLowerCase() : '';

    // 2. Comprobamos cada filtro de forma independiente
    const coincideBusqueda = f.jefeFamilia.toLowerCase().includes(busquedaLimpia) || f.cedulaJefe.includes(busqueda);

    const coincideEstado = estadoFiltro === 'TODOS' || f.estado === estadoFiltro;
    
    const coincideBloque = !bloqueFiltro || f.bloque.toLowerCase().includes(bloqueFiltro.toLowerCase());
    
    const coincideApto = !aptoFiltro || aptoTexto.includes(aptoFiltro.toLowerCase());

    //  Todos los filtros deben cumplirse simultneamente
    return coincideBusqueda && coincideEstado && coincideBloque && coincideApto;
  })
  .sort((a, b) => {return new Date(b.fechaRegistro).getTime() - new Date(a.fechaRegistro).getTime();});
  const familiaSeleccionada = familias.find(
  f => f.id === familiaDetalle
  );

  return (
    <div className="space-y-6">
      {/* SECCIÓN 1: Título Principal */}
      <h1 className="text-2xl font-bold text-gray-900">
        Registro de Censos
      </h1>

      {/* SECCIÓN 2: Bloque de Estadísticas (Ahora ubicadas correctamente arriba) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500 font-medium">Total de censos</p>
          <h2 className="text-3xl font-bold text-gray-900 mt-1">{total}</h2>
        </div>
 
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 shadow-sm">
          <p className="text-sm text-yellow-700 font-medium">Pendientes</p>
          <h2 className="text-3xl font-bold text-yellow-700 mt-1">{pendientes}</h2>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-4 shadow-sm">
          <p className="text-sm text-green-700 font-medium">Aprobados</p>
          <h2 className="text-3xl font-bold text-green-700 mt-1">{aprobadas}</h2>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm">
          <p className="text-sm text-red-700 font-medium">Rechazados</p>
          <h2 className="text-3xl font-bold text-red-700 mt-1">{rechazadas}</h2>
        </div>
      </div>

      {/* SECCIÓN 3: Barra de Filtros y Búsqueda (Actualizada a 4 columnas) */}
      <div className="bg-white border rounded-xl p-4 grid grid-cols-1 md:grid-cols-4 gap-3 shadow-sm">
        <input
          type="text"
          placeholder="Buscar nombre o cédula"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />

        <select
          value={estadoFiltro}
          onChange={(e) => setEstadoFiltro(e.target.value)}
          className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
        >
          <option value="TODOS">Todos los estados</option>
          <option value="PENDIENTE">Pendientes</option>
          <option value="APROBADA">Aprobadas</option>
          <option value="RECHAZADA">Rechazadas</option>
        </select>

        <input
          type="text"
          placeholder="Filtrar por bloque"
          value={bloqueFiltro}
          onChange={(e) => setBloqueFiltro(e.target.value)}
          className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />

        <input
          type="text"
          placeholder="Filtrar por apartamento"
          value={aptoFiltro}
          onChange={(e) => setAptoFiltro(e.target.value)}
          className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      {/* SECCIÓN 4: Listado de Tarjetas Filtradas */}
      <div className="space-y-4">
        {familiasFiltradas.length === 0 ? (
          <p className="text-center text-gray-500 py-8 bg-white border rounded-xl">No se encontraron resultados.</p>
          ) : (
              familiasFiltradas.map(f => {
            const colorEstado = obtenerColorEstado(f.estado);;
            return (
              <div key={f.id} className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="font-bold text-lg text-gray-900">{f.jefeFamilia}</h2>
                    <p className="text-gray-600 text-sm mt-1">CI: {f.cedulaJefe}</p>
                    <p className="text-gray-600 text-sm">
                      Torre {f.torre} • Bloque {f.bloque} • Apto {f.apartamento}
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                      Integrantes: <span className="font-semibold text-gray-700">{f.integrantes.length}</span>
                    </p>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${colorEstado}`}>
                    {f.estado}
                  </span>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-400">
                  Registrado: {new Date(f.fechaRegistro).toLocaleDateString()}
              </div>

              <div className="mt-4 flex justify-end">

                <button
                onClick={() => setFamiliaDetalle(f.id)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                >

                <Eye size={18}/>

                Ver detalle

                </button>

              </div>

              <FamiliaDetalleModal

                familia={familiaSeleccionada ?? null}
                onClose={() => setFamiliaDetalle(null)}
                esAdministrador={usuarioActual.rol === 'SUPER_ADMIN'}
                aprobarFamilia={aprobarFamilia} // O como se llame tu función para cambiar el estado en el context
                />

              </div>
          );
          })
        )}
      </div>
    </div>
  );
}