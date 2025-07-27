import React from 'react';

interface SocialIcon {
    platform: string;
    url: string;
    icon: string;
}

const SocialIconsComponent = (props: {
    label: string;
    icons: SocialIcon[];
    position: string;
    size: string;
    style: any
}) => {
    const { label, icons, position, size, style } = props;

    const containerStyle = {
        textAlign: style.alignment || 'center' as const,
        marginTop: `${style.spacing?.marginTop || 20}px`,
        marginBottom: `${style.spacing?.marginBottom || 20}px`,
        marginLeft: `${style.spacing?.marginLeft || 0}px`,
        marginRight: `${style.spacing?.marginRight || 0}px`,
    };

    const iconStyle = {
        width: `${style.dimensions?.iconSize || 32}px`,
        height: `${style.dimensions?.iconSize || 32}px`,
        marginLeft: `${style.spacing?.iconSpacing / 2 || 5}px`,
        marginRight: `${style.spacing?.iconSpacing / 2 || 5}px`,
        display: 'inline-block',
        verticalAlign: 'middle',
    };

    const linkStyle = {
        textDecoration: 'none',
        display: 'inline-block',
    };

    return (
        <div style={containerStyle}>
            {icons && icons.map((socialIcon, index) => (
                <a
                    key={index}
                    href={socialIcon.url}
                    style={linkStyle}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img
                        src={socialIcon.icon}
                        alt={socialIcon.platform}
                        style={iconStyle}
                    />
                </a>
            ))}
        </div>
    );
};

export default SocialIconsComponent;