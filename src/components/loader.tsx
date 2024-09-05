import { BarLoader } from 'react-spinners';
import styles from './loader.module.scss';

export default function Loader() {
	return (
		<div className={styles.spinnerWrapper} >
			<BarLoader color="#00c2d5" />
		</div>
	)
}