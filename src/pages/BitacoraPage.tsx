import { ClipboardList } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function BitacoraPage() {

  const { bitacora } = useApp();

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">
          Bitácora del Sistema
        </h1>

        <p className="text-sm text-gray-500">
          Registro histórico de acciones realizadas dentro de la comunidad.
        </p>
      </div>


      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">

        <div className="p-3 px-4 border-b flex items-center gap-2">
          <ClipboardList size={16}/>
          <span className="text-xs font-bold text-gray-500 uppercase">
            Historial de movimientos
          </span>

          <span className="ml-auto bg-indigo-100 text-indigo-700 font-black text-xs px-2.5 py-0.5 rounded-full">
            {bitacora.length} registros
          </span>

        </div>


        <table className="w-full text-left border-collapse">

          <thead>

            <tr className="bg-gray-50 border-b text-[10px] font-bold text-gray-400 uppercase tracking-wider">

              <th className="p-3">
                Fecha
              </th>

              <th className="p-3">
                Usuario
              </th>

              <th className="p-3">
                Acción
              </th>

              <th className="p-3">
                Módulo
              </th>

              <th className="p-3">
                Descripción
              </th>

            </tr>

          </thead>


          <tbody className="divide-y text-xs text-gray-700">


          {bitacora.length === 0 ? (

            <tr>
              <td 
                colSpan={5}
                className="p-6 text-center text-gray-400 italic"
              >
                No existen registros todavía.
              </td>
            </tr>

          ) : (

            bitacora.map(b => (

              <tr 
                key={b.id}
                className="hover:bg-gray-50/60 transition"
              >

                <td className="p-3">
                  {b.fecha}
                </td>


                <td className="p-3">

                  <div className="font-bold text-gray-900">
                    {b.usuarioNombre}
                  </div>

                  <div className="text-[11px] text-gray-400">
                    {b.rol}
                  </div>

                </td>


                <td className="p-3">

                  <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full text-[10px] font-black">
                    {b.accion}
                  </span>

                </td>


                <td className="p-3">
                  {b.modulo}
                </td>


                <td className="p-3 text-gray-600">
                  {b.descripcion}
                </td>


              </tr>

            ))

          )}

          </tbody>


        </table>


      </div>

    </div>
  );
}