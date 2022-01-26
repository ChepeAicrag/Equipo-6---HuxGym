import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Crud.css";
import axios from "axios";
import swal from "sweetalert";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { isEmpty } from "../helpers/methods";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
const url = "https://www.api.huxgym.codes/user/";

function obtenerMes(date) {
  let fecha = new Date(date);
  let mounth = fecha.getUTCMonth() + 1;
  if (mounth < 10) {
    mounth = "0" + mounth;
  }
  
  return mounth;
}
function entidades(abre) {
  let res="--"
  if(abre==="1") res ="AS";
  if(abre==="2") res ="BC";
  if(abre==="3") res ="BS";
  if(abre==="4") res ="CC";
  if(abre==="5") res ="CL";
  if(abre==="6") res ="CM";
  if(abre==="7") res ="CS";
  if(abre==="8") res ="CH";
  if(abre==="9") res ="DF";
  if(abre==="10") res ="DG";
  if(abre==="11") res ="GT";
  if(abre==="12") res ="GR";
  if(abre==="13") res ="HG";
  if(abre==="14") res ="JC";
  if(abre==="15") res ="MC";
  if(abre==="16") res ="MN";
  if(abre==="17") res ="MS";
  if(abre==="18") res ="NT";
  if(abre==="19") res ="NL";
  if(abre==="20") res= "OC";
  if(abre==="21") res ="PL";
  if(abre==="22") res ="QQ";
  if(abre==="23") res ="QR";
  if(abre==="24") res ="SP";
  if(abre==="25") res ="SL";
  if(abre==="26") res ="SR";
  if(abre==="27") res ="TC";
  if(abre==="28") res ="TS";
  if(abre==="29") res ="TL";
  if(abre==="30") res ="VZ";
  if(abre==="31") res ="YN";
  if(abre==="32") res ="ZS";

  return res;
}

function obtenerDia(date) {
  let fecha = new Date(date);
  let day = fecha.getDate();
  if (day < 10) {
    day = "0" + day;
  }
  
  return day;
}

function obtnerDate(date) {
  let fecha = new Date(date);
  console.log(fecha);
  let year = fecha.getFullYear();
  let mounth = fecha.getUTCMonth() + 1;
  let day = fecha.getDate();
  if (mounth < 10) {
    mounth = "0" + mounth;
  }
  console.log(mounth + "aqui es");
  return year + "-" + mounth + "-" + day;
}
class TablaE extends Component {
  campos = {
    name: "nombre",
    age: "edad",
    gender: "genero",
    image: "imagen",
    phone: "télefono",
    image: "imagen",
  };

  state = {
    busqueda: "",
    dataBuscar:[],
    data: [] /* Aqui se almacena toda la informacion axios */,
    modalInsertar: false /* Esta es el estado para abrir y cerrar la ventana modal */,
    modalEliminar: false,
    empleados: [],
    estados: [],
    errors:{curp:null},
    
    form: {
      /* Aqui guardaremos los datos que el usuario introduce en el formulario */
      id: "",
      name: "",
      folio: "",
      paternal_surname: "",
      mothers_maiden_name: "",
      birthdate: obtnerDate(new Date()),
      entity_birth: "",
      curp: "",
      gender: "",
      image: "",
      phone: "",
      email: "",
      rol: 2,
      role: "",
      
    },
  };

  handleChange = async (e) => {
    /* handleChange se ejecuta cada vez que una tecla es presionada */
    e.persist();
    await this.setState({
      form: {
        ...this.state
          .form /* Con esto evitamos que los datos almacenados en el forma se borren */,
        /* con e.target.name seleccionamos el campo y con e.targe.value le asignamos la letra que se pulso */
        [e.target.name]: e.target.value,
      },
    });
    console.log(this.state.form);
  };

  manejadorCorreo = async () => {
    var expReg =
      /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
    try {
      const email = this.state.form.email;
      var esValido = expReg.test(email);
      if (!esValido) {
        swal({
          text: "Correo no valido",
          icon: "info",
          button: "Aceptar",
          timer: "3000",
        });
      }
    } catch (error) {
      swal({
        text: "Correo no valido",
        icon: "info",
        button: "Aceptar",
        timer: "3000",
      });
    }
  };
  /* state = {
    estados: [],
  };
 */
  perticionState = async () => {
    axios
      .get("https://www.api.huxgym.codes/state/")
      .then((response) => {
        console.log(response);
        this.setState({ estados: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  peticionGet = async () => {
    /* Con esto obtenemos los datos de la url(data) y lo almacenamos en data(data[]) */
    try {
      const res = await axios.get(url, {
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
        },
      });
      this.setState({
        /* Con esto accedemos a las variables de state y modificamos */
        data: res.data,
        dataBuscar: res.data,
      }); /* Almacenamos la data obtenida de response en la variable data(esta puede tener el nombre que queramos ponerle) */
    } catch (error) {
      console.log("hay un error en TablaE en la peticion Get");
      try {
        const msj = JSON.parse(error.request.response).message;
        if (msj === "Credenciales invalidas") {
          this.Expulsado();
        }
        console.log(msj);
      } catch (error2) {
        console.log(error2);
      }
    }
  };


  validar = (form) => {
    if (isEmpty(form))
      return { error: true, msj: "Debe rellenar los campos obligatorios" };

    const name = form.name;
    const gender = form.gender;
    const email = form.email;
    const phone = form.phone;
    const role = form.role;
    const curp = form.curp;
    const paternal_surname = form.paternal_surname;
    const maiden_name = form.mothers_maiden_name;
    

    if (
      isEmpty(name) &&
      isEmpty(phone) &&
      isEmpty(gender) &&
      isEmpty(role) &&
      isEmpty(email)
    )
      return {
        error: true,
        msj: "Los campos de nombre, telefono, género, son obligatorios",
      };
    if (isEmpty(name))
      return {
        error: true,
        msj: "El campo de nombre no puede estar vacío",
    };

    if (isEmpty(paternal_surname))
      return {
        error: true,
        msj: "El apellido paterno no puede estar vacío",
    };

    if (isEmpty(maiden_name))
      return {
        error: true,
        msj: "El apellido materno no puede estar vacío",
    };

    if (isEmpty(phone))
      return { error: true, msj: "El campo de telefono no puede estar vacío" };
    if (phone.length < 10)
      return { error: true, msj: "El campo de telefono debe tener 10 dígitos" };
    if (isEmpty(email))
      return {
        error: true,
        msj: "El campo de email no puede estar vacío",
      };
    if (isEmpty(gender))
      return { error: true, msj: "El campo de género no puede estar vacío" };
    if (isEmpty(role))
      return {
        error: true,
        msj: "El campo de role no puede estar vacío",
      };
    if(this.state.errors.curp){
      return {
        error: true,
        msj: "La curp esta incorrecta",
      };
    }  

    return { error: false };
  };

  crearFecha = (data) => {
    let dia = data.split("-")[2];
    let mes = data.split("-")[1] - 1;
    let anio = data.split("-")[0];
    let fecha = new Date(anio, mes, dia, 0, 0, 0);
    console.log("Fechaaa " + dia + "-" + mes + "-" + anio);
    return fecha;
  };

  peticionPost = async () => {
    /* Son asincronas por que se ejeuctan en segundo plano */
    /* Con esto enviamos los datos al servidor */
    try {
      const { form } = this.state;
      const validar = this.validar(form);
      if (validar.error) {
      
        swal({
          text: validar.msj,
          icon: "info",
          button: "Aceptar",
          timer: "5000",
        });
      } else {
        let formData = new FormData();
        if (
          typeof this.state.form.image !== "string" &&
          !isEmpty(this.state.form.image)
        )
          formData.append("image", form.image);
        formData.append("name", form.name.toUpperCase());

        formData.append("birthdate", obtnerDate(this.state.form.birthdate));
        formData.append("entity_birth", this.state.form.entity_birth);
        formData.append(
          "paternal_surname",
          this.state.form.paternal_surname.toUpperCase()
        );
        formData.append(
          "mothers_maiden_name",
          this.state.form.mothers_maiden_name.toUpperCase()
        );

        formData.append("curp", this.state.form.curp.toUpperCase());
        formData.append("gender", this.state.form.gender.toUpperCase());
        formData.append("email", this.state.form.email);
        formData.append("phone", this.state.form.phone);
        formData.append("role", this.state.form.role);

        const res = await axios.post(url, formData, {
          headers: {
            Authorization: "Token " + localStorage.getItem("token"),
          },
        });
        /* cambiamos el estado de modalInsertar y volvemos a pedir los datos*/
        if (res.status === 200 || res.status === 201) {
          this.modalInsertar();
          this.peticionGet();
          swal({
            text: "Empleado agregado satisfactoriamente",
            icon: "success",
            button: "Aceptar",
            timer: "5000",
          });
        }
      }
    } catch (error) {
      var msj = JSON.parse(error.request.response).message;
      console.log(msj);
      if (isEmpty(msj)) {
        const res = JSON.parse(error.request.response);
        const c = Object.keys(res)[0];
        console.log();
        msj = res[c]
          .toString()
          .replace("Este campo", "El campo " + this.campos[c]);
        swal({
          text: msj, //Array.isArray(msj) ? msj[0] : msj,
          icon: "error",
          button: "Aceptar",
          timer: "5000",
        });
      } else if (msj === "Credenciales invalidas") this.Expulsado();
      else
        swal({
          text: msj, //Array.isArray(msj) ? msj[0] : msj,
          icon: "error",
          button: "Aceptar",
          timer: "5000",
        });
    }
  };

  peticionPut = async () => {
    /* con put enviamos informacion al endpoint para modificar*/
    try {
      const { form } = this.state;
      const validar = this.validar(form);
      if (validar.error) {
        swal({
          text: validar.msj,
          icon: "info",
          button: "Aceptar",
          timer: "5000",
        });
      } else {
        let formData = new FormData();
        console.log(this.state.form.image);

        if (
          typeof this.state.form.image !== "string" &&
          !isEmpty(this.state.form.image)
        )
          formData.append("image", this.state.form.image);
        formData.append("name", this.state.form.name);
        formData.append("curp", this.state.form.curp.toUpperCase());
        formData.append(
          "paternal_surname",
          this.state.form.paternal_surname.toUpperCase()
        );
        formData.append(
          "mothers_maiden_name",
          this.state.form.mothers_maiden_name.toUpperCase()
        );
        formData.append("entity_birth", this.state.form.entity_birth);
        formData.append("gender", form.gender);
        formData.append("email", form.email);
        formData.append("phone", form.phone);
        // formData.append("role", parseInt(form.role));
        console.log(formData);
        const res = await axios.put(url + this.state.form.id + "/", formData, {
          headers: {
            Authorization: "Token " + localStorage.getItem("token"),
          },
        });
        if (res.status === 200 || res.status === 201) {
          this.modalInsertar(); /* Cambiamos el estado de modalInsertar y solicitamos de nuevo los datos */
          this.peticionGet();
          swal({
            text: "Empleado actualizado correctamente",
            icon: "success",
            button: "Aceptar",
            timer: "5000",
          });
        }
      }
    } catch (error) {
      const msj = JSON.parse(error.request.response).message;
      console.log(msj);
      if (msj === "Credenciales invalidas") this.Expulsado();
      swal({
        text: Array.isArray(msj) ? msj[0] : msj,
        icon: "error",
        button: "Aceptar",
        timer: "5000",
      });
    }
  };

  peticionDelete = async () => {
    /* Para eliminar, le pasamos la url */
    try {
      const res = await axios.delete(url + this.state.form.id + "/", {
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
        },
      });
      if (res.status === 200 || res.status === 201) {
        this.setState({
          modalEliminar: false,
        }); /* Cambiamos el estado de la variable modalEliminar */
        this.peticionGet(); /* Volvemos a pedir los datos */
        swal({
          text: "Empleado eliminado correctamente",
          icon: "success",
          button: "Aceptar",
          timer: "5000",
        });
      }
    } catch (error) {
      const msj = JSON.parse(error.request.response).message;
      console.log(msj);
      swal({
        text: Array.isArray(msj) ? msj[0] : msj,
        icon: "error",
        button: "Aceptar",
        timer: "5000",
      });
      if (msj === "Credenciales invalidas") this.Expulsado();
    }
  };

  componentDidMount() {
    /* Este metodo se ejecuta inmediatamente despues del renderizado */
    this.peticionGet();
    this.perticionState();
  }

  modalInsertar = () => {
    /* Con este metodo cambiamos el estado de la variable modal insertar */
    this.setState({ modalInsertar: !this.state.modalInsertar });
  };

  seleccionarUsuario = (empleados) => {
    /* Para obtener los datos del usuario a eliminar */
    this.setState({
      tipoModal: "actualizar",
      busqueda: "",
      form: {
        id: empleados.id,
        name: empleados.name,
        folio: empleados.folio,
        birthdate: this.crearFecha(empleados.birthdate),
        mothers_maiden_name: empleados.mothers_maiden_name,
        paternal_surname: empleados.paternal_surname,
        curp: empleados.curp,
        entity_birth: empleados.entity_birth,
        gender: empleados.gender,
        image: empleados.image,
        phone: empleados.phone,
        email: empleados.email,
        role: empleados.role,
      },
    });
  };

  Expulsado = () => {
    swal({
      text: "Credenciales invalidas, serás conducido al formulario de acceso",
      icon: "info",
      button: "Aceptar",
    }).then((respuesta) => {
      if (respuesta) {
        localStorage.removeItem("token");
        localStorage.removeItem("id");
        localStorage.removeItem("email");
        localStorage.removeItem("rol");
        localStorage.removeItem("role");
        window.location.href = "/";
      }
    });
  };

  buscador = async (e) => {
    e.persist();
    await  this.setState({ busqueda: e.target.value });
    console.log(this.state.busqueda);
    this.filtrarElementos();
  };

  filtrarElementos = () => {
    this.setState({ data: this.state.dataBuscar });
    if (this.state.busqueda != "") {
      var search = this.state.data.filter((item) => {
        if (item.name.toLowerCase().includes(this.state.busqueda.toLowerCase())
            | item.curp.toLowerCase().includes(this.state.busqueda.toLowerCase())
            | item.phone.toLowerCase().includes(this.state.busqueda.toLowerCase())
            | item.age.toString().toLowerCase().includes(this.state.busqueda.toLowerCase())
            | item.email.toLowerCase().includes(this.state.busqueda.toLowerCase())
            
           ) {
         
          return item;
        }
      });
      
      this.setState({ data: search });
    } else {
      this.setState({ data: this.state.dataBuscar });
    }
  };

async validarCurp(valor){
  
  let p = "XVXX999999SXXCCC??";
  let digitos=" 0123456789";
  let lyn= " ABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890"; 
  let letras= " ABCDEFGHIJKLMNOPQRSTUVWXYZ"; 
  let sexo=" HM";
  let l = p.length;;
  let v = valor;
  let m = v.length;
  let c = "A";
  let exe = 0;
  let e=0;
  let q;
  await this.setState(prevState => ({
          errors: {
              ...prevState.errors,
              curp: null,
        } }));
  let consonantes=" BCDFGHJKLMNPQRSTUVWXYZ";
  let vocales=" AEIOUX";
  if (v.charAt(0) !== "*") {
    for (let i = 0; i < m; i++) {
      
      c = "" + v.charAt(i);
      q = p.charAt(i);
      if (q === "?" && lyn.indexOf(c) < 1) {
        await this.setState(prevState => ({
          errors: {
              ...prevState.errors,
              curp: 'La posición '+(i+1) + "debe ser una letra o dígito (0-9)",
        }}));
        i = l + 1;
        if (exe === 0) e = e + 1;
      }
      if (q === "X" && letras.indexOf(c) < 1) {
        console.log("i "+i)
        await this.setState(prevState => ({
          errors: {
              ...prevState.errors,
              curp: "La posición " + (i+1) +" debe ser una letra",
        } }));
        i = l + 1;
        if (exe === 0) e = e + 1;
      }
      if (q === "V" && vocales.indexOf(c) < 1) {
        /* console.log("i "+i) */
        await this.setState(prevState => ({
          errors: {
              ...prevState.errors,
              curp: "La posición " +(i + 1) +" debe ser una vocal",
        }}))
        
        i = l + 1;
        if (exe === 0) e = e + 1;
      }
      if (q === "C" && consonantes.indexOf(c) < 1) {
        await this.setState(prevState => ({
          errors: {
              ...prevState.errors,
              curp: "La posición " +(i + 1) +" debe ser una consonante",
        }
        }))
        
        i = l + 1;
        if (exe === 0) e = e + 1;
      }
      if (q === "9" && digitos.indexOf(c) < 1) {
        console.log("i "+i)
        await this.setState(prevState => ({
          errors: {
              ...prevState.errors,
              curp: "La posición " + (i + 1) + " debe ser un número (0-9)",
        }
        }))
        
        i = l + 1;
        if (exe === 0) e = e + 1;
      }
      if (q === "S" && sexo.indexOf(c) < 1) {
        await this.setState(prevState => ({
          errors: {
              ...prevState.errors,
              curp: "La posición " +(i + 1) +" debe ser H(ombre) o M(ujer)",
        }
        }))
       
        i = l + 1;
        if (exe === 0) e = e + 1;
      }

      
    }
  } else {
    
  }

  if (v.length==2) {
    try{
      if(this.state.errors.curp==null | this.state.errors.curp==="Deben ser 18 posiciones"){
      if(!isEmpty(this.state.form.paternal_surname)){
        let contenido=this.state.form.paternal_surname.toString().substring(0,2).toUpperCase()
        if(v!==contenido){
          await this.setState(prevState => ({
            errors: {
                ...prevState.errors,
                curp: "Lo correcto seria "+contenido,
               }
             }))
        }
      }
        //console.log()
      }
    }catch(error){}
  }

  if (v.length==3) {
    try{
      let contenido=this.state.form.mothers_maiden_name.toString().substring(0,1).toUpperCase()
      console.log(contenido)
      if(this.state.errors.curp==null | this.state.errors.curp==="Deben ser 18 posiciones"){
      if(!isEmpty(this.state.form.mothers_maiden_name)){
        
        if(v.toString().substring(2,3)!==contenido){
          await this.setState(prevState => ({
            errors: {
                ...prevState.errors,
                curp: "En la posicion 3 seria "+contenido,
               }
             }))
        }
      }
        //console.log()
      }
    }catch(error){}
  }

  if (v.length===4) {
    try{
      let contenido=this.state.form.name.toString().substring(0,1).toUpperCase()
      console.log(contenido)
      if(this.state.errors.curp==null | this.state.errors.curp==="Deben ser 18 posiciones"){
      if(!isEmpty(this.state.form.name)){
        
        if(v.toString().substring(3,4)!==contenido){
          await this.setState(prevState => ({
            errors: {
                ...prevState.errors,
                curp: "En la posicion 4 seria "+contenido,
               }
             }))
        }
      }
        //console.log()
      }
    }catch(error){}
  }

  if (v.length===6) {
    try{
      let contenido=this.state.form.birthdate.getFullYear().toString().substring(1,3).toUpperCase()
      console.log(contenido)
      if(this.state.errors.curp==null | this.state.errors.curp==="Deben ser 18 posiciones"){
      if(!isEmpty(this.state.form.birthdate)){
        
        if(v.toString().substring(4,6)!==contenido){
          await this.setState(prevState => ({
            errors: {
                ...prevState.errors,
                curp: "En la posicion 5 y 6 seria "+contenido,
               }
             }))
        }
      }
      }
    }catch(error){}
  }

  if (v.length===8) {
    try{
      let contenido=obtenerMes(this.state.form.birthdate).toString()
      console.log(contenido)
      if(this.state.errors.curp==null | this.state.errors.curp==="Deben ser 18 posiciones"){
      if(!isEmpty(this.state.form.birthdate)){
        
        if(v.toString().substring(6,8)!==contenido){
          await this.setState(prevState => ({
            errors: {
                ...prevState.errors,
                curp: "En la posicion 7 y 8 seria "+contenido,
               }
             }))
        }
      }
      }
    }catch(error){}
  }

  if (v.length===10) {
    try{
      let contenido=obtenerDia(this.state.form.birthdate).toString()
      console.log(contenido)
      if(this.state.errors.curp==null | this.state.errors.curp==="Deben ser 18 posiciones"){
      if(!isEmpty(this.state.form.birthdate)){
        
        if(v.toString().substring(8,10)!==contenido){
          await this.setState(prevState => ({
            errors: {
                ...prevState.errors,
                curp: "En la posicion 9 y 10 seria "+contenido,
               }
             }))
        }
      }
      }
    }catch(error){}
  }

  if (v.length===11) {
    try{
      let contenido=this.state.form.gender.toString()
      console.log(contenido)
      if(this.state.errors.curp==null | this.state.errors.curp==="Deben ser 18 posiciones"){
      if(!isEmpty(this.state.form.gender)){
        
        if(v.toString().substring(10,11)!==contenido){
          await this.setState(prevState => ({
            errors: {
                ...prevState.errors,
                curp: "En la posicion 11 seria "+contenido,
               }
             }))
        }
      }
      }
    }catch(error){}
  }
//-----------------Estadossss----------------------------------------------------
  if (v.length===13) {
    try{
      let contenido=entidades(this.state.form.entity_birth.toString())
      console.log(contenido)
      if(this.state.errors.curp==null | this.state.errors.curp==="Deben ser 18 posiciones"){
      if(!isEmpty(this.state.form.entity_birth)){
        
        if(v.toString().substring(11,13)!==contenido){
          await this.setState(prevState => ({
            errors: {
                ...prevState.errors,
                curp: "En la posicion 12 y 13 tu entidad federativa es incorrecta debe ser " + contenido,
               }
             }))
        }
      }
      }
    }catch(error){}
  }

  if (v.length>=1 && v.length<18) {
    try{
      /* console.log(this.state.errors.curp) */
      if(!this.state.errors.curp){
        await this.setState(prevState => ({
          errors: {
              ...prevState.errors,
              curp: "Deben ser " + l + " posiciones",
             }
           }))
      }
    }catch(error){
  }
    if (exe === 0) e = e + 1;
  }
  if (e < 1) {
   
  }
}

handleChangeInputCURP = (e) => {
    const { name, value } = e.target;
    let value2=value.toUpperCase();
    this.validarCurp(value2);
    this.setState({
      form: {
        ...this.state.form,
        [name]: value2,
      },
    });
    // let regex = new RegExp("^[a-zA-Z ]+$");
    /* let regex = new RegExp("[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$");
    if (regex.test(value) || isEmpty(value)) {
      this.setState({
        form: {
          ...this.state.form,
          [name]: value,
        },
      });
    } else {
      e.target.value = "";
      swal({
        text: "Solo se permiten letras y acentos",
        icon: "info",
        button: "Aceptar",
        timer: "5000",
      });
    } */
};

changeEstado = (e) => {
    const { name, value } = e.target;
    
    this.setState({
      form: {
        ...this.state.form,
        [name]: value,
      },
    });
};

  handleChangeInput = (e) => {
    const { name, value } = e.target;
    let regex = new RegExp("[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$");

    if (regex.test(value) || isEmpty(value)) {
      this.setState({
        form: {
          ...this.state.form,
          [name]: value,
        },
      });
    } else {
      e.target.value = "";
      swal({
        text: "Solo se permiten letras y acentos",
        icon: "info",
        button: "Aceptar",
        timer: "5000",
      });
    }
  };

  handleChangeInputNumber = (e) => {
    const { name, value } = e.target;
    let regex = new RegExp("^[0-9]+$");

    if (regex.test(value) || isEmpty(value)) {
      this.setState({
        form: {
          ...this.state.form,
          [name]: value,
        },
      });
    } else {
      e.target.value = "";
      swal({
        text: "No se permiten letras",
        icon: "info",
        button: "Aceptar",
        timer: "5000",
      });
    }
  };

  handleDateChange = (e) => {
    this.setState({
      form: {
        ...this.state.form,
        birthdate: e,
      },
    });
  };

  handleChangeInputImage = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];
    let regex = ["image/png", "image/jpeg", "image/jpg", "image/ico"];
    if (typeof file !== undefined)
      if (regex.includes(file.type)) {
        this.setState({
          form: {
            ...this.state.form,
            [name]: file,
          },
        });
      } else {
        this.setState({
          form: {
            ...this.state.form,
            [name]: "",
          },
        });
        swal({
          text: "Formato de imágen invalido",
          icon: "info",
          button: "Aceptar",
          timer: "5000",
        });
      }
  };

  render() {
    const { form } = this.state;
    return (
      <div className="table-responsiveMain">
        <br />
        <div className="Busqueda">
          <button
            className="btn botones"
            onClick={() => {
              /* Cuando se presione el boton insertar se limpia el objeto form y se cambia el estado de la variable modalInsertar */
              this.setState({ form: null, tipoModal: "insertar" });
              this.modalInsertar();
            }}
          >
            {/* <i className="bx bxs-user">
              <box-icon
                type="solid"
                name="user"
                color="#fff"
                animation="tada"
              ></box-icon>
            </i> */}
            <AddCircleOutlineIcon fontSize="large"></AddCircleOutlineIcon> Nuevo
            Empleado
          </button>
          <div className="esp"></div>
          <input
            type="text"
            className="textField"
            name="busqueda"
            id="busqueda"
            placeholder="Buscar"
            onChange={this.buscador}
            value={this.state.busqueda}
          />
          <button type="submit" className="add-on" onClick={() => {}}>
            <i className="bx bxs-user">
              <box-icon name="search-alt-2" color="#fff"></box-icon>
            </i>
          </button>
        </div>
        <br></br>
        <br></br>
        <br />
        <div className="table-wrapper">
          <table className="tab-pane  table">
            <thead className="tablaHeader">
              <tr className="encabezado">
                <th>Curp</th>
                <th>Nombre completo</th>
                <th>Edad</th>
                <th>Género</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Foto</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody className="cuerpoTabla base">
              {this.state.data &&
                this.state.data.map((empleados) => {
                  /* Con esto recorremos todo nuestro arreglo data para rellenar filas */
                  return (
                    <tr>
                      <td>{empleados.curp}</td>
                      <td>{empleados.name}</td>
                      <td>{empleados.age}</td>
                      <td>{empleados.gender}</td>
                      <td>{empleados.phone}</td>
                      <td>{empleados.email}</td>
                      <td>
                        {empleados.role === 2 ? "Encargado" : "Instructor"}
                      </td>
                      <td>
                        <img
                          src={`https://www.api.huxgym.codes/${empleados.image}`}
                          width="170"
                          height="150"
                          align="center"
                        />
                      </td>
                      <td>
                        <button
                          className="btn btn-editar"
                          onClick={() => {
                            this.seleccionarUsuario(empleados);
                            this.modalInsertar();
                          }}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        {"  "}
                        {localStorage.getItem("rol") == "Administrador" ? (
                          <button
                            className="btn btn-danger"
                            onClick={() => {
                              this.seleccionarUsuario(empleados);
                              this.setState({ modalEliminar: true });
                            }}
                          >
                            <FontAwesomeIcon icon={faTrashAlt} />
                          </button>
                        ) : (
                          <></>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <Modal isOpen={this.state.modalInsertar}>
          {/* Al metodo isOpen se le pasa el valor de modalInsertar */}
          <ModalHeader style={{ display: "block" }}>
            Empleado
            <span style={{ float: "right" }}></span>
          </ModalHeader>

          <ModalBody>
            <div className="form-group">
              {this.state.tipoModal === "insertar" ? (
                <>
                  <label htmlFor="name">Nombre completo*:</label>
                  <input
                    className="form-control"
                    type="text"
                    name="name"
                    id="name"
                    maxlength="150"
                    placeholder="Nombre del empleado"
                    onChange={this.handleChangeInput}
                    value={form ? form.name : ""}
                  />
                  <br />
                </>
              ) : (
                <>
                  <label htmlFor="name">Nombre completo*:</label>
                  <input
                    className="form-control"
                    type="text"
                    name="name"
                    id="name"
                    disabled
                    maxlength="150"
                    placeholder="Nombre del empleado"
                    onChange={this.handleChangeInput}
                    value={form ? form.name : ""}
                  />
                  <br />
                </>
              )}
              {this.state.tipoModal === "insertar" ? (
                <>
                  <label htmlFor="name">Apellido Paterno*:</label>
                  <input
                    className="form-control"
                    type="text"
                    name="paternal_surname"
                    id="paternal_surname"
                    maxlength="150"
                    placeholder="Apellido Paterno"
                    onChange={this.handleChangeInput}
                    value={form ? form.paternal_surname : ""}
                  />
                  <br />
                </>
              ) : (
                <>
                  <label htmlFor="name">Apellido Paterno*:</label>
                  <input
                    className="form-control"
                    type="text"
                    name="paternal_surname"
                    id="paternal_surname"
                    maxlength="150"
                    disabled
                    placeholder="Apellido Paterno"
                    onChange={this.handleChangeInput}
                    value={form ? form.paternal_surname : ""}
                  />
                  <br />
                </>
              )}
              {this.state.tipoModal === "insertar" ? (
                <>
                  <label htmlFor="name">Apellido Materno*:</label>
                  <input
                    className="form-control"
                    type="text"
                    name="mothers_maiden_name"
                    id="mothers_maiden_name"
                    maxlength="150"
                    placeholder="Apellido Materno"
                    onChange={this.handleChangeInput}
                    value={form ? form.mothers_maiden_name : ""}
                  />
                  <br />
                </>
              ) : (
                <>
                  <label htmlFor="name">Apellido Materno*:</label>
                  <input
                    className="form-control"
                    type="text"
                    name="mothers_maiden_name"
                    id="mothers_maiden_name"
                    maxlength="150"
                    disabled
                    placeholder="Apellido Materno"
                    onChange={this.handleChangeInput}
                    value={form ? form.mothers_maiden_name : ""}
                  />
                  <br />
                </>
              )}

              {/* <br />
              <label htmlFor="age">Edad*:</label>
              
              <input
                className="form-control"
                type="number"
                name="age"
                id="age"
                min="18"
                max="99"
                placeholder="Edad en años"
                onChange={this.handleChangeInputNumber}
                value={form ? form.age : ""}
              /> */}

              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                {this.state.tipoModal === "insertar" ? (
                  <>
                    <label className="articulo mt-3">Fecha de Nacimiento</label>
                    <br />
                    <KeyboardDatePicker
                      className="fecha"
                      allowKeyboardControl={true}
                      id="birthdate"
                      format="yyyy-MM-dd"
                      value={form ? form.birthdate : new Date()}
                      onChange={this.handleDateChange}
                      animateYearScrolling={true}
                    />
                  </>
                ) : (
                  <>
                    <label className="articulo mt-3">Fecha de Nacimiento</label>
                    <br />
                    <KeyboardDatePicker
                      className="fecha"
                      allowKeyboardControl={true}
                      id="birthdate"
                      format="yyyy-MM-dd"
                      disabled
                      value={form ? form.birthdate : new Date()}
                      onChange={this.handleDateChange}
                      animateYearScrolling={true}
                    />
                  </>
                )}
              </MuiPickersUtilsProvider>
              <br />
              {this.state.tipoModal === "insertar" ? (
                <>
                  <label htmlFor="entity_birth">Estado*:</label>
                  <br />
                  <select
                    className="form-select"
                    aria-label="Default select example"
                    name="entity_birth"
                    id="entity_birth"
                    onChange={this.changeEstado}
                    value={form ? form.entity_birth : "1"}
                  >
                    {this.state.estados.map((elemento) => (
                      <option key={elemento.num} value={elemento.num}>
                        {elemento.name}
                      </option>
                    ))}
                  </select>
                  <br />
                </>
              ) : (
                <>
                  <label htmlFor="entity_birth">Estado*:</label>
                  <br />
                  <select
                    className="form-select"
                    aria-label="Default select example"
                    name="entity_birth"
                    id="entity_birth"
                    disabled
                    onChange={this.changeEstado}
                    value={form ? form.entity_birth : "1"}
                  >
                    {this.state.estados.map((elemento) => (
                      <option key={elemento.num} value={elemento.num}>
                        {elemento.name}
                      </option>
                    ))}
                  </select>
                  <br />
                </>
              )}
              {this.state.tipoModal === "insertar" ? (
                <>
                  <label className=" mt-3 " htmlFor="gender">Género*:</label>
                  <br />
                  <div className="" >
                    <label class="btn botonesForm m-1">
                      <input
                        type="radio"
                        name="gender"
                        value="H"
                        autocomplete="off"
                        onChange={this.handleChange}
                        
                      />{" "}
                      H
                    </label>
                    <label class="btn botonesForm m-1 ">
                      <input
                        type="radio"
                        name="gender"
                        value="M"
                        autocomplete="on"
                        onChange={this.handleChange}
                        
                      />{" "}
                      M
                    </label>
                  </div>
                  <br />
                </>
              ) : (
                <>
                  <label className=" mt-3 " htmlFor="gender">Género*:</label>
                  <br />
                  <div className="" >
                    <label class="btn botonesForm m-1">
                      <input
                        type="radio"
                        name="gender"
                        value="H"
                        autocomplete="off"
                        disabled
                        //onChange={this.handleChange}
                        checked={
                          form ? (form.gender === "H" ? "checked" : "") : "ff"
                          
                        }
                      />{" "}
                      H
                    </label>
                    <label class="btn botonesForm m-1 ">
                      <input
                        type="radio"
                        name="gender"
                        value="M"
                        disabled
                        autocomplete="on"
                        //onChange={this.handleChange}
                        checked={
                          form ? (form.gender === "M" ? "checked" : "") : "ff"
                          
                        }
                      />{" "}
                      M
                    </label>
                  </div>
                  <br />
                </>
              )}
              {this.state.tipoModal === "insertar" ? (
                <>
                  <label htmlFor="name">CURP*:</label>
                  <input
                    className="form-control"
                    type="text"
                    name="curp"
                    id="curp"
                    maxlength="150"
                    placeholder="CURP"
                    onChange={this.handleChangeInputCURP}
                    value={form ? form.curp : ""}
                  />
                  {this.state.errors && <p  className="errores mt-2">{this.state.errors.curp}</p>}
                </>
              ) : (
                <>
                  <label htmlFor="name">CURP*:</label>
                  <input
                    className="form-control"
                    disabled
                    type="text"
                    name="curp"
                    id="curp"
                    maxlength="150"
                    placeholder="CURP"
                    onChange={this.handleChangeInputCURP}
                    value={form ? form.curp : ""}
                  />
                </>
              )}
              
              <label htmlFor="phone">Teléfono*:</label>
              <input
                className="form-control"
                type="text"
                name="phone"
                id="phone"
                size="10"
                maxLength="10"
                placeholder="Teléfono"
                onChange={this.handleChangeInputNumber}
                value={form ? form.phone : ""}
              />
              <br />

              {this.state.tipoModal === "insertar" ? (
                <>
                  <label htmlFor="email">Email*:</label>
                  <input
                    className="form-control"
                    type="text"
                    name="email"
                    id="email"
                    maxlength="200"
                    placeholder="Email"
                    onChange={this.handleChange}
                    onBlur={this.manejadorCorreo}
                    value={form ? form.email : ""}
                  />
                </>
              ) : (
                <>
                  <label htmlFor="email">Email:</label>
                  <input
                    className="form-control"
                    type="text"
                    name="email"
                    id="email"
                    disabled
                    onChange={this.handleChange}
                    value={form ? form.email : ""}
                  />
                </>
              )}

              <br />
              <label htmlFor="image">Foto:</label>
              <input
                className="form-control"
                type="file"
                name="image"
                ref="file"
                id="image"
                placeholder="Seleccione su foto"
                accept="image/png, image/jpeg, image/jpg, image/ico"
                onChange={this.handleChangeInputImage}
              />
              

              {this.state.tipoModal === "insertar" ? (
                <>
                  <label htmlFor="role">Rol*: </label>
                  <br />
                  <div class="" >
                    <label class="btn botonesForm m-1">
                      <input
                        type="radio"
                        name="role"
                        value="2"
                        autocomplete="off"
                        onChange={this.handleChange}
                        
                      />{" "}
                      Encargado
                    </label>
                    <label class="btn botonesForm m-1">
                      <input
                        type="radio"
                        name="role"
                        value="3"
                        autocomplete="on"
                        onChange={this.handleChange}
                        
                      />{" "}
                      Instructor
                    </label>
                  </div>
                </>
              ) : (
                <>
                  <label htmlFor="role">Rol*: </label>
                  <br />
                  <div class="" >
                    <label class="btn botonesForm m-1">
                      <input
                        type="radio"
                        name="role"
                        value="2"
                        disabled
                        autocomplete="off"
                        onChange={this.handleChange}
                        checked={
                          form ? (form.role === 2 ? "checked" : "") : "ff"
                          
                        }
                      />{" "}
                      Encargado
                    </label>
                    <label class="btn botonesForm m-1 ">
                      <input
                        type="radio"
                        name="role"
                        value="3"
                        disabled
                        autocomplete="on"
                        onChange={this.handleChange}
                        checked={
                          form ? (form.role === 3 ? "checked" : "") : "ff"
                          
                        }
                      />{" "}
                      Instructor
                    </label>
                  </div>
                </>
              )}

              <br />
            </div>
          </ModalBody>

          <ModalFooter>
            {this.state.tipoModal === "insertar" ? (
              <button
                className="btn btn-success"
                onClick={() => this.peticionPost()}
              >
                Agregar
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => this.peticionPut()}
              >
                Actualizar
              </button>
            )}

            <button
              className="btn btn-danger"
              onClick={() => {
                this.modalInsertar();
              }}
            >
              Cancelar
            </button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.modalEliminar}>
          <ModalBody>
            <div className="form-group">
              <label htmlFor="name">Nombre completo:</label>
              <input
                className="form-control"
                type="text"
                name="name"
                id="name"
                readOnly
                onChange={this.handleChange}
                value={form ? form.name : ""}
              />
              <br />
              <label htmlFor="phone">Teléfono:</label>
              <input
                className="form-control"
                type="text"
                name="phone"
                id="phone"
                readOnly
                onChange={this.handleChange}
                value={form ? form.phone : ""}
              />
              <br />
              <label htmlFor="role">Rol:</label>
              <input
                className="form-control"
                type="text"
                name="role"
                id="role"
                readOnly
                onChange={this.handleChange}
                value={form ? form.role : ""}
              />
              <br />
              ¿Seguro de eliminar este empleado?
            </div>
          </ModalBody>
          <ModalFooter>
            <button
              className="btn btn-success"
              onClick={() => this.peticionDelete()}
            >
              Sí
            </button>
            <button
              className="btn btn-danger"
              onClick={() => this.setState({ modalEliminar: false })}
            >
              No
            </button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default TablaE;
