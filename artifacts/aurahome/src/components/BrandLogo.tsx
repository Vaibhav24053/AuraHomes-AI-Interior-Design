import logoAsset from '../../../../attached_assets/aurahomes-logo-transparent.png';
import { handleImageError } from '@/lib/imageFallback';

export function BrandLogo({
  className = '',
  size = 'nav',
}: {
  className?: string;
  size?: 'nav' | 'footer' | 'flow';
}) {
  const dimensions = {
    nav: 'h-14 w-[122px] sm:h-16 sm:w-[132px]',
    footer: 'h-28 w-[185px]',
    flow: 'h-12 w-[106px]',
  }[size];

  return (
    <img
      src={logoAsset}
      alt="AuraHomes"
      onError={handleImageError}
      className={`${dimensions} object-contain ${className}`}
    />
  );
}