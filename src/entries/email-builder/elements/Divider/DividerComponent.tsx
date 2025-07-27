import React from 'react';

const DividerComponent = (props: { label: string; position: string; size: string; style: any }) => {
    const { label, position, size, style } = props;

    const containerStyle = {
        textAlign: style.alignment || 'center' as const,
        marginTop: `${style.spacing?.marginTop || 20}px`,
        marginBottom: `${style.spacing?.marginBottom || 20}px`,
        marginLeft: `${style.spacing?.marginLeft || 0}px`,
        marginRight: `${style.spacing?.marginRight || 0}px`,
    };

    const dividerStyle = {
        width: style.dimensions?.width || '100%',
        height: `${style.dimensions?.height || 1}px`,
        backgroundColor: style.color?.backgroundColor || '#e0e0e0',
        border: 'none',
        margin: '0 auto',
        display: 'block',
    };

    return (
        <div style={containerStyle}>
            <hr style={dividerStyle} />
        </div>
    );
};

export default DividerComponent;