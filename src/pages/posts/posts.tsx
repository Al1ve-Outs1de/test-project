import { useState, useEffect } from 'react';
import styles from './posts.module.scss'
import { Link } from 'react-router-dom';

const POSTS_PER_PAGE = 10;

interface Post {
	id: number;
	title: string;
	body: string;
}

export default function PostsPage() {
	const [isLoading, setLoading] = useState(false);
	const [posts, setPosts] = useState<Post[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalCount, setTotalCount] = useState(0);

	useEffect(() => {
		setLoading(true)
		fetch(`https://jsonplaceholder.typicode.com/posts?_page=${currentPage}&_limit=${POSTS_PER_PAGE}`)
			.then(response => {
				const postsCount = +response.headers.get('x-total-count')!
				setTotalCount(postsCount);

				return response.json();
			})
			.then(data => setPosts(data))
			.finally(() => setLoading(false))
	}, [currentPage]);

	const handleNextPage = () => {
		setCurrentPage(prevPage => prevPage + 1);
	};

	const handlePreviousPage = () => {
		setCurrentPage(prevPage => prevPage - 1);
	};

	return (
		<div className={styles.container}>
			<h1 className={styles.title}>List of Blog posts</h1>
			<div className={styles.pagination}>
				<button
					onClick={handlePreviousPage}
					className={styles.pageButton}
					disabled={currentPage === 1 || isLoading}>
					Previous
				</button>
				<button
					onClick={handleNextPage}
					className={styles.pageButton}
					disabled={currentPage * POSTS_PER_PAGE > totalCount || isLoading}
				>
					Next
				</button>
			</div>
			<ul className={styles.postList}>
				{posts.map(post => (
					<li key={post.id} className={styles.postItem}>
						<Link to={`post/${post.id}`} className={styles.postLink}>{post.title}</Link>
					</li>
				))}
			</ul>

		</div>
	);
}