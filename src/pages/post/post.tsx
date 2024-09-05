import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import styles from './post.module.scss';
import Loader from '../../components/loader';

type Post = {
	id: number;
	title: string;
	body: string;
};

export default function PostDetailPage() {
	const { id } = useParams<{ id: string }>();
	const state = useLocation().state as { currentPage?: string }
	const [post, setPost] = useState<Post | null>(null);

	useEffect(() => {
		fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
			.then(response => response.json())
			.then(data => setPost(data));
	}, [id]);

	if (!post) {
		return <Loader />
	}

	return (
		<div className={styles.container}>
			<Link to='/' state={{ currentPage: state?.currentPage || 1 }} className={styles.buttonBack}>Back to posts</Link>
			<h1 className={styles.title}>{post.title}</h1>
			<p className={styles.body}>{post.body}</p>
		</div>
	);
}