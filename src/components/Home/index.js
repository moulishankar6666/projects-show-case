import {Component} from 'react'
import Loader from 'react-loader-spinner'

import ProjectItem from '../ProjectItem'

import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatus = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Home extends Component {
  state = {projectsList: [], projectsType: 'ALL', status: apiStatus.initial}

  componentDidMount() {
    this.getProjectsList()
  }

  onChangeTypeOfProjects = event => {
    this.setState({projectsType: event.target.value}, this.getProjectsList)
  }

  getProjectsList = async () => {
    this.setState({status: apiStatus.inProgress})
    const {projectsType} = this.state
    try {
      const response = await fetch(
        `https://apis.ccbp.in/ps/projects?category=${projectsType}`,
      )
      const data = await response.json()
      const updatedData = data.projects.map(eachProject => ({
        id: eachProject.id,
        name: eachProject.name,
        imageUrl: eachProject.image_url,
      }))
      this.setState({projectsList: updatedData, status: apiStatus.success})
    } catch (error) {
      this.setState({status: apiStatus.failure})
    }
  }

  renderSuccessView = () => {
    const {projectsList} = this.state
    return (
      <ul className="projects-container">
        {projectsList.map(project => (
          <ProjectItem key={project.id} project={project} />
        ))}
      </ul>
    )
  }

  renderProgressView = () => (
    <div className="loader-container " data-testid="loader">
      <Loader color="#328af2" type="ThreeDots" />
    </div>
  )

  renderFailureView = () => (
    <div className="faliure-containers">
      <img
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button onClick={this.getProjectsList} type="button">
        Retry
      </button>
    </div>
  )

  renderProjectsList = () => {
    const {status} = this.state
    switch (status) {
      case apiStatus.success:
        return this.renderSuccessView()
      case apiStatus.inProgress:
        return this.renderProgressView()
      case apiStatus.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="projects-showcase-container">
        <nav className="nav-bar">
          <img
            alt="website logo"
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
          />
        </nav>
        <div className="projects-list-container">
          <select
            onChange={this.onChangeTypeOfProjects}
            className="projects-filter"
          >
            {categoriesList.map(eachType => (
              <option key={eachType.id} value={eachType.id}>
                {eachType.displayText}
              </option>
            ))}
          </select>
          {this.renderProjectsList()}
        </div>
      </div>
    )
  }
}
export default Home
