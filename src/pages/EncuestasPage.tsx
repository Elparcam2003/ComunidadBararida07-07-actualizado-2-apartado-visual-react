import { useState } from 'react';
import { Vote, Plus, BarChart3, Users, Building, MessageSquare, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

// Interfaz local temporal por si aún no has actualizado tus types.ts
interface Opcion {
  texto: string;
  votos: number;
}

interface EncuestaExtendida {
  id: string;
  casoId?: string;
  pregunta: string;
  opciones: Opcion[];
  votosResidentes: string[]; // Aquí guardaremos los IDs de los Jefes de Familia que ya votaron
  alcance: 'GLOBAL' | 'BLOQUE' | 'DIRECTO';
  edificioId?: string; // Para el filtro por bloque
  destinoId?: string;  // Para el filtro directo (familiaId o usuarioId del jefe)
}

export function EncuestasPage() {
  const { usuarioActual, encuestas, crearEncuesta, votarEncuesta, familias } = useApp();

  // Estados para la creación de encuestas
  const [mostrarForm, setMostrarForm] = useState(false);
  const [pregunta, setPregunta] = useState('');
  const [opciones, setOpciones] = useState<string[]>(['', '']);
  const [alcance, setAlcance] = useState<'GLOBAL' | 'BLOQUE' | 'DIRECTO'>('GLOBAL');
  const [bloqueSeleccionado, setBloqueSeleccionado] = useState('B3');
  const [familiaSeleccionada, setFamiliaSeleccionada] = useState('');

  const esAdministrativo = usuarioActual.rol === 'SUPER_ADMIN' || usuarioActual.rol === 'ADMIN_EDIFICIO' || usuarioActual.rol === 'VOCERO';

  // Manejo dinámico de opciones del formulario
  const manejarCambioOpcion = (index: number, valor: string) => {
    const nuevas = [...opciones];
    nuevas[index] = valor;
    setOpciones(nuevas);
  };

  const agregarOpcionCampo = () => setOpciones([...opciones, '']);
  
  const removerOpcionCampo = (index: number) => {
    if (opciones.length > 2) {
      setOpciones(opciones.filter((_, i) => i !== index));
    }
  };

  const manejarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const opcionesValidas = opciones.filter(o => o.trim() !== '');
    if (!pregunta || opcionesValidas.length < 2) return;

    // Determinamos el ID destino según el alcance
    let destinoId = undefined;
    if (alcance === 'BLOQUE') destinoId = bloqueSeleccionado;
    if (alcance === 'DIRECTO') destinoId = familiaSeleccionada;

    // Adaptado a la nueva firma de crearEncuesta
    crearEncuesta(
      'manual', // sin caso asociado por defecto desde este panel
      alcance === 'BLOQUE' ? bloqueSeleccionado : 'TODOS',
      pregunta,
      opcionesValidas,
      alcance,
      destinoId
    );

    // Resetear formulario
    setPregunta('');
    setOpciones(['', '']);
    setAlcance('GLOBAL');
    setMostrarForm(false);
  };

  // 🔄 FILTRADO INTELIGENTE: ¿Quién debe ver cada encuesta?
  const encuestasVisibles = (encuestas as unknown as EncuestaExtendida[]).filter(encuesta => {
    // Si eres administrador o vocero, puedes verlas todas para auditar los resultados
    if (esAdministrativo) return true;

    // Si eres un Jefe de Familia común, aplicamos las reglas de negocio:
    if (encuesta.alcance === 'GLOBAL') return true;
    
    if (encuesta.alcance === 'BLOQUE') {
      return encuesta.edificioId === usuarioActual.edificioId;
    }
    
    if (encuesta.alcance === 'DIRECTO') {
      // Solo la ve la familia dueña del destinoId
      return encuesta.destinoId === usuarioActual.id; 
    }

    return false;
  });

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-5xl mx-auto">
      {/* HEADER RESPONSIVO */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-gray-900">Consultas y Encuestas</h1>
          <p className="text-sm text-gray-500">Participación directa y toma de decisiones comunitarias.</p>
        </div>
        {esAdministrativo && (
          <button
            onClick={() => setMostrarForm(!mostrarForm)}
            className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition shadow-sm"
          >
            <Plus size={16} />
            {mostrarForm ? 'Cancelar' : 'Crear Encuesta'}
          </button>
        )}
      </div>

      {/* FORMULARIO DE CREACIÓN (SOLO VOCEROS / ADMINS) */}
      {mostrarForm && (
        <form onSubmit={manejarSubmit} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4 animate-fadeIn">
          <h3 className="text-sm font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
            📊 Configurar Nueva Consulta Comunitaria
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Pregunta Principal */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Pregunta o Consulta</label>
              <input
                type="text"
                value={pregunta}
                onChange={e => setPregunta(e.target.value)}
                placeholder="Ej: ¿Está de acuerdo con el nuevo horario de recolección de desechos?"
                className="w-full bg-gray-50 border border-gray-300 p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>

            {/* Selector de Alcance Quirúrgico */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Alcance de la Encuesta</label>
              <select
                value={alcance}
                onChange={e => setAlcance(e.target.value as any)}
                className="w-full bg-gray-50 border border-gray-300 p-2.5 rounded-xl text-sm font-semibold text-gray-700 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="GLOBAL">🌐 Toda la Urbanización</option>
                <option value="BLOQUE">🏢 Por Bloque Específico</option>
                <option value="DIRECTO">🏠 Mensaje / Encuesta Directa a Familia</option>
              </select>
            </div>
          </div>

          {/* Campos condicionales según el alcance */}
          {alcance === 'BLOQUE' && (
            <div className="bg-orange-50/60 p-3 rounded-xl border border-orange-100 max-w-xs animate-fadeIn">
              <label className="block text-xs font-bold text-orange-800 uppercase mb-1">Seleccionar Bloque Destino</label>
              <select value={bloqueSeleccionado} onChange={e => setBloqueSeleccionado(e.target.value)} className="w-full bg-white border border-orange-200 p-2 rounded-lg text-sm font-bold text-orange-900">
                <option value="B3">Bloque 3</option>
                <option value="B4">Bloque 4</option>
                <option value="B5">Bloque 5</option>
              </select>
            </div>
          )}

          {alcance === 'DIRECTO' && (
            <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-100 max-w-md animate-fadeIn">
              <label className="block text-xs font-bold text-emerald-800 uppercase mb-1">Seleccionar Jefe de Familia Destino</label>
              <select 
                value={familiaSeleccionada} 
                onChange={e => setFamiliaSeleccionada(e.target.value)} 
                className="w-full bg-white border border-emerald-200 p-2 rounded-lg text-sm text-emerald-950 font-medium"
                required
              >
                <option value="">-- Elige una Familia del Censo --</option>
                {familias.map(f => (
                  <option key={f.id} value={f.usuarioId}>
                    {f.jefeFamilia} ({f.bloque} - Apto {f.apartamento})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Sección Dinámica de Opciones */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-500 uppercase">Opciones de Respuesta</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {opciones.map((opcion, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={opcion}
                    onChange={e => manejarCambioOpcion(index, e.target.value)}
                    placeholder={`Opción ${index + 1}`}
                    className="w-full bg-gray-50 border p-2 rounded-lg text-sm focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    required
                  />
                  {opciones.length > 2 && (
                    <button type="button" onClick={() => removerOpcionCampo(index)} className="text-xs text-red-500 font-bold bg-red-50 px-2 py-2 rounded-lg hover:bg-red-100 transition">Eliminar</button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={agregarOpcionCampo}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 pt-1"
            >
              + Añadir otra opción
            </button>
          </div>

          <button type="submit" className="w-full bg-slate-900 text-white font-bold py-2.5 rounded-xl hover:bg-slate-800 transition text-sm shadow-sm">
            Publicar Consulta Oficial
          </button>
        </form>
      )}

      {/* RENDERIZADO DE ENCUESTAS EN FORMATO TARJETA MÓVIL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {encuestasVisibles.length === 0 ? (
          <div className="md:col-span-2 text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <BarChart3 className="mx-auto text-gray-300 mb-2" size={36} />
            <p className="text-gray-500 text-sm">No hay consultas activas para tu perfil o sector en este momento.</p>
          </div>
        ) : (
          encuestasVisibles.map((encuesta) => {
            const yaVoto = encuesta.votosResidentes.includes(usuarioActual.id);
            const totalVotos = encuesta.opciones.reduce((acc, curr) => acc + curr.votos, 0);

            return (
              <div key={encuesta.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition">
                
                {/* Indicadores de Alcance */}
                <div className="flex justify-between items-center">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 uppercase ${
                    encuesta.alcance === 'GLOBAL' ? 'bg-blue-100 text-blue-700' :
                    encuesta.alcance === 'BLOQUE' ? 'bg-orange-100 text-orange-700' : 'bg-purple-100 text-purple-700'
                  }`}>
                    {encuesta.alcance === 'GLOBAL' && <Users size={10} />}
                    {encuesta.alcance === 'BLOQUE' && <Building size={10} />}
                    {encuesta.alcance === 'DIRECTO' && <MessageSquare size={10} />}
                    {encuesta.alcance === 'GLOBAL' ? 'Consulta Global' : encuesta.alcance === 'BLOQUE' ? `Bloque ${encuesta.edificioId}` : 'Directo a Familia'}
                  </span>
                  
                  {yaVoto && (
                    <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <CheckCircle2 size={12} /> Tu hogar ya votó
                    </span>
                  )}
                </div>

                {/* Pregunta */}
                <h3 className="font-bold text-gray-900 text-base leading-snug">{encuesta.pregunta}</h3>

                {/* Opciones de Votación / Resultados */}
                <div className="space-y-2.5">
                  {encuesta.opciones.map((opc, idx) => {
                    // Cálculo de porcentaje seguro
                    const porcentaje = totalVotos > 0 ? Math.round((opc.votos / totalVotos) * 100) : 0;

                    return (
                      <div key={idx} className="relative">
                        {yaVoto || esAdministrativo ? (
                          /* RENDERIZADO DE RESULTADOS CON BARRAS LIQUIDAS */
                          <div className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl overflow-hidden text-sm">
                            <div 
                              className="absolute top-0 left-0 bottom-0 bg-indigo-50 transition-all duration-500 rounded-l-xl"
                              style={{ width: `${porcentaje}%` }}
                            />
                            <div className="relative flex justify-between font-medium text-gray-800">
                              <span>{opc.texto}</span>
                              <span className="font-bold text-indigo-700">{porcentaje}% <span className="text-xs font-normal text-gray-400">({opc.votos})</span></span>
                            </div>
                          </div>
                        ) : (
                          /* BOTÓN DE ACCIÓN PARA VOTAR (MÓVIL CÓMODO) */
                          <button
                            onClick={() => votarEncuesta(encuesta.id, idx, usuarioActual.id)}
                            className="w-full text-left bg-white hover:bg-indigo-50/40 border border-gray-200 hover:border-indigo-300 p-3 rounded-xl text-sm font-semibold text-gray-700 transition flex justify-between items-center group active:scale-[0.99]"
                          >
                            <span>{opc.texto}</span>
                            <Vote size={14} className="text-gray-300 group-hover:text-indigo-500 transition" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Pie de la tarjeta */}
                <div className="border-t pt-2.5 flex justify-between items-center text-xs text-gray-400 font-medium">
                  <span>Muestra total: {totalVotos} casas</span>
                  {esAdministrativo && (
                    <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-mono">ID: {encuesta.id}</span>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>
    </div>
  );
}