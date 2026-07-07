import { useApp } from '../context/AppContext';


export function MiFamiliaPage(){

const { familiaActual } = useApp();


if(!familiaActual){

return (

<div className="p-6 bg-white rounded-xl">

<h2 className="font-bold">

No tienes una familia registrada todavía

</h2>

<p className="text-gray-500">

Registra tu grupo familiar para enviarlo a aprobación.

</p>

</div>

)

}



return (

<div className="space-y-4">


<h1 className="text-2xl font-bold">

Mi Familia

</h1>



<div className="bg-white rounded-xl border p-5">


<h2 className="font-bold text-lg">

{familiaActual.jefeFamilia}

</h2>


<p>
Apartamento: {familiaActual.apartamento}
</p>


<p>
Estado:
{familiaActual.estado}
</p>


<h3 className="font-bold mt-4">

Integrantes:

</h3>


{

familiaActual.integrantes.map(i=>(

<div key={i.id} className="border rounded p-3 mt-2">

{i.nombre}

<br/>

{i.parentesco}

</div>

))

}



</div>


</div>

)

}