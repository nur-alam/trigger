import { css } from '@emotion/react';

const color = 'white';

function Juicy() {
	return <div css={styles.wrapper}>Juicy</div>;
}

export default Juicy;

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
