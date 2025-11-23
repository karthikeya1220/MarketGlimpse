import Link from 'next/link';

const FooterLink = ({ text, linkText, href }: FooterLinkProps) => {
  return (
    <div className="text-center pt-4">
      <p className="text-sm text-gray-500">
        {text}
        {` `}
        {/* @ts-expect-error - Next.js typed routes */}
        <Link href={href} className="footer-link">
          {linkText}
        </Link>
      </p>
    </div>
  );
};
export default FooterLink;
