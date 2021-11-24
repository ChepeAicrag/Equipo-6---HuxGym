function Numeros(string){//Solo numeros
	var out = '';
    var filtro = '1234567890';//Caracteres validos
	
	//Recorrer el texto y verificar si el caracter se encuentra en la lista de validos 
    for (var i=0; i<string.length; i++)
       if (filtro.indexOf(string.charAt(i)) != -1) 
		   //Se añaden a la salida los caracteres validos
		   out += string.charAt(i);
	
	//Retornar valor filtrado
    return out;
}   

function NumText(string){//solo letras y numeros
	var out = '';
	//Se añaden las letras validas
    var filtro = 'abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZ1234567890';//Caracteres validos
	
    for (var i=0; i<string.length; i++)
       if (filtro.indexOf(string.charAt(i)) != -1) 
		   out += string.charAt(i);
    return out;
}

function Espacios(string){
	//Uso de split y join para buscar y reemplazar caracteres
	//Reemplazando espacios por guiones
    return string.split(" ").join("-");
}   


function Mayuculas(tx){
	//Retornar valor convertido a mayusculas
	return tx.toUpperCase();
}


//Tarjeta de Credito
//El valor es modificado directamente pos la funcion
function Card(event, el){//Validar nombre

	//Obteniendo posicion del cursor 
	var val = el.value;//Valor de la caja de texto
	var pos = val.slice(0, el.selectionStart).length;
	
	var out = '';//Salida
	var filtro = '1234567890';
	var v = 0;//Contador de caracteres validos
	
	//Filtar solo los numeros
    for (var i=0; i<val.length; i++){
       if (filtro.indexOf(val.charAt(i)) != -1){
		   v++;
		   out += val.charAt(i);
		   
		   //Agregando un espacio cada 4 caracteres
		   if((v==4) || (v==8) || (v==12))
			   out+=' ';
	   }
    }
	
	//Reemplazando el valor
	el.value = out;
	
	//En caso de modificar un numero reposicionar el cursor
	if(event.keyCode==8){//Tecla borrar precionada
		el.selectionStart = pos;
		el.selectionEnd = pos;
	}
} 