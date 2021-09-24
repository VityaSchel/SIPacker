import React from 'react'
import PropTypes from 'prop-types'
import { useLocation, useHistory, Link } from 'react-router-dom'
import styles from './styles.module.scss'
import { connect } from 'react-redux'
import { componentsPropTypes } from '../../../consts'
import IconButton from '@mui/material/IconButton'
import { MdSettings, MdDelete, MdFileDownload } from 'react-icons/md'
import { deleteLocalPack } from 'localStorage/localPacks'
import DeleteConfirmationDialog from './DeleteConfirmationDialog'
import SavingDialog from './SavingDialog'

PackToolbar.propTypes = {
  pack: PropTypes.shape(componentsPropTypes.pack)
}

function PackToolbar(props) {
  const confirmationDialogRef = React.useRef()
  const savingDialogRef = React.useRef()
  const history = useHistory()

  const handleSave = () => savingDialogRef.current.save(props.pack)
  const handleDelete = async () => {
    const { confirmed, deleteFiles } = await confirmationDialogRef.current.open()
    if(confirmed) {
      await deleteLocalPack(props.pack.uuid)
      history.push('/')
    }
  }

  const buttons = props.pack && {
    [props.pack.uuid]: [
      [handleSave, <MdFileDownload key='download' />],
      [`${props.pack.uuid}/settings`, <MdSettings key='settings' />],
      [handleDelete, <MdDelete key='delete' />]
    ]
  }

  const { pathname } = useLocation()
  const path = pathname.split('/').filter(String)
  const pageToolbar = buttons[path[path.length - 1]]

  return (
    <>
      <div className={styles.buttons}>
        {pageToolbar && pageToolbar.map(([action, icon], i) => <>
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
      <DeleteConfirmationDialog ref={confirmationDialogRef} />
      <SavingDialog ref={savingDialogRef} />
    </>
  )
}

export default connect(state => ({ pack: state.pack }))(PackToolbar)
