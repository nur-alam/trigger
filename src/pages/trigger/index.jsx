import Builder from '../../dnd';
import { Provider, useSelector } from 'react-redux';
import store from '@src/dnd/store';

function Trigger() {
	return (
		<>
			<Provider store={store}>
				<Builder />
			</Provider>
		</>
	);
}

export default Trigger;
