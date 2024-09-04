import { useState, useEffect } from 'react';
import styles from './posts.module.scss'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Post } from '../../types';

const POSTS_PER_PAGE = 10;

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

	const handleDelete = async (id: number) => {
		setLoading(true)
		try {
			const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
				method: 'DELETE',
			});

			if (response.ok) {
				setPosts(posts.filter(post => post.id !== id));
				toast.success('Post was deleted', { autoClose: 1000, hideProgressBar: true })
			} else {
				throw Error()
			}
		} catch {
			toast.error('Error occurred during deletion of post, retry.')
		}
		finally {
			setLoading(false)
		}
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
				{`Page ${currentPage}/${totalPageCount}`}
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
						<div className={styles.postContent}>
							<h2 className={styles.postTitle}>{post.title}</h2>
							<p className={styles.postBody}>{post.body}</p>
						</div>
						<div className={styles.postActions}>
							<button onClick={() => { }} className={styles.editButton}>Edit</button>
							<button onClick={() => handleDelete(post.id)} className={styles.deleteButton}>Delete</button>
						</div>
					</li>
				))}
			</ul>
			<Link to={'create-post'} className={styles.pageButton}>Create new post</Link>
		</div>
	);
}