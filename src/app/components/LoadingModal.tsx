'use client';

import * as React from 'react';
import {
    Dialog,
    DialogContent,
    Typography,
    Box,
    CircularProgress,
    Fade,
    type DialogProps,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

export type LoadingModalProps = {
    /** 是否显示弹窗 */
    open: boolean;
    /** 标题 */
    title?: string;
    /** 内容文本 */
    content?: string;
    /** 自定义图标 */
    icon?: React.ReactNode;
    /** 弹窗状态：加载中、成功、失败 */
    variant?: 'loading' | 'success' | 'error';
    /** 关闭回调 */
    onClose?: () => void;
} & Pick<DialogProps, 'fullWidth' | 'maxWidth'>; // 从 MUI DialogProps 继承 fullWidth / maxWidth

export default function LoadingModal({
                                         open,
                                         title = 'Processing',
                                         content = 'Please wait...',
                                         icon,
                                         variant = 'loading',
                                         onClose,
                                         fullWidth = true,
                                         maxWidth = 'xs',
                                     }: LoadingModalProps) {
    /**
     * 根据状态渲染对应图标
     */
    const renderIcon = () => {
        if (icon) return icon;
        switch (variant) {
            case 'success':
                return <CheckCircleIcon sx={{ fontSize: 48, color: 'success.main' }} />;
            case 'error':
                return <ErrorIcon sx={{ fontSize: 48, color: 'error.main' }} />;
            default:
                return <CircularProgress size={48} color="primary" />;
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth={fullWidth}
            maxWidth={maxWidth}
            transitionDuration={300}
            TransitionComponent={Fade}
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: 3,
                        padding: 3,
                        textAlign: 'center',
                        alignItems: 'center',
                        minWidth: 280,
                        backgroundColor: '#fff',
                    },
                },
            }}
        >
            <DialogContent>
                <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                    {renderIcon()}
                    <Typography variant="h6" fontWeight={600}>
                        {title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {content}
                    </Typography>
                </Box>
            </DialogContent>
        </Dialog>
    );
}
