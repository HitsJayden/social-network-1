import React from 'react';
import { useRouter } from 'next/router';

import ResetPasswordPage from '../../../components/ResetPasswordPage';

const resetPasswordFormPage = () => {
    const router = useRouter();

    return (
        <ResetPasswordPage userId={router.query.userId} resetToken={router.query.resetToken} />
    )
};

export default resetPasswordFormPage;