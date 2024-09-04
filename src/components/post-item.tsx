import { Link } from 'react-router-dom'
import styles from './post-item.module.scss'
import { Post } from '../types'
import { memo, useState } from 'react';

interface PostItemProps {
	post: Post;
	currentPage: number;
	handleDelete: (id: number) => void;
	handleSaveEdit: (editedPost: Post) => Promise<boolean>;
}

function PostItem({ post, handleDelete, handleSaveEdit, currentPage }: PostItemProps) {
	const [isEditing, setEditing] = useState(false);
	const [postTitle, setTitle] = useState(post.title);
	const [postBody, setBody] = useState(post.body);

	return (
		<li key={post.id} className={styles.postItem}>
			{isEditing ?
				<div className={styles.editForm}>
					<input
						type="text"
						defaultValue={post.title}
						onChange={(e) => {
							setTitle(e.target.value)
						}}
						className={styles.editInput}
					/>
					<textarea
						className={styles.editTextarea}
						defaultValue={post.body}
						onChange={(e) => setBody(e.target.value)}
					/>
					<button onClick={() => {
						handleSaveEdit({ id: post.id, title: postTitle, body: postBody })
							.then((result) => setEditing(!result));
					}} className={styles.saveButton} disabled={post.title === postTitle && post.body === postBody}>
						Save
					</button>
					<button onClick={() => {
						setEditing(false);
						setTitle(post.title);
						setBody(post.body);
					}} className={styles.cancelButton}>
						Cancel
					</button>
				</div>
				:
				<>
					<div className={styles.postContent}>
						<Link to={`/post/${post.id}`} state={{ currentPage }} className={styles.postLink}>{post.title}</Link>
						<p className={styles.postBody}>{post.body}</p>
					</div>
					<div className={styles.postActions}>
						<button
							onClick={() => { setEditing(true) }}
							className={styles.editButton}
						>Edit</button>
						<button onClick={() => { handleDelete(post.id) }} className={styles.deleteButton} >Delete</button>
					</div>
				</>
			}
		</li >
	)
}

export default memo(PostItem);