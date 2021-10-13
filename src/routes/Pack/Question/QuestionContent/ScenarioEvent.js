import PropTypes from 'prop-types'
import styles from './styles.module.scss'
import { MdDelete, MdExpandMore, MdImage, MdMusicNote, MdVideocam, MdShortText, MdRecordVoiceOver } from 'react-icons/md'
import Item from 'components/ItemsList/Item'
import Handle from 'components/ItemsList/Handle'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'

ScenarioEvent.propTypes = {
  index: PropTypes.number,
  item: PropTypes.object,
  onDelete: PropTypes.func,
  draggableId: PropTypes.number,
}
export default function ScenarioEvent(props) {
  const formatTime = time => `${time.toFixed(1)} cек.`

  const handleDelete = e => {
    e.stopPropagation()
    props.onDelete(props.index)
  }

  return (
    <Item
      index={props.index}
      draggableId={props.draggableId.toString()}
    >
      {(provided) => <Accordion>
        <AccordionSummary expandIcon={<MdExpandMore />}>
          <div className={styles.item}>
            <Handle provided={provided} />
            <Typography variant='body1' className={styles.itemType}>
              {{
                'image': 'Изображение',
                'voice': 'Аудио',
                'video': 'Видео',
                'text': 'Текст',
                'say': 'Слово ведущего'
              }[props.item.type]}
              <span className={styles.spacing} />
              {{
                'image': <MdImage />,
                'voice': <MdMusicNote />,
                'video': <MdVideocam />,
                'text': <MdShortText />,
                'say': <MdRecordVoiceOver />
              }[props.item.type]}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {formatTime(props.item.duration)}
            </Typography>
            <IconButton
              onClick={handleDelete}
              className={styles.delete}
            >
              <MdDelete className={styles.delete} />
            </IconButton>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          samara
        </AccordionDetails>
      </Accordion>}
    </Item>
  )
}
