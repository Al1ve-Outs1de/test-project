import { Link } from 'react-router-dom';
import styles from './not-found.module.scss'

export default function NotFoundPage() {
	return (
		<div className={styles.container}>
			<h1 className={styles.title}>404 - Page Not Found</h1>
			<p className={styles.message}>This page doesn't exist.</p>
			<Link to="/" replace className={styles.link}>
				Go to the Posts Page
			</Link>
		</div>
	);
}