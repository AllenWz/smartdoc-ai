import { fetchAuthSession, signIn, signOut } from 'aws-amplify/auth';

export async function getIdToken() {
    try {
        const session = await fetchAuthSession();
        return session.tokens?.idToken?.toString();
    } catch (err) {
        console.error('No active session', err);
        return null;
    }
}

export async function getUserProfile() {
    try {
        const session = await fetchAuthSession();
        const payload = session.tokens?.idToken?.payload;
        if (!payload) return null;

        return {
        userId: payload.sub,
        email: payload.email,
        department: payload['custom:department'] || 'General',
        role: payload['custom:role'] || 'USER',
        };
    } catch (err) {
        return null;
    }
}

export { signIn, signOut };