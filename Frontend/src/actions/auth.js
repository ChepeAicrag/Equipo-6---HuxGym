export const startChecking = () => {
  return async (dispatch) => {
    const response = await fetchWidthToken("refresh-token/");
    const body = await response.json();
    if (response.status === 200 || response.status === 201) {
      localStorage.setItem("token", body.token);
      localStorage.setItem("email", body.usuarios.email);
      localStorage.setItem("rol", body.usuarios.rol);

      dispatch(
        login({
          token: body.token,
          email: body.usuarios.email,
        })
      );
    } else {
      dispatch(checkingFinish());
    }
  };
};
