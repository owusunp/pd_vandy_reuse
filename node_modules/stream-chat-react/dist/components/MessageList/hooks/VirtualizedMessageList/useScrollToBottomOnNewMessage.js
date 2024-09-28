import React, { useCallback, useEffect } from 'react';
export const useScrollToBottomOnNewMessage = ({ messages, scrollToBottom, scrollToLatestMessageOnFocus, }) => {
    const [newMessagesReceivedInBackground, setNewMessagesReceivedInBackground] = React.useState(false);
    const resetNewMessagesReceivedInBackground = useCallback(() => {
        setNewMessagesReceivedInBackground(false);
    }, []);
    useEffect(() => {
        setNewMessagesReceivedInBackground(true);
    }, [messages]);
    const scrollToBottomIfConfigured = useCallback((event) => {
        if (!scrollToLatestMessageOnFocus ||
            !newMessagesReceivedInBackground ||
            event.target !== window)
            return;
        setTimeout(scrollToBottom, 100);
    }, [scrollToLatestMessageOnFocus, scrollToBottom, newMessagesReceivedInBackground]);
    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.addEventListener('focus', scrollToBottomIfConfigured);
            window.addEventListener('blur', resetNewMessagesReceivedInBackground);
        }
        return () => {
            window.removeEventListener('focus', scrollToBottomIfConfigured);
            window.removeEventListener('blur', resetNewMessagesReceivedInBackground);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scrollToBottomIfConfigured]);
};
