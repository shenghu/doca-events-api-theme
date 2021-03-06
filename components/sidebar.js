const React = require('react');
const Component = require('react-pure-render/component');
const ImmutablePropTypes = require('react-immutable-proptypes');
const _ = require('lodash');
const offsetTop = require('./helpers').offsetTop;


const getCategories = (schemas, search) =>
  schemas
    .filter(schema => {
      if (search) {
        if (!schema.get('title')) {
          return false;
        } else if (schema.get('title').toLowerCase().indexOf(search.toLowerCase()) === -1) {
          return false;
        }
        return true;
      }
      return true;
    });

class Sidebar extends Component {

  static propTypes = {
    schemas: ImmutablePropTypes.list.isRequired,
  };

  constructor() {
    super();
    this.handleScroll = _.throttle(this.handleScroll, 150);
  }

  state = {
    activeId: null,
    search: '',
  };

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('keydown', this.handleKeydown);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('keydown', this.handleKeydown);
  }

  handleSearchChange = (e) => {
    this.setState({ search: e.target.value });
  }

  cancelSearch = () => {
    this.setState({ search: '' });
  }

  handleKeydown = (e) => {
    // ESC
    if (e.keyCode === 27) {
      this.cancelSearch();
    }
  }

  // highlighting of sidebar links and section toggling
  handleScroll = () => {
    // list of all link #ids
    const ids = this.props.schemas.reduce((result, schema) => {
      let res = result;
      if (!schema.get('hidden')) {
        res = res.concat([`${schema.get('html_id')}-properties`]);
      }
      return res.concat(
        schema
          .get('links')
          .filter(link => !link.get('private'))
          .map(link => link.get('html_id'))
          .toJS()
      );
    }
      , []);

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop ||
      document.body.scrollTop || 0;

    // finds the first link that has top offset > top scroll position and breaks
    let activeId = null;
    // a small offset so the coming section is highlighted a bit sooner
    // before its main title touches the top of browser and starts disappearing
    const VERTICAL_OFFSET = 30;
    for (let i = 0; i < ids.length; i++) {
      if (offsetTop(document.getElementById(ids[i])) - VERTICAL_OFFSET > scrollTop) {
        activeId = ids[i > 0 ? i - 1 : i];
        break;
      }
    }

    // updates URL bar
    if (global.history) {
      global.history.replaceState({ id: activeId }, activeId, `#${activeId}`);
    }

    this.setState({ activeId });
  }

  render() {
    const { schemas } = this.props;
    const { activeId, search } = this.state;

    const groupedSchemas = schemas.groupBy(x => (x.get('category') ? x.get('category') : 'misc'))
      .mapEntries(([k, v]) => ([k, { category: k, schemas: v }])).toArray();

    const sortedSchemas = groupedSchemas.sort((a, b) =>
      a.category.toLowerCase().localeCompare(b.category.toLowerCase())
    );

    return (
      <nav id="sidebar-wrapper">
        <div className="search">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={this.handleSearchChange}
          />
        </div>
        {sortedSchemas.map((elem) => (
          <ul className="sidebar-nav" key={elem.category}>
            <li className="sidebar-category">{elem.category}</li>
          {getCategories(elem.schemas.filter(schema => !schema.get('hidden')), search).map(schema =>
            (<li
              key={schema.get('html_id')}
              className={schema.get('html_id') === activeId ? 'active' : ''}
            >
              <a href={`#${schema.get('html_id')}`}>
                  {schema.get('title')}
              </a>
            </li>)
          )}
          </ul>
          ))}
      </nav>
    );
  }
}

module.exports = Sidebar;
