import { Menu, Dropdown } from 'antd';
import PropTypes from 'prop-types';

import { StyledButton } from './styled';

const DropDown = ({ title, icon, options }) => {
  const overlay = (
    <Menu>
      {options.map(({ title, action }) => (
        <Menu.Item key={`menu-item-${title}`} onClick={action}>
          {title}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Dropdown
      className="drop-down"
      placement="bottomLeft"
      trigger={['click']}
      arrow
      {...{ overlay }}>
      <StyledButton {...{ icon }}>{title}</StyledButton>
    </Dropdown>
  );
};

DropDown.propTypes = {
  title: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      action: PropTypes.func.isRequired
    })
  ).isRequired,
  icon: PropTypes.node
};

DropDown.defaultProps = {
  icon: null
};

export default DropDown;
