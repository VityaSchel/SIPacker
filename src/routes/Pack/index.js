import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.module.scss'
import PackBreadcrumbs from './PackBreadcrumbs'
import Main from './Main'
import Settings from './Settings/'
import { connect } from 'react-redux'
import { componentsPropTypes } from '../../consts'
import { Link, useHistory } from 'react-router-dom'
import IconButton from '@mui/material/IconButton'
import { MdSettings, MdDelete, MdFileDownload } from 'react-icons/md'
import { deleteLocalPack } from 'localStorage/localPacks'
import ConfirmationDialog from 'components/ConfirmationDialog'
import SavingDialog from './SavingDialog'

_PackPageContainer.propTypes = {
  children: PropTypes.node,
  pack: PropTypes.shape(componentsPropTypes.pack),
  toolbar: PropTypes.string
}

function _PackPageContainer(props) {
  const [confirmationDialogProps, setConfirmationDialogProps] = React.useState({})
  const confirmationDialogRef = React.useRef()
  const savingDialogRef = React.useRef()
  const history = useHistory()

  const handleSave = () => savingDialogRef.current.save(props.pack)
  const handleDelete = async () => {
    setConfirmationDialogProps({
      title: '',
      description: 'Вы уверены, что хотите удалить пак? Он будет удален безвозвратно'
    })
    const isConfirmed = await confirmationDialogRef.current.open()
    if(isConfirmed) {
      deleteLocalPack(props.pack.uuid)
      history.push('/')
    }
  }

  const buttons = props.pack && {
    main: [
      [handleSave, <MdFileDownload key='download' />],
      [`${props.pack.uuid}/settings`, <MdSettings key='settings' />],
      [handleDelete, <MdDelete key='delete' />]
    ]
  }

  return (
    props.pack &&
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <PackBreadcrumbs />
        <div className={styles.buttons}>
          {buttons[props.toolbar] && buttons[props.toolbar].map(([action, icon], i) => <>
            {
              typeof action === 'string'
                ? <Link to={action} key={i}>
                  <IconButton>
                    {icon}
                  </IconButton>
                </Link>
                : <IconButton onClick={action}>
                  {icon}
                </IconButton>
            }
          </>)}
        </div>
      </div>
      <ConfirmationDialog ref={confirmationDialogRef} {...confirmationDialogProps} />
      <SavingDialog ref={savingDialogRef} />
      {props.children}
    </div>
  )
}

export const PackPageContainer = connect(state => ({ pack: state.pack }))(_PackPageContainer)

export function PackPageMain() {
  return (<PackPageContainer toolbar='main'><Main /></PackPageContainer>)
}

export function PackPageSettings() {
  return (<PackPageContainer><Settings /></PackPageContainer>)
}
