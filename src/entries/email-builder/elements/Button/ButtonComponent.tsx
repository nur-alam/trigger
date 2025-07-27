import React from 'react';

const ButtonComponent = (props: { label: string; content: string; href?: string; position: string; size: string; style: any }) => {
    const { label, content, href, position, size, style } = props;
    const elementStyle = {
        // Typography styles
        fontFamily: `${style.typography.family}, ${style.typography.type}`,
        fontSize: `${style.typography.size}px`,
        lineHeight: style.typography.height,
        fontWeight: style.typography.weight,
        letterSpacing: `${style.typography.spacing}px`,

        // Color styles
        color: style.color.textColor,
        backgroundColor: style.color.backgroundColor,

        // Border styles
        borderColor: style.border.borderColor,
        borderWidth: `${style.border.borderWidth}px`,
        borderRadius: `${style.border.borderRadius}px`,
        borderStyle: style.border.borderStyle,

        // Spacing styles
        paddingTop: `${style.spacing?.paddingTop || 12}px`,
        paddingBottom: `${style.spacing?.paddingBottom || 12}px`,
        paddingLeft: `${style.spacing?.paddingLeft || 24}px`,
        paddingRight: `${style.spacing?.paddingRight || 24}px`,

        // Button specific styles
        display: 'inline-block',
        textDecoration: 'none',
        cursor: 'pointer',
        textAlign: 'center' as const,
    };

    return (
        <a href={href || '#'} style={elementStyle}>
            {content || 'Button'}
        </a>
    );
};

export default ButtonComponent;