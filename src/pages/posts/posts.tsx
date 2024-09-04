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
	const [totalPageCount, setTotalPageCount] = useState(0);

	useEffect(() => {
		setLoading(true)
		fetch(`https://jsonplaceholder.typicode.com/posts?_page=${currentPage}&_limit=${POSTS_PER_PAGE}`)
			.then(response => {
				const postsCount = +response.headers.get('x-total-count')!
				setTotalCount(postsCount);
				setTotalPageCount(postsCount / POSTS_PER_PAGE)

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

	const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);
	// const paginationButtons = Array.from({ length: totalPages }, (_, index) => (
	// 	<button
	// 		key={index + 1}
	// 		onClick={() => setCurrentPage(index + 1)}
	// 		className={`${styles.pageButton} ${currentPage === index + 1 ? styles.active : ''}`}
	// 		disabled={isLoading}
	// 	>
	// 		{index + 1}
	// 	</button>
	// ));

	const getPaginationButtons = () => {
		const buttons = [];

		if (currentPage > 3) {
			buttons.push(
				<button
					key={1}
					onClick={() => setCurrentPage(1)}
					className={styles.pageButton}
				>
					1
				</button>
			);
			if (currentPage > 4) {
				buttons.push(<span key="ellipsis-start">...</span>);
			}
		}

		for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages, currentPage + 1); i++) {
			buttons.push(
				<button
					key={i}
					onClick={() => setCurrentPage(i)}
					className={`${styles.pageButton} ${currentPage === i ? styles.active : ''}`}
				>
					{i}
				</button>
			);
		}

		if (currentPage < totalPages - 2) {
			if (currentPage < totalPages - 3) {
				buttons.push(<span key="ellipsis-end">...</span>);
			}
			buttons.push(
				<button
					key={totalPages}
					onClick={() => setCurrentPage(totalPages)}
					className={styles.pageButton}
				>
					{totalPages}
				</button>
			);
		}

		return buttons;
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
				{getPaginationButtons()}
				<button
					onClick={handleNextPage}
					className={styles.pageButton}
					disabled={currentPage === totalPageCount || isLoading}
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
			<Link to={'create-post'} className={styles.pageButton}>Create new post</Link>
		</div>
	);
}