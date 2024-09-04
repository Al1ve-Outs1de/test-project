import { useState } from 'react';
import styles from './create-post.module.scss';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function CreatePostPage() {
	const [title, setTitle] = useState('');
	const [body, setBody] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setIsSubmitting(true);

		fetch('https://jsonplaceholder.typicode.com/posts', {
			method: 'POST',
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
			},
			body: JSON.stringify({
				title,
				body,
				userId: 1
			}),
		}).then((response) => {
			if (response.ok) {
				toast.success('New post created')
				setTitle('');
				setBody('');
			} else {
				throw Error();
			}
		})
			.catch(() => {
				toast.error('Error occurred. Please, try again.')
			})
			.finally(() => {
				setIsSubmitting(false);
			})
	};

	return (
		<div className={styles.container}>
			<Link to='/' className={styles.buttonBack}>Back to posts</Link>
			<h1 className={styles.title}>Create New Post</h1>
			<form onSubmit={handleSubmit} className={styles.form}>
				<input
					type="text"
					placeholder="Title"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					required
					className={styles.input}
				/>
				<textarea
					placeholder="Body"
					value={body}
					onChange={(e) => setBody(e.target.value)}
					required
					className={styles.textarea}
				/>
				<button type="submit" className={styles.submitButton} disabled={isSubmitting}>
					{isSubmitting ? 'Creating...' : 'Create Post'}
				</button>
			</form>
		</div>
	);
}
