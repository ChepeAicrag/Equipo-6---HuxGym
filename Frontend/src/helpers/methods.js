import swal from 'sweetalert';

export const isEmpty = (obj) =>
  [Object, Array].includes((obj || {}).constructor) &&
  !Object.entries(obj || {}).length;

export const handleChangeInput = (e) => {
  const { name, value } = e.target;
  let regex = new RegExp("^[a-zA-Z ]+$");

  if (regex.test(value)) {
    console.log(name, value);
    this.setState({
      form: {
        ...this.state.form,
        [name]: value,
      },
    });
  } else {
    swal({
      text: "No se permiten números",
      icon: "info",
      button: "Aceptar",
      timer: "5000",
    });
  }
};

export const handleChangeInputNumber = (e) => {
  const { name, value } = e.target;
  let regex = new RegExp("^[0-9]+$");

  if (regex.test(value)) {
    console.log(name, value);
    this.setState({
      form: {
        ...this.state
          .form,
        [name]: value,
      },
    });
  } else {
    swal({
      text: "No se permiten letras",
      icon: "info",
      button: "Aceptar",
      timer: "5000",
    });
  }
};

export const handleChangeInputImage = (e) => {
  const { name } = e.target;
  const file = e.target.files[0];
  let regex = ["image/png", "image/jpeg", "image/jpg", "image/ico"]
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