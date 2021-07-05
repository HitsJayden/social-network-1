import React from 'react';
import { useRouter } from 'next/router';

import ProfilePage from '../../../components/ProfilePage';

const profilePage = () => {
    const router = useRouter();

    return (
        <ProfilePage userId={router.query.userId} />
    )
};

profilePage.getInitialProps = async () => {
    return {};
};

export default profilePage;