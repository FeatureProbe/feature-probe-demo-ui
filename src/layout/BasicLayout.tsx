import { ReactElement } from 'react';

interface IProps {
  children: ReactElement
}

const BasicLayout = (props: IProps) => {
  return (
		<div>
      { props.children }
		</div>
	);
};

export default BasicLayout;