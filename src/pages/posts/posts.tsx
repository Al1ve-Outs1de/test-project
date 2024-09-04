import { useState, useEffect, useCallback } from 'react';
import styles from './posts.module.scss'
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Post } from '../../types';
import PostItem from '../../components/post-item';

const POSTS_PER_PAGE = 10;

export default function PostsPage() {
	const [isLoading, setLoading] = useState(false);
	const [posts, setPosts] = useState<Post[]>([]);
	const [currentPage, setCurrentPage] = useState(useLocation().state?.currentPage as number || 1);
	const [totalPageCount, setTotalPageCount] = useState(0);

	useEffect(() => {
		setLoading(true)
		fetch(`https://jsonplaceholder.typicode.com/posts?_page=${currentPage}&_limit=${POSTS_PER_PAGE}`)
			.then(response => {
				const postsCount = +response.headers.get('x-total-count')!
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

	const handleDelete = useCallback(async (id: number) => {
		setLoading(true)
		try {
			const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
				method: 'DELETE',
			});

			if (response.ok) {
				setPosts(posts => posts.filter(post => post.id !== id));
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
	}, []);

	const handleSaveEdit = useCallback(async (editedPost: Post) => {
		try {
			const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${editedPost.id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					'title': editedPost.title,
					'body': editedPost.body
				}),
			});

			if (response.ok) {
				setPosts(posts => posts.map(post => (post.id === editedPost.id ? { ...editedPost } : post)));
				return true
			} else {
				throw Error()
			}
		} catch {
			toast.error('Could not send request, retry.')
			return false
		}
	}, [])

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
					<PostItem key={post.id} currentPage={currentPage} post={post} handleDelete={handleDelete} handleSaveEdit={handleSaveEdit} />
				))}
			</ul>
			<Link to={'create-post'} className={styles.pageButton}>Create new post</Link>
		</div>
	);
}