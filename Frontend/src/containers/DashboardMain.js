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

function DashboardMain() {
    const styles=useStyles();

    // const body=(
    //     <div className=
    // )
    return (
        <>
        <div>
            <div className='parteinicial'>
                <div>
                <Button color="success">Ver clientes que estan en el negocioaa</Button>
                <Button color="success">Registrar hora de entrada y salida de clientes</Button>
                </div>
            </div>
            <Grid container>
                {/* Botones para las ventanas modales */}
                <Grid item xs={12} md={3}>
                    <Box border={2}>
                
                        
                        </Box>
                </Grid>
                <Grid item xs={12} sm={3} md={3}>
                        <Box border={2}>
                            xs12
                            </Box>
                </Grid>
                <Grid item xs={12} sm={3} md={3}>
                        <Box border={2}>
                            xs12
                            </Box>
                </Grid>
                <Grid item xs={12} sm={3} md={3}>
                        <Box border={2}>
                            xs12
                            </Box>
                </Grid>
                <Grid item xs={12} sm={7} md={7}>
                        <Box border={2}>
                            xs12
                            </Box>
                </Grid>
                <Grid item xs={12} sm={5} md={5}>
                        <Box border={2}>
                            xs12
                            </Box>
                </Grid>
            </Grid>
        </div>
        </>
    )
}

export default DashboardMain