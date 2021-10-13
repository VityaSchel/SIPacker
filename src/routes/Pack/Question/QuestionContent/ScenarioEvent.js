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
import TextField from '@mui/material/TextField'
import Slider from '@mui/material/Slider'
import Decimal from 'decimal.js'

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

  // 0.1 - 1.0 with step 0.1
  // 1.0 - 10.0 with step 0.5
  // 10.0 - 180.0 with step 1
  const step0_1 = new Array(1/0.1).fill().map((_, i) => new Decimal(0.1).times(i+1).toNumber())
  const step0_5 = new Array((10-1)/0.5).fill().map((_, i) => 1+(i+1)*0.5)
  const step1 = new Array((30-10)/1).fill().map((_, i) => 10+1+i)
  const step5 = new Array((60-30)/5).fill().map((_, i) => 30+(i+1)*5)
  const durationMarks = [...step0_1, ...step0_5, ...step1, ...step5].map((value, i) => ({ _label: value, value: i }))

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
          <div className={styles.duration}>
            <Slider
              defaultValue={durationMarks.find(({ _label }) => _label === 3).value}
              step={null}
              marks={durationMarks}
              min={durationMarks[0].value}
              max={durationMarks[durationMarks.length - 1].value}
              valueLabelDisplay='on'
              valueLabelFormat={i => durationMarks[i]._label}
            />
            <TextField
              label='Время'
              variant='outlined'
              size='small'
              type='number'
              InputProps={{ inputProps: { min: 0.1 } }}
              className={styles.time}
            />
          </div>
          {{
            'text': <TextField
              label='Введите текст'
              multiline
              rows={4}
              fullWidth
            />
          }[props.item.type]}
        </AccordionDetails>
      </Accordion>}
    </Item>
  )
}
