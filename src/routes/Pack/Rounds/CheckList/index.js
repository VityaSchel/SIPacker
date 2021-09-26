import PropTypes from 'prop-types'
import styles from './styles.module.scss'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import { connect } from 'react-redux'
import { useLocation } from 'react-router'
import { Link } from 'react-router-dom'
import { MdKeyboardArrowRight } from 'react-icons/md'
import cx from 'classnames'

CheckList.propTypes = { pack: PropTypes.object }
function CheckList(props) {
  const items = {
    required: [
      { name: 'Добавить авторов пака', link: '/pack/%packUUID%/settings/', done: Boolean(props.pack.authors) },
      { name: 'Добавить авторов пака', link: '/pack/%packUUID%/settings/', done: Boolean(props.pack.authors) },
      { name: 'Добавить авторов пака', link: '/pack/%packUUID%/settings/', done: Boolean(props.pack.authors) },
      { name: 'Добавить авторов пака', link: '/pack/%packUUID%/settings/', done: Boolean(props.pack.authors) }
    ],
    optional: [
      { name: 'Добавить иконку пака', link: '/pack/%packUUID%/settings/', done: Boolean(props.pack.icon) }
    ]
  }
  const reducer = (progress, point) => progress+Number(point.done)
  const progress = items.required.reduce(reducer, 0) + items.optional.reduce(reducer, 0)
  const max = items.required.length + items.optional.length

  return (
    <div className={styles.container}>
      <Typography variant='h6' className={styles.text}>Чеклист:</Typography>
      <div className={styles.progress}>
        <LinearProgress variant='determinate' value={progress/max*100} className={styles.progressBar} />
        <Typography variant='subtitle1' color='text.secondary'>Выполнено: {progress} из {max}</Typography>
      </div>
      <ol className={styles.list}>
        <Items starting>{items.required}</Items>
        <div className={styles.caption}>
          <span className={styles.line} />
          <Typography variant='overline' className={styles.text}>Можно публиковать пак</Typography>
          <span className={styles.line} />
        </div>
        <Items ending>{items.optional}</Items>
      </ol>
    </div>
  )
}

function Items(props) {
  return (
    props.children.map((item, i) => <Item
      key={i}
      first={props.starting && i === 0}
      last={props.ending && i === props.children.length-1}
    >{item}</Item>)
  )
}

Marker.propTypes = { first: PropTypes.bool, last: PropTypes.bool }
Item.propTypes = { children: PropTypes.node, ...Marker.propTypes }
function Item(props) {
  const location = useLocation()
  const path = location.pathname.split('/').filter(String)
  const packUUID = path[1]
  const link = props.children.link
    .replace('%packUUID%', packUUID)

  return (
    <li className={props.children.done && styles.done}>
      <Marker first={props.first} last={props.last} />
      <Link to={link} className={styles.link}>
        <span>{props.children.name}</span>
        <MdKeyboardArrowRight/>
      </Link>
    </li>
  )
}

function Marker(props) {
  return (
    <span className={styles.marker}>
      <span className={cx(styles.lineBefore, { [styles.hidden]: props.first })}/>
      <span className={styles.bullet}/>
      <span className={cx(styles.lineAfter, { [styles.hidden]: props.last })}></span>
    </span>
  )
}

export default connect(state => ({ pack: state.pack }))(CheckList)
