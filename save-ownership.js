// The browser holds this lock across both gameplay slots, including reincarnation.
// The lock callback stays pending for the entire writable document lifetime.
const SAVE_WRITER_LOCK = 'wandering-immortal:save-writer';

function createSaveOwnership(getLocks) {
    let state = 'idle';
    let releaseLock;

    function release() {
        state = 'stale';
        releaseLock?.();
        releaseLock = null;
    }

    async function start(onOwned, onBlocked) {
        if (state !== 'idle') return;
        state = 'pending';
        try {
            const locks = getLocks();
            if (typeof locks?.request !== 'function') {
                state = 'blocked';
                onBlocked('unsupported');
                return;
            }
            await locks.request(SAVE_WRITER_LOCK, { mode: 'exclusive', ifAvailable: true }, async lock => {
                if (state !== 'pending') return;
                if (!lock) {
                    state = 'blocked';
                    onBlocked('busy');
                    return;
                }
                const lifetime = new Promise(resolve => { releaseLock = resolve; });
                state = 'owned';
                try {
                    onOwned();
                } catch (error) {
                    release();
                    onBlocked('stale');
                    console.error('Save owner initialization failed', error);
                }
                await lifetime;
            });
        } catch (error) {
            if (state === 'stale') return;
            const reason = state === 'owned' ? 'stale' : 'unsupported';
            release();
            onBlocked(reason);
            console.error('Save ownership unavailable', error);
        }
    }

    return { start, release, canWrite: () => state === 'owned' };
}

const saveOwnership = createSaveOwnership(() => navigator.locks);
