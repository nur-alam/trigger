import React from 'react';

const ImageComponent = (props: { label: string; src?: string; alt?: string; position: string; size: string; style: any }) => {
    const { label, src, alt, position, size, style } = props;
    const elementStyle = {
        // Dimension styles
        width: style.dimensions?.width ? `${style.dimensions.width}px` : 'auto',
        height: style.dimensions?.height ? `${style.dimensions.height}px` : 'auto',
        maxWidth: style.dimensions?.maxWidth || '100%',

        // Border styles
        borderColor: style.border.borderColor,
        borderWidth: `${style.border.borderWidth}px`,
        borderRadius: `${style.border.borderRadius}px`,
        borderStyle: style.border.borderStyle,

        // Spacing styles
        marginTop: `${style.spacing?.marginTop || 0}px`,
        marginBottom: `${style.spacing?.marginBottom || 0}px`,
        marginLeft: `${style.spacing?.marginLeft || 0}px`,
        marginRight: `${style.spacing?.marginRight || 0}px`,

        // Alignment
        display: 'block',
        textAlign: style.alignment || 'left' as const,
    };

    const containerStyle = {
        textAlign: style.alignment || 'left' as const,
    };

    return (
        <div style={containerStyle}>
            <img
                src={src || 'https://via.placeholder.com/300x200'}
                alt={alt || 'Image'}
                style={elementStyle}
            />
        </div>
    );
};

export default ImageComponent;