import { useParams } from 'react-router-dom'
import PackBreadcrumbs from './PackBreadcrumbs'

export default function Pack(props) {
  const { packUUID } = useParams()
  return (
    <PackBreadcrumbs />
  )
}
