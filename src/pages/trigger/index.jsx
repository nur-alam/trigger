import { css } from '@emotion/react';
import Juicy from './juicy';
import Builder from '../../builder/index';

const color = 'white';

function Trigger() {
	return (
		<>
			<Builder />
		</>
	);
}

export default Trigger;

const styles = {
	wrapper: css`
		padding: 32px;
		background-color: hotpink;
		font-size: 24px;
		border-radius: 4px;
		&:hover {
			color: ${color};
		}
	`,
};
