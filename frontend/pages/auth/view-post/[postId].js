import React from 'react';
import { useRouter } from 'next/router';
import ViewPost from '../../../components/ViewPost';

const viewPostPage = () => {
    const router = useRouter();

    return <ViewPost postId={router.query.postId} />
};

export default viewPostPage;