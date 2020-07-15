import React, { useState, useEffect } from 'react'
import {
  Link
} from 'react-router-dom'
import CssBaseline from '@material-ui/core/CssBaseline'
import Grid from '@material-ui/core/Grid'
import Image from 'material-ui-image'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Particles from 'react-particles-js'
import Fab from '@material-ui/core/Fab'
import GradeIcon from '@material-ui/icons/Grade'
import PersonIcon from '@material-ui/icons/Person'
import Typography from '@material-ui/core/Typography'
import Tooltip from '@material-ui/core/Tooltip'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import 'animate.css'
import ky from 'ky'

import { useSnackbar } from 'notistack'

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(0),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    alignContent: 'center'
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  logodiv: {
    marginBottom: theme.spacing(8),
    backgroundColor: 'transparent '
  },
  logo: {
    cursor: 'pointer',
    width: '300px',
    maxWidth: '100%'
  },
  logo1: {
    cursor: 'pointer',
    margin: 'auto',
    '@media (max-height: 700px)': {
      maxWidth: '80%'
    }
  },
  slider: {
    backgroundColor: '#013b6c'
  },
  sliderstyle: {
    marginTop: theme.spacing(3)
  },
  margin: {
    marginTop: theme.spacing(4),
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
    backgroundColor: '#013b6c'
  },
  table1: {
    marginBottom: theme.spacing(4)
  },
  table2: {
    marginTop: theme.spacing(4)
  }
}))

export default function App () {
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()
  const [info, setInfo] = useState()

  const errorPrompt = async (message) => {
    enqueueSnackbar(message, { variant: 'error' })
  }

  const getLtik = () => {
    const searchParams = new URLSearchParams(window.location.search)
    const ltik = searchParams.get('ltik')
    if (!ltik) throw new Error('Missing lti key.')
    return ltik
  }

  const ltijs = async () => {
    const win = window.open('https://cvmcosta.me/ltijs', '_blank')
    win.focus()
  }

  useEffect(() => {
    const getInfo = async () => {
      try {
        const launchInfo = await ky.get('/info', { headers: { Authorization: 'Bearer ' + getLtik() } }).json()
        console.log(launchInfo)
        setInfo(launchInfo)
      } catch (err) {
        console.log(err)
        errorPrompt('Failed trying to retrieve custom parameters! ' + err)
      }
    }
    getInfo()
  }, [])

  return (
    <Container component='main' maxWidth='sm'>
      <Particles className='polygon' params={{
        width: '100%',
        height: '100%',
        particles: {
          number: {
            value: 40
          },
          size: {
            value: 3
          },
          color: {
            value: '#013b6c'
          }
        }
      }} />
      <CssBaseline />
      <div className={classes.paper}>

        <Grid container className={classes.logo}>
          <Grid item xs className={classes.logo1 + ' blank'}>
            <Image
              className={classes.logo}
              src='https://raw.githubusercontent.com/Cvmcosta/ltijs/987de79b9a3d529b1b507baa7b7a95d32ab386c2/docs/logo-300.svg?sanitize=true'
              onClick={ltijs}
              disableSpinner
            />
          </Grid>
        </Grid>
        {info ? [
          <>{ info.email || info.name
            ? <>
              <Typography variant='body1'>User Info</Typography>
              <TableContainer className={classes.table1 + ' animate__animated animate__fadeIn'} component={Paper}>
                <Table aria-label='simple table'>
                  <TableBody>
                    { info.name
                      ? <TableRow key='name'>
                        <TableCell component='th' scope='row'>
                          Name
                        </TableCell>
                        <TableCell align='right'>{info.name}</TableCell>
                      </TableRow>
                      : <></> }
                    { info.email
                      ? <TableRow key='email'>
                        <TableCell component='th' scope='row'>
                          Email
                        </TableCell>
                        <TableCell align='right'>{info.email}</TableCell>
                      </TableRow>
                      : <></> }
                  </TableBody>
                </Table>
              </TableContainer></> : <></>}</>,
          <>
            { info.roles
              ? <>
                <Typography variant='body1'>Roles</Typography>
                <TableContainer className={classes.table1 + ' animate__animated animate__fadeIn'} component={Paper}>
                  <Table aria-label='simple table'>
                    <TableBody>
                      { info.roles.map(role => (
                        <TableRow key='name'>
                          <TableCell component='th' scope='row'>
                            {role}
                          </TableCell>
                        </TableRow>
                      )) }
                    </TableBody>
                  </Table>
                </TableContainer>
              </> : <></> }
          </>,
          <>
            { info.context
              ? <>
                <Typography variant='body1'>Context</Typography>
                <TableContainer className={classes.table1 + ' animate__animated animate__fadeIn'} component={Paper}>
                  <Table aria-label='simple table'>
                    <TableBody>
                      { Object.entries(info.context).map((value, i) => (
                        <TableRow key={'context' + i}>
                          <TableCell component='th' scope='row'>
                            {value[0]}
                          </TableCell>
                          <TableCell align='right'>
                            {value[1]}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </> : <></> }
          </>
        ] : <></>}

        <Typography variant='body1'>Services</Typography>
        <Grid item xs >
          <Tooltip title='Grades Service' aria-label='grades'>
            <Link to={{
              pathname: '/grades',
              search: document.location.search
            }}>
              <Fab color='primary' aria-label='add' className={classes.margin}>
                <GradeIcon />
              </Fab>
            </Link>
          </Tooltip>
          <Tooltip title='Names and Roles Service' aria-label='namesandroles'>
            <Link to={{
              pathname: '/namesandroles',
              search: document.location.search
            }}>
              <Fab color='primary' aria-label='add' className={classes.margin}>
                <PersonIcon />
              </Fab>
            </Link>
          </Tooltip>
        </Grid>
      </div>
    </Container>
  )
}
