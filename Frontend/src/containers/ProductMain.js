import React, {useState} from 'react'
import {Box, Grid} from '@material-ui/core';
import {Modal, TextField, Button} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme)=>({
    modal:{
        position: 'absolute',
        width: '40%',
        backgroundColor: 'white',
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2,4,3),
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    }
}))


function ProductMain() {
    const styles=useStyles();

    // const body=(
    //     <div className=
    // )
    return (
        <div>
            <Grid container>

                {/* Botones para las ventanas modales */}
                <Grid item xs={4} md={4}>
                    <Box border={2}>                  
                        <Button color="success">Productos</Button>
                        </Box>
                </Grid>
                <Grid item xs={4} md={4}>
                        <Box border={2}>
                        <Button color="success">Proveedores</Button>
                            </Box>
                </Grid>
                <Grid item xs={4} md={4}>
                        <Box border={2}>
                        <Button color="success">Categorias</Button>
                            </Box>
                </Grid>
                <Grid item xs={6} md={6}>
                        <Box border={2}>
                        <Button color="success">Registrar nuevo producto</Button>
                            </Box>
                </Grid>
                <Grid item xs={6} md={6}>
                        <Box border={2}>
                        <Button color="success">Ver inventario</Button>
                            </Box>
                </Grid>
                <Grid item xs={12} md={12}>
                        <Box border={2}>
                           Filtros y tablas
                            </Box>
                </Grid>
            </Grid>
        </div>
    )
}

export default ProductMain;