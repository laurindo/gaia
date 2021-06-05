import PropTypes from 'prop-types';
import { Content as LayoutContent } from './styles';
function Content({ children }) {
  return <LayoutContent>{children}</LayoutContent>;
}

Content.propTypes = {
  children: PropTypes.element.isRequired
};

export default Content;
