import './index.css'

const ProjectItem = props => {
  const {project} = props
  const {name, imageUrl} = project
  return (
    <li className="project-item-container">
      <img alt={name} src={imageUrl} />
      <p>{name}</p>
    </li>
  )
}
export default ProjectItem
