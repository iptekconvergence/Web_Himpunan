import { usePage } from '@inertiajs/react';

interface ApplicationLogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src?: string;
}

export default function ApplicationLogo({ src, alt = "Logo Organisasi", className = "", ...props }: ApplicationLogoProps) {
    const page = usePage<any>();
    const logoSrc = src || page.props?.global_settings?.logo || page.props?.global_settings?.logo_url || page.props?.settings?.logo || '/img/logo_hmpsmi.png';

    return (
        <img 
            alt={alt}
            src={logoSrc}
            className={`object-contain ${className}`}
            {...props} 
        />
    );
}

