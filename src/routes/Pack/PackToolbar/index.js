import React from 'react'
import { useLocation, useHistory, Link } from 'react-router-dom'
import styles from './styles.module.scss'
import { connect } from 'react-redux'
import { componentsPropTypes } from '../../../consts'
import IconButton from '@mui/material/IconButton'
import { MdSettings, MdDelete, MdFileDownload } from 'react-icons/md'
import { saveLocalPack } from 'localStorage/localPacks'
import DeleteConfirmationDialog from 'components/ConfirmationDialog/DeleteConfirmationDialog'
import SavingDialog from './SavingDialog'
import { mapPackState } from 'utils'
import { uuidRegex } from 'consts'
import { root, rounds, question } from '../pathRegexps.json'

PackToolbar.propTypes = {
  pack: componentsPropTypes.pack
}

function PackToolbar(props) {
  const confirmationDialogRef = React.useRef()
  const savingDialogRef = React.useRef()
  const history = useHistory()
  const { pathname } = useLocation()

  const handleSave = () => savingDialogRef.current.save(props.pack)
  const handleDeletePack = () => {
    confirmationDialogRef.current.confirmPackDeletion(props.pack.uuid)
  }

  const handleDeleteRound = async () => {
    if(!await confirmationDialogRef.current.confirmRoundDeletion()) return
    const pack = { ...props.pack }
    const roundIndex = parseInt(pathname.split(`/pack/${props.pack.uuid}/rounds/`, 2)[1])
    pack.rounds.splice(roundIndex - 1, 1)
    await saveLocalPack(pack)
    history.push(`/pack/${pack.uuid}`)
  }

  const handleDeleteQuestion = async () => {
    if(!await confirmationDialogRef.current.confirmDeleteQuestion()) return
    const pack = { ...props.pack }
    let [,round,themeIndex,questionPrice] = pathname.match(new RegExp(`/pack/${uuidRegex}/rounds/(\\d+)/themes/(\\d+)/questions/(\\d+)`))
    questionPrice = parseInt(questionPrice)
    const theme = props.pack.rounds[round-1].themes[themeIndex-1]
    const questionIndex = theme.questions.findIndex(({ price }) => price === Number(questionPrice))
    theme.questions.splice(questionIndex, 1)
    theme.questions = theme.questions.sort((a, b) => a.price - b.price)
    await saveLocalPack(pack)
    history.push(`/pack/${pack.uuid}/rounds/${round}`)
  }

  const buttons = props.pack && {
    [root]: [
      [handleSave, <MdFileDownload key='download' />],
      [`/pack/${props.pack.uuid}/settings`, <MdSettings key='settings' />],
      [handleDeletePack, <MdDelete key='delete' />, styles.delete]
    ],
    [rounds]: [
      [handleDeleteRound, <MdDelete key='delete' />, styles.delete]
    ],
    [question]: [
      [handleDeleteQuestion, <MdDelete key='delete' />, styles.delete]
    ]
  }

  const path = pathname.split(`/pack/${props.pack.uuid}`, 2)[1]
  const pageToolbar = Object.entries(buttons).find(
    ([regex, toolbar]) => new RegExp(`^${regex}/?$`).test(path) && toolbar
  )

  return (
    <>
      <div className={styles.buttons}>
        {pageToolbar && pageToolbar[1].map(([action, icon, styles], i) => <>
          {
            typeof action === 'string'
              ? <Link to={action} className={styles} key={i}>
                <IconButton>
                  {icon}
                </IconButton>
              </Link>
              : <IconButton className={styles} onClick={action} key={i}>
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

export default connect(mapPackState)(PackToolbar)
