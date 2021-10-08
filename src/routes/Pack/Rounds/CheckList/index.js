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
  const hasAtLeast1Question = Boolean(
    props.pack.rounds.some(round =>
      round.themes.some(theme =>
        theme.questions.length
      )
    )
  )
  const hasAtLeast1Theme = Boolean(
    props.pack.rounds.some(round =>
      round.themes.length
    )
  )
  const has5ThemesInEachRound = props.pack.rounds.length && Boolean(
    props.pack.rounds.every(round =>
      round.themes.length >= 5
    )
  )
  const hasAtLeast25Questions = Boolean(
    props.pack.rounds.reduce(
      (prev, round) => prev+round.themes.reduce(
        (prev, theme) => prev+theme.questions.length, 0
      ), 0
    ) >= 25
  )
  const hasQuestionWithAuction = Boolean(
    props.pack.rounds.some(
      round => round.themes.some(
        theme => theme.questions.some(
          question => question.type === 'auction'
        )
      )
    )
  )
  const hasQuestionWithBagCat = Boolean(
    props.pack.rounds.some(
      round => round.themes.some(
        theme => theme.questions.some(
          question => question.type === 'bagcat'
        )
      )
    )
  )

  const items = {
    required: [
      { name: 'Добавить авторов пака', link: '/pack/%packUUID%/settings/', done: Boolean(props.pack.authors) },
      { name: 'Установить язык пака', link: '/pack/%packUUID%/settings/', done: Boolean(props.pack.language) },
      { name: 'Создать раунд', link: '/pack/%packUUID%/', done: Boolean(props.pack.rounds.length) },
      { name: 'Создать тему', link: props.pack.rounds.length && '/pack/%packUUID%/rounds/1', done: hasAtLeast1Theme },
      { name: 'Создать вопрос', link:
        props.pack.rounds.length &&
        props.pack.rounds[0].questions?.length &&
        '/pack/%packUUID%/rounds/1/1',
      done: hasAtLeast1Question }
      //Установить равное колво вопросов во всех темах одного раунда
    ],
    optional: [
      { name: 'Добавить иконку пака', link: '/pack/%packUUID%/settings/', done: Boolean(props.pack.icon) },
      { name: 'Добавить теги пака', link: '/pack/%packUUID%/settings/', done: Boolean(props.pack.tags) },
      { name: 'Добавить не менее 5 тем в каждом раунде', done: has5ThemesInEachRound },
      { name: 'Добавить не менее 25 вопросов всего', done: hasAtLeast25Questions },
      { name: 'Добавить вопрос со ставкой', done: hasQuestionWithAuction },
      { name: 'Добавить вопрос Кот в мешке', done: hasQuestionWithBagCat },
      { name: 'Сжать файлы, чтобы размер каждого был менее 1 МБ' }
    ]
  }
  const filterItems = f => f.filter(item => item.done !== undefined)
  const reducer = (progress, point) => progress+Number(point.done)
  const progress = filterItems(items.required).reduce(reducer, 0) + filterItems(items.optional).reduce(reducer, 0)
  const max = filterItems(items.required).length + filterItems(items.optional).length

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
  const link = props.children.link && props.children.link.replace('%packUUID%', packUUID)

  return (
    <li className={props.children.done && styles.done}>
      <Marker first={props.first} last={props.last} />
      { link
        ? <Link to={link} className={styles.link}>
          <span>{props.children.name}</span>
          <MdKeyboardArrowRight/>
        </Link>
        : <span>{props.children.name}</span>
      }
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
